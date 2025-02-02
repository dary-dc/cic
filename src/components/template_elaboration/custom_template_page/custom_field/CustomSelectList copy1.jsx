import React, { useState } from 'react'
import { AddSvg } from '../../../svg_components/AddSvg';
import { SaveSvg } from '../../../svg_components/SaveSvg';

function CustomSelectList({ field, getTooltip, onUpdateLocalField, key="options" }) {
    const [options, setOptions] = useState(field.values[key]);
    const [draggedIndex, setDraggedIndex] = useState(null);

    const handleAddOption = (e) => {
        setOptions((prev) => ({ ...prev, [`opcion ${Object.keys(options).length}`]: {} }))
    }
    const handleSaveOption = (e) => {
      console.log("field", field)
      console.log("modified options", options)
      console.log("modified options", { ...field, values: { options, ...field.values } })
      // onUpdateLocalField((prev) => ({ ...prev, values: { options, ...prev.values } }))
      // setOptions((prev) => ({ ...prev, [`opcion ${options.length}`]: {} }))
    }
  
    const handleDragStart = (e, index) => {
      setDraggedIndex(index);
    }
    const handleDrop = (e, index) => {
      if (draggedIndex === index) return;

      let newOptionsEntries = Object.entries(options);
      newOptionsEntries.splice(index, 0, newOptionsEntries.splice(draggedIndex, 1)[0]);
      setDraggedIndex(null);
      setOptions(Object.fromEntries(newOptionsEntries));  
    }

    const handleValueChange = (oldKey, newKey) => {
      const newOptionsEntries = Object.entries(options).map(pair => 
        pair[0] === oldKey ? [newKey, pair[1]] : [pair[0], pair[1]]
      )
      setOptions(Object.fromEntries(newOptionsEntries))
    }

    return (
        <>
          <label className="floating-label">
            Opciones del seleccionable
          </label>
          {Object.keys(options).map((optionKey, index) => (
            <div key={index} className="floating-label-group">
              <div draggable className="draggable-input"
                onDragStart={(e) => handleDragStart(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragOver={(e) => e.preventDefault()}
              >
                <input
                  type="text" // Using text to handle our own validation
                  value={optionKey || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleValueChange(optionKey, value);
                  }}
                  // className={field.errors[key] ? "invalid" : ""}
                  draggable 
                  onDragStart={(e) => {e.preventDefault(); e.stopPropagation();}}
                />
              </div>
              <span className="tooltip">{getTooltip(key)}</span>
            </div>
          ))}
          <div className="custom-select-field-actions">            
            <button className="add-select-option" onClick={handleAddOption}>
              <AddSvg />
            </button>
            <button className="save-select-option" onClick={handleSaveOption}>
              <SaveSvg />
            </button>
          </div>
        </>
    )
}

export default CustomSelectList