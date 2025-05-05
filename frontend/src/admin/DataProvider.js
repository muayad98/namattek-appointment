import axios from "axios";
import { fetchUtils } from "react-admin";

const apiUrl = "http://127.0.0.1:8000";      // update to Render URL in prod

//--------------------------------------------------------------------
// Helper – convert {_id:"…"}  ==>  {id:"…"}  (recursively)
const normalize = (data) => {
  if (Array.isArray(data)) return data.map(normalize);
  if (data && typeof data === "object") {
    const { _id, ...rest } = data;
    return _id ? { id: _id, ...rest } : rest;
  }
  return data;
};

//--------------------------------------------------------------------
// Custom HTTP client – inject JWT + normalize response
const httpClient = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }
  options.headers.set("Authorization", `Bearer ${token}`);

  const { json } = await fetchUtils.fetchJson(url, options);
  return { data: normalize(json), total: Array.isArray(json) ? json.length : 1 };
};

//--------------------------------------------------------------------
// Minimal dataProvider for FastAPI REST style
export const dataProvider = {
  getList: (resource) => httpClient(`${apiUrl}/${resource}`),

  getOne: (resource, { id }) =>
    httpClient(`${apiUrl}/${resource}/${id}`),

  update: (resource, { id, data }) =>
    httpClient(`${apiUrl}/${resource}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  create: (resource, { data }) =>
    httpClient(`${apiUrl}/${resource}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  delete: (resource, { id }) =>
    httpClient(`${apiUrl}/${resource}/${id}`, { method: "DELETE" }),
};

