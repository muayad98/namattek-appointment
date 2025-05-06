import { fetchUtils } from "react-admin";

const apiUrl = "http://127.0.0.1:8000";          // swap for Render URL at deploy

// ─── helper: Mongo {_id:"…"} ➜ react‑admin {id:"…"} ───────────────────
const toId = (data) => {
  if (Array.isArray(data)) return data.map(toId);
  if (data && typeof data === "object") {
    const { _id, ...rest } = data;
    return _id ? { id: _id, ...rest } : rest;
  }
  return data;
};

// ─── fetch wrapper: add JWT, convert response ───────────────────────
const fetchJSON = (url, options = {}) => {
  const token = localStorage.getItem("token");
  if (!options.headers)
    options.headers = new Headers({ Accept: "application/json" });
  if (token) options.headers.set("Authorization", `Bearer ${token}`);

  return fetchUtils.fetchJson(url, options).then(({ json }) => toId(json));
};

// ─── translate react‑admin params → query string ────────────────────
const buildQueryURL = (resource, params) => {
  const url = new URL(`${apiUrl}/${resource}`);
  if (params?.filter) {
    Object.entries(params.filter).forEach(([k, v]) => {
      if (v !== undefined && v !== "") url.searchParams.append(k, v);
    });
  }
  return url.toString();
};

// ─── full dataProvider with all RA methods ──────────────────────────
export const dataProvider = {
  getList: (resource, params) =>
    fetchJSON(buildQueryURL(resource, params)).then((data) => ({
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

  getMany: (resource, { ids }) =>
    Promise.all(ids.map((id) => fetchJSON(`${apiUrl}/${resource}/${id}`))).then(
      (records) => ({ data: records })
    ),

  getManyReference: (resource, params) =>
    // small collections: client‑side filter is fine
    fetchJSON(`${apiUrl}/${resource}`).then((all) => {
      const filtered = all.filter(
        (rec) => rec[params.target] === params.id
      );
      return { data: filtered, total: filtered.length };
    }),
};
