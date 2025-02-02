import React, { useState, useCallback } from "react";

// import History from "./template_elaboration/search_page/History";
import Sidebar from "./sidebar/Sidebar";
import ContentWrapper from "./sidebar/ContentWrapper";
import { SelectionContextProvider } from "./template_elaboration/custom_template_page/SelectionContext.jsx";
import TemplateSelect from "./template_elaboration/search_page/TemplateSelect.jsx";

import "../style-sheets/TemplateElaboration/SearchPage/SearchPage.css";
import "../style-sheets/TemplateElaboration/SearchPage/SearchBar.css";

const TemplateElaboration = ({ routes }) => {

  const [sidebarData, setSidebarData] = useState({ isOpen: false, width: 0 });

  const updateSidebarStatus = useCallback((data) => {
    setSidebarData(data);
  }, []);
  
  return (
    <div className="sample-elaboration-page">
      {/* <Sidebar 
        updateSidebarStatus={updateSidebarStatus} 
        // sidebarContent={<History/>}
        navigateBackRoute={'/'} 
        />
      <ContentWrapper sidebarData={sidebarData}> */}
        <div className="search-form-page">
          <SelectionContextProvider>
            <TemplateSelect routes={routes} />
          </SelectionContextProvider>
          {/* <button className="add-form-button" onClick={() => navigate(`${baseRoute}/control_form/new`)}>
            <AddSvg />
          </button> */}
        </div>
      {/* </ContentWrapper> */}
    </div>
  );
}
export default TemplateElaboration;