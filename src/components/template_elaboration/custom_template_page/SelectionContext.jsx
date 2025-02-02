import React, { createContext, useState, useContext } from 'react';

const SelectionContext = createContext();

export const SelectionContextProvider = ({ children }) => {
  const [templateData, setTemplateData] = useState(null);
  console.log("SelectionContextProvider templateData", templateData)

  return (
    <SelectionContext.Provider value={{ templateData, setTemplateData }}>
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelectionContext = () => useContext(SelectionContext);
// export const useSelectionContext = () => {
//   const context = useContext(SelectionContext);
//   console.log("useSelectionContext context:", context); // Debug log
//   if (!context) {
//     throw new Error("useSelectionContext must be used within a SelectionContextProvider");
//   }
//   return context;
// };
