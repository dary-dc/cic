import React, { createContext, useRef } from "react";

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const dataRef = useRef({});

  return (
    <DataContext.Provider value={dataRef}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;