export function createFormSchema(fields = []) {
  return {
    fields,
    getInitialValues(record = {}) {
      return Object.fromEntries(fields.map((field) => [field.name, record[field.name] ?? field.defaultValue ?? ""]));
    },
    validate(values) {
      return validateValues(fields, values);
    }
  };
}

export function validateValues(fields, values) {
  const errors = {};

  for (const field of fields) {
    const value = values[field.name];
    const empty = value === undefined || value === null || String(value).trim() === "";

    if (field.required && empty) {
      errors[field.name] = `${field.label}不能为空。`;
      continue;
    }

    if (empty) continue;

    if (field.maxLength && String(value).length > field.maxLength) {
      errors[field.name] = `${field.label}不能超过 ${field.maxLength} 个字符。`;
      continue;
    }

    if (field.pattern && !field.pattern.test(String(value))) {
      errors[field.name] = field.message || `${field.label}格式不正确。`;
      continue;
    }

    if (typeof field.validate === "function") {
      const message = field.validate(value, values);
      if (message) errors[field.name] = message;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

export function readFormValues(form, fields) {
  const data = new FormData(form);

  return Object.fromEntries(fields.map((field) => {
    const raw = data.get(field.name);
    return [field.name, normalizeValue(raw, field)];
  }));
}

function normalizeValue(value, field) {
  if (field.type === "number") return Number(value);
  if (field.type === "switch" || field.type === "checkbox") return value === "on" || value === "true";
  return value ?? "";
}
