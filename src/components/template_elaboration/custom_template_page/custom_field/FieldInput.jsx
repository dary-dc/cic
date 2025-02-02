import { useState, useEffect, useRef, memo } from "react";
import "../../../../style-sheets/TemplateElaboration/ControlForm/FieldInput.css";
import CustomSelectList from "./CustomSelectList";


const translateArray = {
  "rangeMin":"Rango Mínimo", 
  "rangeMax":"Rango Máximo", 
  "maxLength":"Longitud Máxima", 
  "precision": "Precisión", 
  "units":"Unidades",
  "label":"Etiqueta",
  "text":"Texto",
  "alphabetic":"Alfabético",
  "numeric":"Numérico",
  "alphanumeric":"Alfanumérico",
  "email":"Correo",
  "any":"Cualquiera",
  "date":"Fecha",
  "time":"Tiempo",
  "boolean":"Booleano",
  "select":"Desplegable",
  "g/dl":"g/dL",
  "mg/dl":"mg/dL",
  "cells/µl":"células/µL",
  "true/false":"Verdadero/Falso",
  "yes/no":"Sí/No",
  "active/inactive":"Activo/Inactivo",
  "on/off":"Encendido/Apagado",
  "1/0":"1/0",
  "dd/mm/yyyy":"DD/MM/YYYY",
  "mm/dd/yyyy":"MM/DD/YYYY", 
  "yyyy-mm-dd":"YYYY-MM-DD",
  "12-hour":"12-horas", 
  "24-hour":"24-horas", 
  "duration":"Duración",
}

const FieldInputs = ({ 
  field, // localField!!!
  onUpdateLocalField, 
  // error, 
  // setError, 
  // updatedOptions, 
  // onUpdate, 
  FieldData
}) => {
  // const customInputRef = useRef(null);
  const { 
    fieldConfig, 
    validationRules, 
    formats, 
    booleanOptions, 
    tooltips  
  } = FieldData;

  // console.log("FieldInputs field", field);

  const handleValueChange = (key, value) => {
    const isValid = validationRules[key]?.test(value) || false;
    let newField
    if (key !== "label") {
      newField = { 
        ...field, 
        errors: { ...field.errors, [key]: !isValid, } ,
        properties: { ...field.properties, [key]: value, } 
      };
    } else {
      newField = { 
        ...field, 
        [key]: value,
        errors: { ...field.errors, [key]: !isValid, } ,
        properties: { ...field.properties } 
      };
    }
    console.log("isValid", isValid);
    console.log("newFieldOptions", newField);
    onUpdateLocalField(newField);
    // setError((prev) => ({ ...prev, [key]: !isValid }));
    // setError((prev) => ({ ...prev, [key]: !isValid }));
  };

  const getTooltip = (key) => {
    return tooltips[key] || "";
  };

  const renderInputField = (key) => {
    // For numeric inputs
    if (["rangeMin", "rangeMax", "precision", "maxLength"].includes(key)) {
      return (
        <div className="floating-label-group">
          <input
            type="text" // Using text to handle our own validation
            value={field.properties[key] || ""}
            onChange={(e) => {
              const value = e.target.value;
              if (validationRules[key].test(value) || value === "") {
                handleValueChange(key, value);
              }
            }}
            className={field.errors[key] ? "invalid" : ""}
          />
          <span className="tooltip">{getTooltip(key)}</span>
          <label className={`floating-label ${field.properties[key] ? 'active' : ''}`}>
          { translateArray[key] }
          </label>
        </div>
      );
    }

    // For format selects
    if (key === "format" || key === "units") {
      const formatOptions = formats[field.type] || [];
      return (
        <div className="floating-label-group">
          <select
            value={field.properties[key] || ""}
            onChange={(e) => handleValueChange(key, e.target.value)}
            className={field.errors[key] ? "invalid" : ""}
          >
            {formatOptions.map((format) => (
              <option key={format} value={format}>
              { translateArray[format.toLowerCase()] }
              </option>
            ))}
          </select>
          <span className="tooltip">{getTooltip(key)}</span>
          <label className={`floating-label ${field.properties[key] ? 'active' : ''}`}>
          { translateArray[key] }
          </label>
        </div>
      );
    }

    // For boolean values
    if (key === "properties" && field.type === "Boolean") {
      return (
        <div className="floating-label-group">
          <select
            value={field.properties[key] || ""}
            onChange={(e) => handleValueChange(key, e.target.value)}
            className={field.errors[key] ? "invalid" : ""}
          >
            <option value="">Select values</option>
            {booleanOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span className="tooltip">{getTooltip(key)}</span>
          <label className={`floating-label ${field.properties[key] ? 'active' : ''}`}>
          { translateArray[key] }
          </label>
        </div>
      );
    }

    // For select options
    if (key === "options") {
      return (
        <CustomSelectList field={field} getTooltip={getTooltip} onUpdateLocalField={onUpdateLocalField} />
      );
    }

    if (key === "label") {
      return (
        <div className="floating-label-group">
          <input
            type="text"
            value={field[key] || ""}
            onChange={(e) => handleValueChange(key, e.target.value)}
            className={field.errors[key] ? "invalid" : ""}
          />
          <span className="tooltip">{getTooltip(key)}</span>
          <label className={`floating-label ${field[key] ? 'active' : ''}`}>
          { translateArray[key] }
          </label>
        </div>
      );  
    }

    // Default text input for other fields
    return (
      <div className="floating-label-group">
        <input
          type="text"
          value={field.properties[key] || ""}
          onChange={(e) => handleValueChange(key, e.target.value)}
          className={field.errors[key] ? "invalid" : ""}
        />
        <span className="tooltip">{getTooltip(key)}</span>
        <label className={`floating-label ${field.properties[key] ? 'active' : ''}`}>
        { translateArray[key] }
        </label>
      </div>
    );
  };

  // useEffect(() => {
  //   const field = document.querySelector(".custom-field-row.Select .draggable-input").closest(".custom-field-input")
  //   field.style.height = "auto";
  //   field.style.display = "grid";
  //   return () => {
  //     field.style.removeProperty("height")
  //   }
  // })

  return (
    <>
      <div key={"label"} className={`custom-field-input`}>
        {renderInputField("label")}
      </div>
      {fieldConfig[field.type].map((key) => (
        <div key={key} className={`custom-field-input ${key === "options" ? "options" : ''}`}>
          {renderInputField(key)}
        </div>
      ))}
    </>
  );
};

export default memo(FieldInputs);