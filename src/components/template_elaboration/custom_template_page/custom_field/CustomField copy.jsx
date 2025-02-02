import React, { useState, useEffect, useRef, memo } from "react";
import FieldTypeSelector from "./FieldTypeSelector";
import FieldInputs from "./FieldInput";
import FieldActions from "./FieldActions";
import { useFocusContext } from "../FocusContext";
import "../../../../style-sheets/SampleElaboration/ControlForm/CustomField.css"

const CustomField = ({ 
  // field, 
  FieldData, 
  onUpdate, 
  onDelete, 
  FieldsValidator, 
}) => {  

  // console.log("CustomField field", field) // for debugging

  const { fieldConfig, validationRules } = FieldData;
  const { focusTemplateField, setFocusTemplateField } = useFocusContext();
  // console.log("CustomField focusTemplateField", focusTemplateField) // for debugging
  // const [localField, setLocalField] = useState(focusTemplateField && FieldData.getDefaultValues(focusTemplateField, FieldData.fieldConfig, FieldData.formats));
  const [localField, setLocalField] = useState(null);
  // const prevFieldRef = useRef(null);
  // const [error, setError] = useState({});

  // console.log("CustomField focusTemplateField && FieldData.getDefaultValues(focusTemplateField, FieldData.fieldConfig, FieldData.formats)", focusTemplateField && FieldData.getDefaultValues(focusTemplateField, FieldData.fieldConfig, FieldData.formats)) // for debugging
  // console.log("CustomField error", error) // for debugging
  // console.log("CustomField localField", localField) // for debugging

  // TODO: get rid of the re-rendering this component causes
  useEffect(() => {
    let newField = focusTemplateField && FieldData.getDefaultValues(focusTemplateField, FieldData.fieldConfig, FieldData.formats);
    setLocalField(newField);
    // if (focusTemplateField && focusTemplateField.id !== prevFieldRef.current.id) {
      
    // }
    // prevFieldRef.current = newField;
  }, [focusTemplateField, FieldData]);

  // useEffect(() => {
  //   setLocalField(field);
  // }, [field]);

  // const validateField = () => {
  //   return FieldsValidator.customField(localField, validationRules, fieldConfig, setError);
  // }

  // const isInvalid = () => {
  //   return Object.values(error).some((e) => e);
  // }

  // const handleDragStart = (e) => {
  //   if (validateField()) {
  //     e.dataTransfer.setData("field", JSON.stringify(field));
  //   } else {
  //     e.preventDefault();
  //   }
  // };

  // const handleDelete = () => {
  //   onDelete(localField.id);
  // }

  // const handleAddToTemplate = () => {
  //   onUpdate(localField.id, { ...localField, value: "" });
  // }

  // const handleUpdate = () => {
  //   onUpdate(localField.id, localField);
  // }

  const handleUpdateLocalField = (newField) => {
    // let newField = {...field, error: isInvalid()}
    setFocusTemplateField(newField);
    setLocalField(newField);
  }

  return (
    // <div
    localField ? (
      <span
        // onBlur={handleChangeFieldFocus}
        // className={`custom-field-row ${localField?.type ?? 'Text'} ${isInvalid() ? "error" : ""}`}
        className={`custom-field-row ${localField?.type ?? 'Text'}`}
        // className={`custom-field-row ${!validateField(false) ? "error" : ""}`}
        // draggable
        // onDragStart={handleDragStart}
      >
        <FieldTypeSelector
          field={localField}
          onUpdateLocalField={handleUpdateLocalField}
          // field={field}
          // onUpdate={handleUpdateLocalField}
          fieldConfig={fieldConfig}
          // setError={setError}
          FieldData={FieldData}
        />

        <FieldInputs
          field={localField}
          onUpdateLocalField={handleUpdateLocalField}
          // field={field}
          // updatedOptions={fieldOptionsRef.current}
          // error={error}
          FieldData={FieldData}
          // onUpdate={handleUpdateLocalField}
          // setError={setError}
        />

        {/* <FieldActions
          validateField={validateField}
          isInvalid={isInvalid}
          onAddToTemplate={handleAddToTemplate}
          onDelete={handleDelete}
        /> */}
      </span>
    ) :
    <p>Please select an item to view details</p>
    // </div>
  );
};

export default memo(CustomField);