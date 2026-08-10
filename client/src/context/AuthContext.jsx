import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('khf_admin');
    const token = localStorage.getItem('khf_admin_token');
    return saved && token ? JSON.parse(saved) : null;
  });

  const [customer, setCustomer] = useState(() => {
    const saved = localStorage.getItem('khf_customer');
    const token = localStorage.getItem('khf_customer_token');
    return saved && token ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verify tokens on load if needed
    setLoading(false);
  }, []);

  const loginAdmin = (adminData, token) => {
    setAdmin(adminData);
    localStorage.setItem('khf_admin', JSON.stringify(adminData));
    localStorage.setItem('khf_admin_token', token);
  };

  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem('khf_admin');
    localStorage.removeItem('khf_admin_token');
  };

  const loginCustomer = (customerData, token) => {
    setCustomer(customerData);
    localStorage.setItem('khf_customer', JSON.stringify(customerData));
    localStorage.setItem('khf_customer_token', token);
  };

  const logoutCustomer = () => {
    setCustomer(null);
    localStorage.removeItem('khf_customer');
    localStorage.removeItem('khf_customer_token');
  };

  const getAdminToken = () => localStorage.getItem('khf_admin_token');
  const getCustomerToken = () => localStorage.getItem('khf_customer_token');

  return (
    <AuthContext.Provider value={{
      admin,
      customer,
      loading,
      loginAdmin,
      logoutAdmin,
      loginCustomer,
      logoutCustomer,
      getAdminToken,
      getCustomerToken
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
