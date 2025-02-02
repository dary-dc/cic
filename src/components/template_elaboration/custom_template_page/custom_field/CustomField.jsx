import React, { useState, useEffect, useRef, memo } from "react";
import FieldTypeSelector from "./FieldTypeSelector";
import FieldInputs from "./FieldInput";
import { useFocusContext } from "../FocusContext";
import "../../../../style-sheets/TemplateElaboration/ControlForm/CustomField.css"

const CustomField = ({ 
  FieldData, 
  onUpdate, 
  onDelete, 
  FieldsValidator, 
}) => {  

  const { fieldConfig, validationRules } = FieldData;
  const { focusTemplateField, setFocusTemplateField } = useFocusContext();
  const [localField, setLocalField] = useState(null);

  console.log("CustomField focusTemplateField", focusTemplateField) // for debugging
  console.log("CustomField localField", localField) // for debugging

  // TODO: get rid of the re-rendering this component causes
  useEffect(() => {
    let newField = focusTemplateField && FieldData.getDefaultValues(focusTemplateField, FieldData.fieldConfig, FieldData.formats);
    setLocalField(newField);
  }, [focusTemplateField, FieldData]);

  const handleUpdateLocalField = (newField) => {
    setFocusTemplateField(newField);
    setLocalField(newField);
  }

  return (
    localField ? (
      <span
        className={`custom-field-row ${localField?.type ?? 'Text'}`}
      >
        <FieldTypeSelector
          field={localField}
          onUpdateLocalField={handleUpdateLocalField}
          fieldConfig={fieldConfig}
          FieldData={FieldData}
        />

        <FieldInputs
          field={localField}
          onUpdateLocalField={handleUpdateLocalField}
          FieldData={FieldData}
        />
      </span>
    ) :
    <p>Please select an item to view details</p>
  );
};

export default memo(CustomField);