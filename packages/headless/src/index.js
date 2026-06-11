export function createDisclosure(initialOpen = false) {
  let isOpen = initialOpen;
  const subscribers = new Set();

  function notify() {
    for (const subscriber of subscribers) {
      subscriber(isOpen);
    }
  }

  return {
    getState() {
      return isOpen;
    },
    open() {
      isOpen = true;
      notify();
    },
    close() {
      isOpen = false;
      notify();
    },
    toggle() {
      isOpen = !isOpen;
      notify();
    },
    subscribe(subscriber) {
      subscribers.add(subscriber);
      subscriber(isOpen);
      return () => subscribers.delete(subscriber);
    }
  };
}

export function createSelectionController({ getKey, isDisabled = () => false }) {
  const selectedKeys = new Set();

  return {
    getSelectedKeys() {
      return Array.from(selectedKeys);
    },
    isSelected(item) {
      return selectedKeys.has(getKey(item));
    },
    toggle(item) {
      if (isDisabled(item)) return;
      const key = getKey(item);

      if (selectedKeys.has(key)) {
        selectedKeys.delete(key);
      } else {
        selectedKeys.add(key);
      }
    },
    clear() {
      selectedKeys.clear();
    }
  };
}

export function createPendingAction() {
  let pending = false;

  return async function run(action) {
    if (pending) return { skipped: true };
    pending = true;

    try {
      return { skipped: false, value: await action() };
    } finally {
      pending = false;
    }
  };
}

export function createRequestRaceGuard() {
  let latestRequestId = 0;

  return {
    next() {
      latestRequestId += 1;
      return latestRequestId;
    },
    isLatest(requestId) {
      return requestId === latestRequestId;
    }
  };
}
