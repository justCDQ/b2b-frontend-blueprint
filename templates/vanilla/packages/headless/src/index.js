function createEmitter(getSnapshot) {
  const subscribers = new Set();

  function notify() {
    const snapshot = getSnapshot();

    for (const subscriber of subscribers) {
      subscriber(snapshot);
    }
  }

  return {
    notify,
    subscribe(subscriber, { immediate = true } = {}) {
      subscribers.add(subscriber);

      if (immediate) {
        subscriber(getSnapshot());
      }

      return () => subscribers.delete(subscriber);
    }
  };
}

export function createDisclosure(initialOpen = false) {
  let isOpen = initialOpen;
  const emitter = createEmitter(() => isOpen);

  function setOpen(nextOpen) {
    if (isOpen === nextOpen) return;
    isOpen = nextOpen;
    emitter.notify();
  }

  return {
    getState() {
      return isOpen;
    },
    open() {
      setOpen(true);
    },
    close() {
      setOpen(false);
    },
    toggle() {
      setOpen(!isOpen);
    },
    subscribe: emitter.subscribe
  };
}

export function createPendingAction() {
  let pending = false;
  const emitter = createEmitter(() => ({ pending }));

  async function run(action) {
    if (pending) return { skipped: true };

    pending = true;
    emitter.notify();

    try {
      return { skipped: false, value: await action() };
    } finally {
      pending = false;
      emitter.notify();
    }
  }

  return {
    getState() {
      return { pending };
    },
    run,
    subscribe: emitter.subscribe
  };
}

export function createRequestRaceGuard() {
  let latestRequestId = 0;

  return {
    next() {
      latestRequestId += 1;
      return latestRequestId;
    },
    getLatestRequestId() {
      return latestRequestId;
    },
    isLatest(requestId) {
      return requestId === latestRequestId;
    },
    shouldCommit(requestId) {
      return requestId === latestRequestId;
    }
  };
}

export function createSelectionController({
  getKey,
  isDisabled = () => false,
  initialSelectedKeys = []
}) {
  const selectedKeys = new Set(initialSelectedKeys);
  const emitter = createEmitter(getState);

  function getSelectableKeys(items) {
    return items.filter((item) => !isDisabled(item)).map(getKey);
  }

  function emit() {
    emitter.notify();
  }

  function getState(items = []) {
    const selectableKeys = getSelectableKeys(items);
    const selectedSelectableKeys = selectableKeys.filter((key) => selectedKeys.has(key));

    return {
      selectedKeys: Array.from(selectedKeys),
      selectedCount: selectedKeys.size,
      selectableCount: selectableKeys.length,
      allSelected: selectableKeys.length > 0 && selectedSelectableKeys.length === selectableKeys.length,
      indeterminate:
        selectedSelectableKeys.length > 0 && selectedSelectableKeys.length < selectableKeys.length
    };
  }

  return {
    getState,
    getSelectedKeys() {
      return Array.from(selectedKeys);
    },
    isSelected(item) {
      return selectedKeys.has(getKey(item));
    },
    isDisabled,
    select(item) {
      if (isDisabled(item)) return;
      selectedKeys.add(getKey(item));
      emit();
    },
    deselect(item) {
      selectedKeys.delete(getKey(item));
      emit();
    },
    toggle(item) {
      if (isDisabled(item)) return;
      const key = getKey(item);

      if (selectedKeys.has(key)) {
        selectedKeys.delete(key);
      } else {
        selectedKeys.add(key);
      }

      emit();
    },
    selectAll(items) {
      for (const item of items) {
        if (!isDisabled(item)) {
          selectedKeys.add(getKey(item));
        }
      }

      emit();
    },
    toggleAll(items) {
      const state = getState(items);

      if (state.allSelected) {
        for (const key of getSelectableKeys(items)) {
          selectedKeys.delete(key);
        }
      } else {
        for (const item of items) {
          if (!isDisabled(item)) {
            selectedKeys.add(getKey(item));
          }
        }
      }

      emit();
    },
    reconcile(items) {
      const validKeys = new Set(items.map(getKey));
      let changed = false;

      for (const key of selectedKeys) {
        if (!validKeys.has(key)) {
          selectedKeys.delete(key);
          changed = true;
        }
      }

      if (changed) emit();
    },
    clear() {
      if (selectedKeys.size === 0) return;
      selectedKeys.clear();
      emit();
    },
    subscribe: emitter.subscribe
  };
}

