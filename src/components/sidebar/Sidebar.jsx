import { useState, useEffect, useRef, useCallback } from "react";
import { NavLink } from 'react-router-dom';
// import { useFocusContext } from "../template_elaboration/custom_template_page/FocusContext";
// import { useFocusContext } from "../template_elaboration/custom_template_page/FocusContext.jsx";

import "../../style-sheets/Sidebar1.css";
import '../../style-sheets/ProfileSettings.css';

import { ExitArrowSvg } from "../svg_components/ExitArrowSvg"
import { LeftArrowSvg } from "../svg_components/LeftArrowSvg";

const Sidebar = ({ 
  // sidebarData, 
  updateSidebarData,
  sidebarToggleRef,  
  children, 
  showToggleButton, 
  navigateBackRoute='/'
}) => {
  const isOpenRef = useRef(false);
  const sidebarRef = useRef(null);
  const toggleSidebar = useCallback((status) => {
    status = status ?? !isOpenRef.current;

    const sidebarWidth = sidebarRef.current ? sidebarRef.current.offsetWidth : 0;
    updateSidebarData({
      isOpen: status,
      width: sidebarWidth,
    });
    isOpenRef.current = status;

  }, [updateSidebarData]);
  
  if (sidebarToggleRef) {
    sidebarToggleRef.current = toggleSidebar;
  }

  return (
    <aside className={`sidebar-container`} >
      <div className={`sidebar ${isOpenRef.current ? "open" : "closed"}`} ref={sidebarRef}>
        {showToggleButton && 
          (<button className="sidebar-toggle" onClick={(e) => toggleSidebar()}>
            <LeftArrowSvg />
          </button>)
        }
          <div className="sidebar-content">
            {children}
          </div>
        <div className="sidebar-footer">
          <NavLink to={navigateBackRoute} className='sidebar-item exit-container'>
              <ExitArrowSvg/>
              Volver atrás
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
