import React, { createContext, useState, useContext } from 'react';

const FocusContext = createContext();

export const FocusContextProvider = ({ children }) => {
  const [focusTemplateField, setFocusTemplateField] = useState(null);
  // console.log("FocusContextProvider focusTemplateField", focusTemplateField)

  return (
    <FocusContext.Provider value={{ focusTemplateField, setFocusTemplateField }}>
      {children}
    </FocusContext.Provider>
  );
};

export const useFocusContext = () => useContext(FocusContext);