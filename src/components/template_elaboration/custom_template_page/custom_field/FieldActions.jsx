import React, { useState, useEffect, useRef } from "react";
import { TrashSvg } from "../../../svg_components/TrashSvg";
import { SuccessSvg } from "../../../svg_components/SuccessSvg";

const FieldActions = ({ onAddToTemplate, onDelete }) => {  
  
  const isFirstRenderRef = useRef(true);

  useEffect(() => {
    isFirstRenderRef.current = false;
  }, []);

  return (    
    <div className="field-actions">
      {/* <button
        className="add-to-form-button"
        // style={{display: !isFirstRender && isInvalid() ? 'none' : 'inline-block'}}
        style={{display: isFirstRenderRef.current || isInvalid() ? 'none' : 'inline-block'}}
        onClick={() => validateField() && onAddToTemplate()}
      >
        <SuccessSvg />
      </button> */}
      <button className="trash-button" onClick={() => onDelete()}>
        <TrashSvg />
      </button>
    </div>
  );
}

export default FieldActions;
