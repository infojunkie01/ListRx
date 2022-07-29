// route to get logged in user's info (needs the token)
export const getMe = (token) => {
  return fetch('/api/users/me', {
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
  });
};

export const createUser = (userData) => {
  return fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
};

export const loginUser = (userData) => {
  return fetch('/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
};

// save rx data for a logged in user
export const saveRx = (rxData, token) => {
  return fetch('/api/users', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(rxData),
  });
};

// remove saved rx data for a logged in user
export const deleteRx = (rxId, token) => {
  return fetch(`/api/users/books/${rxId}`, {
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};

// make a search to open FDA api
// https://api.fda.gov/drug/drugsfda.json?search=openfda.brand_name:adderall
export const searchOpenFda = (query) => {
  return fetch(`https://api.fda.gov/drug/drugsfda.json?search=openfda.brand_name:${query}`);
};
