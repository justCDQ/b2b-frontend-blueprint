# Add Resource Module

Resource modules are the recommended way to add business pages to a generated console.

A resource module describes one manageable business object, such as users, activities, products, orders, coupons, or configurations.

## File Location

For simple projects, place resource modules under:

```text
packages/data/src/
```

For larger projects, you can move them to:

```text
apps/web/src/features/{resource}/
```

Keep the same contract either way.

## Minimal Shape

A resource module should export:

```js
export const productResource = createResourceModule({
  key: "products",
  label: "Product Management",
  navLabel: "Products",
  resource: "product",
  description: "Manage product listing, status, and metadata.",
  filters: [],
  columns: [],
  form: productFormSchema,
  actions: [],
  api: productApi,
  importContract: productImportContract
});
```

## Step 1: Define Form Schema

```js
import { createFormSchema } from "../../form-schema/src/index.js";

export const productFormSchema = createFormSchema([
  { name: "name", label: "Product name", type: "input", required: true, maxLength: 80 },
  { name: "status", label: "Status", type: "select", required: true, options: ["draft", "online", "offline"] },
  { name: "price", label: "Price", type: "number", required: true }
]);
```

The schema is used for:

- initial form values
- required validation
- simple rule validation
- future form rendering

## Step 2: Define API Contract

```js
export const productApi = {
  query: (query) => client.get("/products", { query }),
  create: (input) => client.post("/products", input),
  update: (id, patch) => client.patch(`/products/${id}`, patch),
  delete: (id) => client.delete(`/products/${id}`)
};
```

The CRUD controller expects this shape.

## Step 3: Define Filters And Columns

```js
filters: [
  { name: "keyword", label: "Keyword", type: "search" },
  { name: "status", label: "Status", type: "select", options: ["draft", "online", "offline"] }
],
columns: [
  { key: "name", label: "Product name" },
  { key: "status", label: "Status" },
  { key: "price", label: "Price" },
  { key: "updatedAt", label: "Updated" }
]
```

Keep columns stable and predictable. Use a detail page or dialog when a record has too much information for the table.

## Step 4: Define Actions

```js
actions: [
  { key: "edit", label: "Edit", scope: "row" },
  { key: "delete", label: "Delete", scope: "row", danger: true }
]
```

Rules:

- Dangerous actions must use ConfirmDialog.
- Pending actions must prevent duplicate clicks.
- Permission failures should become disabled state with reason.

## Step 5: Enable The Module

Add the module key to `blueprint.config.js`:

```js
export default {
  enabledModules: ["products"]
};
```

Or generate a project with:

```bash
node scripts/create-blueprint.mjs my-console --modules products
```

The current local scaffold only validates built-in module keys. Add new supported module keys to `scripts/create-blueprint.mjs` when you productize them.

## Step 6: Connect To Module Registry

Register the module:

```js
const moduleRegistry = createModuleRegistry([
  productResource
]);
```

The page shell can then render navigation and pages from `enabledModules`.

## Checklist

Before a resource module is considered ready:

- Filters are defined.
- Table columns are defined.
- Form schema validates required fields.
- CRUD API follows the standard shape.
- Delete uses ConfirmDialog.
- Loading, empty, error, disabled, and permission states are handled.
- API errors follow the documented error protocol.
