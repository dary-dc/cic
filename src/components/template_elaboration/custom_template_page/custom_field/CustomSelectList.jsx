import React, { useState } from 'react'
import { AddSvg } from '../../../svg_components/AddSvg';
import { SaveSvg } from '../../../svg_components/SaveSvg';
import { TrashSvg } from '../../../svg_components/TrashSvg';
import { MoveSvg } from '../../../svg_components/MoveSvg';

function CustomSelectList({ field, getTooltip, onUpdateLocalField, key="options" }) {
    const [options, setOptions] = useState(field.properties[key]);
    const [draggedIndex, setDraggedIndex] = useState(null);

    const handleAddOption = (e) => {
        setOptions((prev) => ([ ...prev, `opcion ${options.length}` ]))
    }
    const handleDeleteOption = (e, index) => {
      setOptions((prev) => prev.filter(o => o !== options[index]))
    }
  const handleSaveOption = (e) => {
      const newField = { ...field }
      newField.properties.options = options
      onUpdateLocalField(newField)
    }
  
    const handleDragStart = (e, index) => {
      setDraggedIndex(index);
    }
    const handleDrop = (e, index) => {
      if (draggedIndex === index) return;

      let newOptions = [ ...options ];
      newOptions.splice(index, 0, newOptions.splice(draggedIndex, 1)[0]);
      setDraggedIndex(null);
      setOptions(newOptions);  
    }

    const handleValueChange = (oldOption, newOption) => {
      let newOptions = [ ...options ]
      newOptions.splice(options.indexOf(oldOption), 1, newOption);
      setOptions(newOptions)
    }

    console.log("options", options)

    return (
        <>
          <label className="floating-label">
            Opciones del seleccionable
          </label>
          {options.map((optionKey, index) => ( 
            <div key={index} className="floating-label-group">
              <div draggable className="draggable-input"
                onDragStart={(e) => handleDragStart(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragOver={(e) => e.preventDefault()}
              >
                <MoveSvg customClass={"select-option-move-svg"}/>
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
                <button className="delete-select-option" onClick={(e) => handleDeleteOption(e, index)}>
                  <TrashSvg />
                </button>
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