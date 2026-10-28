export const setAuth = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
};

export const getToken = () => {
    return localStorage.getItem('token');
};

export const getUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Also clear session storage if you use it, though requirements said "session data" which usually implies clearing local user state.
    sessionStorage.clear();
};

export const isLoggedIn = () => {
    return !!getToken();
};
