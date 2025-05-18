import React, { createContext, useContext, useState } from 'react';

type ApiContextType = {
  apiUrl: string;
  setApiUrl: (url: string) => void;
};

const ApiContext = createContext<ApiContextType>({
  apiUrl: 'http://localhost:3000/api',
  setApiUrl: () => {},
});

export const useApi = () => useContext(ApiContext);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiUrl, setApiUrl] = useState<string>(() => {
    const savedUrl = localStorage.getItem('apiUrl');
    return savedUrl || 'http://localhost:3000/api';
  });

  const updateApiUrl = (url: string) => {
    setApiUrl(url);
    localStorage.setItem('apiUrl', url);
  };

  return (
    <ApiContext.Provider value={{ apiUrl, setApiUrl: updateApiUrl }}>
      {children}
    </ApiContext.Provider>
  );
};