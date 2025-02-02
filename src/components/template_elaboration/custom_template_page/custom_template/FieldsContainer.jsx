// Comments are for my own understanding :]
import React, { useState, useEffect, useRef, memo, useMemo, useCallback } from "react";
import "../../../../style-sheets/TemplateElaboration/ControlForm/FormFields.css";
import TemplateField from "./TemplateField.jsx";
import { useFocusContext } from "../FocusContext.jsx";

const FieldsContainer = ({ 
  fields, 
  onDeleteField, 
  onUpdateFieldValue, 
  onUpdateField, 
  FieldData, 
  FieldsValidator, 
  // setDraggedIndex, 
  onDragStart, 
  onDrop, 
  // onClick, 
  // focusFieldRef, 
  sidebarData, 
  // onUpdateSidebarData, 
  sidebarToggleRef, 
  localFocusInputRef, 
}) => {

  const localFocusFieldRef = useRef(null);
  const { focusTemplateField, setFocusTemplateField } = useFocusContext();
  
  // derived state from the parent component `CustomTemplate`
  // const [templateFields, setTemplateFields] = useState([]);
  // const templateFields = useMemo(
  //   () => fields.filter(field => field.value !== undefined),
  // [fields]);

  // console.log("FieldsContainer", templateFields)
  // console.log("fields", fields)

  const handleUpdateOnChange = useCallback(() => {
    let localFocusField = fields.filter((field) => field.id === localFocusFieldRef.current.id)[0];

    // check if it still exists
    if (localFocusField) {
      let newField = { ...localFocusField };
      Object.keys(localFocusField.properties).forEach((key) => {
        const value = localFocusField.properties[key]
        const isValid = FieldData.validationRules[key]?.test(value) || false;
        // if (key === "format" || key === "units") {
        //   console.log("FieldData.validationRules[key]", FieldData.validationRules[key])
        //   console.log("FieldData.validationRules[key]?.test(value)", FieldData.validationRules[key]?.test(value))
        //   console.log("value", value)
        // }
        newField.errors[key] = !isValid
        // newField = { 
        //   ...localField, 
        //   errors: { ...localField.errors, [key]: !isValid, } ,
        // };  
      })
      onUpdateField(newField.id, newField);
      // setFocusTemplateField(newField)
    }
  }, [FieldData.validationRules, onUpdateField, localFocusFieldRef, fields]);

  const handleClick = useCallback((e, field) => {
    
    // do not close the sidebar when the input is clicked
    if (localFocusInputRef?.current && e.target.closest(`.${localFocusInputRef.current.classList[0]}`)) {
      return;
    }

    // if the field on focus has been changed, update the field on parent (this logic has the purpose of avoiding frequent re-rendering of the parent)
    if (localFocusFieldRef.current && localFocusFieldRef.current.id !== field.id) {
      handleUpdateOnChange();
    }

    // this condition will return "true" if:
    // a field is clicked for the first time || the field clicked is different from the previous one || the same field was clicked and the sidebar is closed
    const toggleStatus = !localFocusFieldRef.current || localFocusFieldRef.current.id !== field.id || (localFocusFieldRef.current.id === field.id && !sidebarData.isOpen)
    // open sidebar with "true", close with "false" as argument
    sidebarToggleRef.current(toggleStatus);
    
    // console.log("inside localFocusFieldRef.current", localFocusFieldRef.current);
    // console.log("inside focusTemplateField", focusTemplateField);

    if (focusTemplateField?.id !== field.id) {
      setFocusTemplateField(field);
    } else {
      setFocusTemplateField(null);
    }

    localFocusFieldRef.current = field;
  }, [setFocusTemplateField, localFocusFieldRef, focusTemplateField, handleUpdateOnChange, sidebarToggleRef, sidebarData, localFocusInputRef]);

  useEffect(() => {
    if (focusTemplateField?.id) {
      onUpdateField(focusTemplateField.id, focusTemplateField);
    }
  }, [onUpdateField, focusTemplateField])

  // console.log("outside localFocusFieldRef.current", localFocusFieldRef.current);
  // console.log("outside focusTemplateField", focusTemplateField);

  const renderedFields = useMemo(() => fields.map((field, index) => (
    <TemplateField
      key={field.id}
      index={index}
      // field={field.id === focusTemplateField?.id ? focusTemplateField : field}
      field={field}
      focusClass={field.id === focusTemplateField?.id ? "focus-class": ''}
      onDeleteField={onDeleteField}
      onUpdateFieldValue={onUpdateFieldValue}
      // onUpdateField={onUpdateField}
      fieldData={FieldData} 
      FieldsValidator={FieldsValidator}
      // setDraggedIndex={setDraggedIndex}
      onDragStart={onDragStart}
      onDrop={onDrop}
      onClick={handleClick}
      localFocusInputRef={field.id === focusTemplateField?.id ? localFocusInputRef : undefined}
    />
  )), [FieldData, FieldsValidator, fields, focusTemplateField, handleClick, onDeleteField, onDragStart, onDrop, onUpdateFieldValue, localFocusInputRef]);

  return <>{renderedFields}</>;
};

export default memo(FieldsContainer);