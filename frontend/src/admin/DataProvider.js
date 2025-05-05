import { fetchUtils } from "react-admin";

const apiUrl = "http://127.0.0.1:8000";            // change when you deploy

// ─── helper: {_id:"…"} ➜ {id:"…"} (recursively) ──────────────────────
const toId = (data) => {
  if (Array.isArray(data)) return data.map(toId);
  if (data && typeof data === "object") {
    const { _id, ...rest } = data;
    return _id ? { id: _id, ...rest } : rest;
  }
  return data;
};

// ─── inject JWT + convert response ───────────────────────────────────
const fetchJSON = (url, options = {}) => {
  const token = localStorage.getItem("token");
  if (!options.headers)
    options.headers = new Headers({ Accept: "application/json" });
  if (token) options.headers.set("Authorization", `Bearer ${token}`);

  return fetchUtils.fetchJson(url, options).then(({ json }) => toId(json));
};

// ─── dataProvider for FastAPI REST ───────────────────────────────────
export const dataProvider = {
  getList: (resource) =>
    fetchJSON(`${apiUrl}/${resource}`).then((data) => ({
      data,
      total: data.length,
    })),

  getOne: (resource, { id }) =>
    fetchJSON(`${apiUrl}/${resource}/${id}`).then((data) => ({ data })),

  create: (resource, { data }) =>
    fetchJSON(`${apiUrl}/${resource}`, {
      method: "POST",
      body: JSON.stringify(data),
    }).then((data) => ({ data })),

  update: (resource, { id, data }) =>
    fetchJSON(`${apiUrl}/${resource}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }).then((data) => ({ data })),

  delete: (resource, { id }) =>
    fetchJSON(`${apiUrl}/${resource}/${id}`, { method: "DELETE" }).then(() => ({
      data: id,
    })),

  deleteMany: (resource, { ids }) =>
    Promise.all(
      ids.map((id) =>
        fetchJSON(`${apiUrl}/${resource}/${id}`, { method: "DELETE" })
      )
    ).then(() => ({ data: ids })),

  updateMany: (resource, { ids, data }) =>
    Promise.all(
      ids.map((id) =>
        fetchJSON(`${apiUrl}/${resource}/${id}`, {
          method: "PUT",
          body: JSON.stringify(data),
        })
      )
    ).then(() => ({ data: ids })),
};
