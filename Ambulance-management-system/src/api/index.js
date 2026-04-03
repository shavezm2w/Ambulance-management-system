import axios from "axios";

const API = axios.create({
  baseURL: "/api",
});

// ─── Auth ────────────────────────────────────────────
export const login = (Email, Password) =>
  API.post("/auth/login", { Email, Password });

// ─── Trips ───────────────────────────────────────────
export const getTrips = (params) =>
  API.get("/trips", { params });

// ─── Ambulances ──────────────────────────────────────
export const getAmbulances = (params) =>
  API.get("/ambulances", { params });

export const getAmbulanceById = (id) =>
  API.get(`/ambulances/${id}`);

export const addAmbulance = (data) =>
  API.post("/ambulances", data);

export const updateAmbulance = (data) =>
  API.put("/ambulances", data);

export const deleteAmbulance = (id) =>
  API.delete(`/ambulances/${id}`);

// ─── Drivers ─────────────────────────────────────────
export const getDrivers = (params) =>
  API.get("/drivers", { params });

export const getDriverById = (id) =>
  API.get(`/drivers/${id}`);

export const addDriver = (data) =>
  API.post("/drivers", data);

export const updateDriver = (data) =>
  API.put("/drivers", data);

export const deleteDriver = (id) =>
  API.delete(`/drivers/${id}`);

// ─── Hospitals ───────────────────────────────────────
export const getHospitals = (params) =>
  API.get("/hospitals", { params });

export default API;
