import { useState, useEffect, useCallback, useRef, useContext } from "react";
import { useLocation } from "react-router-dom";

import { AddSvg } from "../../../svg_components/AddSvg.jsx";
import CustomField from "../custom_field/CustomField.jsx";
import { handleResponse } from "../../../../utils/utils.js";
import { ApiContext } from "../../../ApiContext.jsx";
import { useSelectionContext } from "../SelectionContext.jsx";
import Sidebar from "../../../sidebar/Sidebar.jsx";
import ContentWrapper from "../../../sidebar/ContentWrapper.jsx";

import "../../../../style-sheets/TemplateElaboration/ControlForm/CustomFieldBuilder.css"
import "../../../../style-sheets/TemplateElaboration/ControlForm/CustomFormPage.css"
import FieldData from "../../../../utils/FieldsData";
import FieldsValidator from "../../../../utils/FieldsValidator";
import FieldsContainer from "./FieldsContainer.jsx";
import { SaveSvg } from "../../../svg_components/SaveSvg.jsx";
import { firePopup } from "../../../alert_components/Alert/CustomAlert.jsx";

const CustomTemplate = ({ routes }) => {
  const [fields, setFields] = useState([]);
  const [template, setTemplate] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [sidebarData, setSidebarData] = useState({ isOpen: false, width: 0 });
  // const [externalStatusController, setExternalStatusController] = useState(false);
  // const [sidebarFocusField, setSidebarFocusField] = useState(null);
  const sidebarToggleRef = useRef(null);
  const localFocusInputRef = useRef(null);
  // const { templateData: selectedTemplate } = useSelectionContext();
  const location = useLocation();
  let selectedTemplate;
  if (location?.state) {
    const { template } = location?.state;
    selectedTemplate = template
  }
  // const { template: selectedTemplate } = location?.state;
  const { BASE_URL,PORT } = useContext(ApiContext);

  
  const handleDeleteField = useCallback((id) => {
    setFields((prev) => prev.filter((field) => field.id !== id));
  }, []);

  const handleUpdateFieldValue = useCallback((id, value) => {
    setFields((prev) =>
      prev.map((field) => (field.id === id ? { ...field, value } : field))
    );
  }, []);

  const handleAddField = useCallback((newField) => {
    setFields((prev) => [...prev, newField])
  }, []);

  const handleUpdateField = useCallback((id, updatedField) => {
    setFields((prev) =>
      prev.map((field) => (field.id === id ? updatedField : field))
    );
  }, [])

  // Dragging events for changing the order of the TemplateField components
  const handleDragStart = (e, index) => {
    console.log("e.target", e.target)
    console.log("e.target.closest('.{localFocusInputRef?.current?.classList[0]}')", e.target.closest(`.${localFocusInputRef?.current?.classList[0]}`))
    if (localFocusInputRef?.current && e.target.closest(`.${localFocusInputRef.current.classList[0]}`)) {
      // e.target.closest(`.${localFocusInputRef.current.classList[0]}`).remove()
      return;
    }
    // e.stopPropagation();
    console.log("handleDragStart index", index);
      setDraggedIndex(index);
  };    

  const handleDrop = (e, index) => {
    if (draggedIndex === index) return;

    let newFields = [...fields];
    newFields.splice(index, 0, newFields.splice(draggedIndex, 1)[0]);
    setDraggedIndex(null);
    setFields(newFields);
  };

  // const handleDragOver = (e) => e; // for testing
  
  const handleDragEnd = (result) => {
    // console.log("result", result)
  }

  // const handleTemplateFieldClick = useCallback((e, field) => {
  //   setSidebarFocusField(field);
  // }, [setSidebarFocusField]);
  // const handleTemplateFieldClick = (e, field) => {
  //   sidebarFocusFieldRef.current = field;
  // };

  const handleAddCustomField = () => {
    handleAddField(
      FieldData.getDefaultValues({
        id: new Date().toISOString().split("T")[0],
        // index: fields.length + 1,
        type: "Numeric",
        value: "",
        label: "",
        errors: {
          label: false,
          rangeMin: false,
          rangeMax: false,
          precision: false,
          units: false,
        },
        properties: {
          rangeMin: "",
          rangeMax: "",
          precision: "",
          units: "",
        },
      }, 
        FieldData.fieldConfig, FieldData.formats
      )
    )
  }

  const handleSaveTemplate = async (e) => {
    let html = <span>Los campos en la <span style={{color:"#7066e0"}}>PLANTILLA</span> no pueden estar <span style={{color:"#7066e0"}}>VACÍOS</span></span>
    let html2 = <span><span style={{color:"#7066e0"}}>CAMPOS</span> guardados correctamente en la <span style={{color:"#7066e0"}}>PLANTILLA</span></span>
    let html3 = <span>No se pudo <span style={{color:"#7066e0"}}>GUARDAR</span> los campos en la <span style={{color:"#7066e0"}}>PLANTILLA</span></span>

    console.log("isValidTemplate()", isValidTemplate())
    if (isValidTemplate()) {
      // custom_template (table in the database)
      // int id (primary key)
      // int creating_user (foreign key)
      // string type (urine control or serum control)
      // string name (name given by the user)
      // string creation_date (first submit time, timestamp)
      // string last_modification (submit of last editing, timestamp)
      // string description (additional data, optional)
      const template = { 
        // selected template data ?? default data
        creating_user: selectedTemplate?.creating_user ?? 1, 
        type:                   selectedTemplate?.type ?? "serum control", 
        name: fields.find(({ label }) => 
            label === "Nombre de la plantilla")?.value ?? "default name", 
        value:                 selectedTemplate?.value ?? "(empty)", 
        creation_date: selectedTemplate?.creation_date ?? Date.now().toString(), 
        last_modification: new Date().toISOString().split("T")[0], 
        description:     selectedTemplate?.description ?? "Example text", 
      };
  
      // template_field (table in the database)
      // int id (primary key)
      // int template_id (foreign key)
      // string type (numeric, text, date, time, boolean)
      // string label (name of the field)
      // JSON properties (rest of the properties, which varies a lot from one type of field to another)
      const templateFields = fields.map(({ errors, value, id, label, type, properties, ...field }) => ({
          type, 
          label, 
          value, 
          properties, 
        })
      )
      
      // let body = { template, templateFields }
  
      console.log("template", template)
      console.log("templateFields", templateFields)
  
      let templateId;
      if (selectedTemplate?.id) {
        templateId = selectedTemplate.id
        await fetch(`${BASE_URL}${PORT}/template/${templateId}`,{
          method:"PUT",
          headers:{ "Content-Type": "application/json"},
          body:JSON.stringify(template)
        });
      } else {
        let response = await fetch(`${BASE_URL}${PORT}/template`,{
          method:"POST",
          headers:{ "Content-Type": "application/json"},
          body:JSON.stringify(template)
        });
        let newTemplate = await handleResponse(response);
        templateId = newTemplate?.id
      }
      console.log("templateId", templateId)
  
      const fieldsResponse = await fetch(`${BASE_URL}${PORT}/fields/${templateId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(templateFields),
      });
  
      let updatedFields = await handleResponse(fieldsResponse);
  
      console.log("updatedFields", updatedFields)

      
      if(fieldsResponse.ok){
        firePopup({ html : html2,type:"success",title: "Realizado",isHtmlComponent:true})
      }else{
        firePopup({ html : html3,type:"error",title: "Error",isHtmlComponent:true})
      }
    }else{
      firePopup({ html : html,type:"error",title: "Error",isHtmlComponent:true})
    }
    
  }

  const isValidTemplate = () => {
    return !(fields.some(field => Object.keys(field.errors).some(key => field.errors[key])) 
      || fields.some(field => !field.value))
  }

  useEffect(() => {
    if (selectedTemplate?.id) {
      const fetchTemplate = async () => {
        const response = await fetch(`${BASE_URL}${PORT}/fields/${selectedTemplate.id}`);
        console.log("response", response)
        const fields = await handleResponse(response);
        console.log("data", fields)
        setFields(fields.map(field => {
          let errors = FieldData.fieldConfig[field.type].reduce(
            (acc, key) => ({ ...acc, [key]: false }), {}
          )
          return {...field, errors }
        }));
      }
      fetchTemplate();
    } else { 
      // creating a new template
      // TODO: add by default the "description" field
      setFields(FieldData.getDefaultFields());
    }
  }, [])

  // required for the sidebar to be sticky
  useEffect(() => {
    const App = document.querySelector(".App");
    App.style.height = "auto";
    App.style.position = "relative";
    return () => {
      App.style.removeProperty("auto");
      App.style.removeProperty("relative");
    }
  }, [])

  // for debugging
  console.log("CustomTemplate fields", fields);
  console.log("CustomTemplate selectedTemplate", selectedTemplate);
  // console.log("draggedIndex", draggedIndex);
  // console.log("sidebarToggleRef.current", sidebarToggleRef.current);

  return (
    <>
      <h2>{`${selectedTemplate?.id ? "Edita" : "Crea"} tu plantilla de control`}</h2>

      <div className="sidebar-sticky-container">
        <Sidebar 
          updateSidebarData={setSidebarData}
          showToggleButton={false}
          // rightSide={true}
          // sidebarData={sidebarData}
          sidebarToggleRef={sidebarToggleRef}
        >
          <CustomField 
            // field={sidebarFocusFieldRef.current} 
            FieldData={FieldData} 
            onUpdate={handleUpdateField} 
            onDelete={handleDeleteField} 
            FieldsValidator={FieldsValidator} 
          /> 
        </Sidebar>
      </div>

      <div className="form-page">
        {/* <CustomField 
          // field={sidebarFocusField} 
          FieldData={FieldData} 
          onUpdate={handleUpdateField} 
          onDelete={handleDeleteField} 
          FieldsValidator={FieldsValidator} 
        /> */}

        {/* <div className="sidebar-sticky-container">
          <Sidebar 
            updateSidebarData={setSidebarData}
            showToggleButton={false}
            // rightSide={true}
            // sidebarData={sidebarData}
            sidebarToggleRef={sidebarToggleRef}
          >
            <CustomField 
              // field={sidebarFocusFieldRef.current} 
              FieldData={FieldData} 
              onUpdate={handleUpdateField} 
              onDelete={handleDeleteField} 
              FieldsValidator={FieldsValidator} 
            /> 
          </Sidebar>
        </div> */}
          

        <ContentWrapper 
          sidebarData={sidebarData} 
        >
        {/* <div className={`page-container ${fields.length > 6 ? "move-up" : ''}`}> */}
          <div className="form-header">
            {/* <h1 className="">Crea tu Plantilla de Control</h1> */}
          </div>

          <div className="custom-form">
            <div
              className="form-fields-section"
              // onDrop={handleDrop}
              // onDragOver={handleDragOver}
              // onDragEnd={handleDragEnd}
            >
              {/* <h2 className="form-fields-title">Campos del Formulario</h2> */}
              <div className="content-sections">
                <FieldsContainer 
                  fields={fields}
                  onDeleteField={handleDeleteField}
                  onUpdateFieldValue={handleUpdateFieldValue}
                  onUpdateField={handleUpdateField}
                  FieldData={FieldData}
                  FieldsValidator={FieldsValidator}
                  // setDraggedIndex={setDraggedIndex}
                  onDragStart={handleDragStart}
                  onDrop={handleDrop}
                  // focusFieldRef={sidebarFocusFieldRef}
                  // onClick={handleTemplateFieldClick}
                  sidebarData={sidebarData}
                  // onUpdateSidebarData={setSidebarData}
                  sidebarToggleRef={sidebarToggleRef}
                  localFocusInputRef={localFocusInputRef}
                />
              </div>
              <div className="add-new-field-cell">
                <button className="add-custom-field-button" onClick={handleAddCustomField}>
                  <AddSvg />
                </button>
                {fields.length < 3 && (
                  <p className="no-fields-text">Haz click en el botón para añadir un campo personalizable.</p>
                )}
              </div>
            </div>
          </div>
        {/* </div> */}
        </ContentWrapper>
        <button className="save-template-button" onClick={handleSaveTemplate}>
          <SaveSvg />
          Guardar plantilla
        </button>
      </div>
    </>
  );
};

export default CustomTemplate;