export function createPaginationController({
  pageNum = 1,
  pageSize = 20,
  total = 0,
  pageSizeOptions = [20, 50, 100]
} = {}) {
  let state = normalizePagination({ pageNum, pageSize, total, pageSizeOptions });
  const emitter = createEmitter(() => state);

  function setState(nextState) {
    state = normalizePagination({ ...state, ...nextState });
    emitter.notify();
  }

  return {
    getState() {
      return state;
    },
    setPage(nextPageNum) {
      setState({ pageNum: nextPageNum });
    },
    setPageSize(nextPageSize) {
      setState({ pageNum: 1, pageSize: nextPageSize });
    },
    setTotal(nextTotal) {
      setState({ total: nextTotal });
    },
    reset() {
      setState({ pageNum: 1 });
    },
    subscribe: emitter.subscribe
  };
}

function normalizePagination({ pageNum, pageSize, total, pageSizeOptions }) {
  const safePageSize = Math.max(1, Number(pageSize) || 20);
  const safeTotal = Math.max(0, Number(total) || 0);
  const pageCount = Math.max(1, Math.ceil(safeTotal / safePageSize));
  const safePageNum = Math.min(Math.max(1, Number(pageNum) || 1), pageCount);

  return {
    pageNum: safePageNum,
    pageSize: safePageSize,
    total: safeTotal,
    pageCount,
    pageSizeOptions
  };
}

export function createFilterState({ defaults = {}, initialFilters = {} } = {}) {
  let filters = removeEmptyValues({ ...defaults, ...initialFilters });
  const emitter = createEmitter(getState);

  function getState() {
    return {
      filters: { ...filters },
      hasActiveFilters: hasFilterChanges(filters, defaults)
    };
  }

  function setFilters(nextFilters) {
    filters = removeEmptyValues({ ...filters, ...nextFilters });
    emitter.notify();
  }

  return {
    getState,
    setFilter(key, value) {
      setFilters({ [key]: value });
    },
    setFilters,
    reset() {
      filters = removeEmptyValues({ ...defaults });
      emitter.notify();
    },
    toSearchParams() {
      const params = new URLSearchParams();

      for (const [key, value] of Object.entries(filters)) {
        if (Array.isArray(value)) {
          for (const item of value) {
            params.append(key, String(item));
          }
        } else {
          params.set(key, String(value));
        }
      }

      return params;
    },
    fromSearchParams(searchParams) {
      const nextFilters = {};

      for (const key of searchParams.keys()) {
        const values = searchParams.getAll(key);
        nextFilters[key] = values.length > 1 ? values : values[0];
      }

      filters = removeEmptyValues({ ...defaults, ...nextFilters });
      emitter.notify();
    },
    subscribe: emitter.subscribe
  };
}

function removeEmptyValues(values) {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== null && value !== "";
    })
  );
}

function hasFilterChanges(filters, defaults) {
  const keys = new Set([...Object.keys(filters), ...Object.keys(defaults)]);

  for (const key of keys) {
    if (JSON.stringify(filters[key]) !== JSON.stringify(defaults[key])) {
      return true;
    }
  }

  return false;
}

export function createListQueryController({
  filterDefaults = {},
  initialFilters = {},
  pageNum = 1,
  pageSize = 20,
  total = 0,
  sortBy,
  sortOrder
} = {}) {
  const filters = createFilterState({ defaults: filterDefaults, initialFilters });
  const pagination = createPaginationController({ pageNum, pageSize, total });
  let sort = { sortBy, sortOrder };
  const emitter = createEmitter(getState);

  function getState() {
    return {
      ...filters.getState(),
      pagination: pagination.getState(),
      sort: { ...sort }
    };
  }

  filters.subscribe(() => {
    pagination.reset();
    emitter.notify();
  }, { immediate: false });

  pagination.subscribe(() => {
    emitter.notify();
  }, { immediate: false });

  return {
    getState,
    filters,
    pagination,
    setSort(nextSortBy, nextSortOrder) {
      sort = { sortBy: nextSortBy, sortOrder: nextSortOrder };
      pagination.reset();
      emitter.notify();
    },
    toQueryObject() {
      const { filters: currentFilters, pagination: currentPagination } = getState();

      return {
        ...currentFilters,
        pageNum: currentPagination.pageNum,
        pageSize: currentPagination.pageSize,
        ...removeEmptyValues(sort)
      };
    },
    subscribe: emitter.subscribe
  };
}
