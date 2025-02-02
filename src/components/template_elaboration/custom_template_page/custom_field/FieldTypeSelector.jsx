import React, { useState } from "react";


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

const FieldTypeSelector = ({ 
  field, 
  // onUpdate, 
  onUpdateLocalField, 
  fieldConfig, 
  // setError, 
  FieldData 
}) => {
  
  // const [isFocused, setIsfocused] = useState(false);

  const handleTypeChange = (type, label) => {
    const newValues = fieldConfig[type].reduce(
      (acc, key) => ({ ...acc, [key]: "" }), {}
    );
    const newErrors = fieldConfig[type].reduce(
      (acc, key) => ({ ...acc, [key]: false }), {}
    );
    // console.log("{ ...field, type, values: newValues, errors: newErrors }", { ...field, type, values: newValues, errors: newErrors })
    onUpdateLocalField(FieldData.getDefaultValues({ ...field, type, label, properties: newValues, errors: newErrors }, FieldData.fieldConfig, FieldData.formats));
    // onUpdateLocalField({ ...field, type, values: newValues, errors: newErrors });
  };

  // const handleFocus = (e) => {
  //   setIsfocused((prev) => !prev)
  // }

  return (
    <div className="custom-field-input">
      <div className="floating-label-group custom-field-controls">
        <select 
          value={field.type} 
          onChange={(e) => handleTypeChange(e.target.value, field.label)}
          // onFocus={handleFocus}
        >
          {Object.keys(fieldConfig).map((type) => (
            <option key={type} value={type}>
              
            {translateArray[type.toLowerCase()]}
            </option>
          ))}
        </select>
        <span className="tooltip">{FieldData.tooltips["type"] || ""}</span>
        {/* <label className={`floating-label ${isFocused ? 'active' : ''}`}> */}
        <label className={`floating-label ${field.type ? 'active' : ''}`}>
          Tipo
        </label>
      </div>
    </div>
  );
};

export default FieldTypeSelector;
