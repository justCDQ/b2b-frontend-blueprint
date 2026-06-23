export const recipes = {
  pageShell: {
    slots: ["root", "sidebar", "main"],
    states: ["default", "responsive-collapsed"]
  },
  pageHeader: {
    slots: ["root", "title", "description", "actions"],
    states: ["default", "loading"]
  },
  stateView: {
    slots: ["root", "marker", "title", "description", "action"],
    states: ["empty", "error", "forbidden", "not-found"]
  },
  statusBadge: {
    slots: ["root"],
    states: ["neutral", "success", "warning", "danger"]
  }
};
