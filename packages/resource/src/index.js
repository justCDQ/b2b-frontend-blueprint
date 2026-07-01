import { createListQueryController, createPendingAction, createRequestRaceGuard, createSelectionController } from "../../headless/src/index.js";

export function createModuleRegistry(modules = []) {
  const items = new Map(modules.map((module) => [module.key, module]));

  return {
    all() {
      return Array.from(items.values());
    },
    get(key) {
      return items.get(key);
    },
    enabled(keys = []) {
      const allowed = new Set(keys);
      return this.all().filter((module) => allowed.has(module.key));
    },
    register(module) {
      items.set(module.key, module);
      return module;
    }
  };
}

export function createResourceModule(definition) {
  return {
    key: definition.key,
    label: definition.label,
    navLabel: definition.navLabel || definition.label,
    description: definition.description || "",
    resource: definition.resource || definition.key,
    requiredPermission: definition.requiredPermission,
    columns: definition.columns || [],
    filters: definition.filters || [],
    form: definition.form,
    actions: definition.actions || [],
    api: definition.api,
    importContract: definition.importContract
  };
}

export function createCrudController({
  resource,
  api,
  auth,
  getKey = (record) => record.id,
  pageSize = 20
}) {
  const query = createListQueryController({
    pageNum: 1,
    pageSize,
    total: 0
  });
  const race = createRequestRaceGuard();
  const saveAction = createPendingAction();
  const deleteAction = createPendingAction();
  const selection = createSelectionController({
    getKey,
    isDisabled: (record) => !auth?.can?.("batch", resource.resource, record)
  });

  let rows = [];
  let loading = false;
  let error = null;

  async function load() {
    const requestId = race.next();
    loading = true;
    error = null;

    try {
      const response = await api.query(query.toQueryObject());
      if (!race.shouldCommit(requestId)) return getState();
      rows = response.list;
      query.pagination.setTotal(response.total);
      selection.reconcile(rows);
    } catch (nextError) {
      if (!race.shouldCommit(requestId)) return getState();
      rows = [];
      error = nextError;
    } finally {
      if (race.shouldCommit(requestId)) loading = false;
    }

    return getState();
  }

  function getState() {
    return {
      rows,
      loading,
      error,
      query: query.getState(),
      selection: selection.getState(rows)
    };
  }

  return {
    getState,
    query,
    selection,
    load,
    async save(record) {
      return saveAction.run(async () => {
        const result = record.id ? await api.update(record.id, record) : await api.create(record);
        await load();
        return result;
      });
    },
    async delete(record) {
      return deleteAction.run(async () => {
        const result = await api.delete(getKey(record));
        await load();
        return result;
      });
    },
    async runAction(action, record) {
      const result = await action.run(record);
      await load();
      return result;
    }
  };
}
