export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || API_BASE_URL;

const jsonHeaders = {
  "Content-Type": "application/json",
};

async function request(path, options = {}) {
  const { headers, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      ...jsonHeaders,
      ...headers,
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.error || data?.msg || "Request failed");
  }

  return data;
}

export const authApi = {
  register(username, password) {
    return request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },

  login(username, password) {
    return request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },

  me(token) {
    return request("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export const walletApi = {
  get(token) {
    return request("/api/wallet", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  deposit(token, amount) {
    return request("/api/wallet/deposit", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount }),
    });
  },

  withdraw(token, amount) {
    return request("/api/wallet/withdraw", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount }),
    });
  },
};
