const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('crm_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const request = async (url, options = {}) => {
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

export const login = (payload) => request('/auth/login', {
  method: 'POST',
  body: JSON.stringify(payload),
});

export const fetchLeads = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return request(`/leads?${query}`);
};

export const createLead = (payload) => request('/leads', {
  method: 'POST',
  body: JSON.stringify(payload),
});

export const updateLead = (id, payload) => request(`/leads/${id}`, {
  method: 'PUT',
  body: JSON.stringify(payload),
});

export const deleteLead = (id) => request(`/leads/${id}`, {
  method: 'DELETE',
});

export const addLeadNote = (id, payload) => request(`/leads/${id}/notes`, {
  method: 'POST',
  body: JSON.stringify(payload),
});
