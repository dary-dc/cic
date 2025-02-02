import React, { useContext, useEffect, useState } from 'react'
import { handleResponse } from '../../utils/utils';
import { ApiContext } from '../ApiContext';
import { CustomSelect } from '../custom_components/custom_select_component/CustomSelect';
import { firePopup } from '../alert_components/Alert/CustomAlert';
import { v4 as uuid } from "uuid"

export const TemplateFieldRenderer = ({selectedTemplate}) => {
  const { BASE_URL,PORT } = useContext(ApiContext);
  const [userData,setUserData] = useState({});
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({});

  console.log("fields", fields)

  const [formDataErrors, setFormDataErrors] = useState(() => {});

  const handleFormFieldChange = (e) => {
    let name = e.target.getAttribute("name");
    // console.log(e.target)
    // console.log("name", name)
    let value = !e.target.value.length ? e.target.getAttribute("value") : e.target.value;
    // console.log("value", value)
    
    setFormData((prevData) => ({...prevData,[name] : value}));
    setFormDataErrors((prevData) => ({...prevData,[name] : false}));
  }

  const handleFetchCreatorUser = async () => {
    selectedTemplate['creating_user'] = 3;

    let response = await fetch(`${ BASE_URL }${ PORT }/users/${ selectedTemplate['creating_user'] }`)
    let jsonData = await handleResponse(response);

    setUserData(jsonData);
    
    response = await fetch(`${ BASE_URL }${ PORT }/fields/${ selectedTemplate['id'] }`)
    jsonData = await handleResponse(response);
    
    setFields(jsonData);

    let data = jsonData.reduce((acc, field) => {
      acc[field.id] = "";
      return acc;
    }, {})

    setFormData(data);

    setFormDataErrors(jsonData.reduce((acc, field) => {
      acc[field.id] = false;
      return acc;
    }, {}));

  }

  useEffect(() => {
    handleFetchCreatorUser()
  },[])

  const handleCheckData = async (e) => {
    let html = <span><span style={{color:"#7066e0"}}>COINCIDE CON LA PALNTILLA</span> guardando muestra como <span style={{color:"#7066e0"}}>CONTROLADOR</span></span>
    let html2 = <span><span style={{color:"#7066e0"}}>NO COINCIDE CON LA PLANTILLA</span> descartando como <span style={{color:"#7066e0"}}>CONTROLADOR</span></span>
    let html3 = <span><span style={{color:"#7066e0"}}>REVISE LOS CAMPOS</span></span>

    let tempFormDataErrors = {};
    let templateMatches = true;
    let canContinue = true;
    Object.assign(tempFormDataErrors,formDataErrors);

    // NEED FIX SOME FIELDS ARE NOT GETTING THE ERROR CLASS 
    for(let i = 0;i < fields.length;i++){
      let field = fields[i];
      let key = field.id;
      let fieldType = field.type.toLowerCase().trim()

      // if (fieldType === "text" && (!field.label.toLowerCase().includes("descripcion de la plantilla") && !field.label.toLowerCase().includes("nombre de la plantilla"))) {
      if (fieldType === "text") {
        if (!field.label.toLowerCase().includes("descripcion de la plantilla") && !field.label.toLowerCase().includes("nombre de la plantilla")) {
          if (formData[key] != field.value)
            templateMatches = false;
        }
        // console.log("text")
        // console.log("key", key)
        // console.log("Number(formData[key])", formData[key])
        // console.log(`field.label.toLowerCase().includes("descripcion de la plantilla")`, field.label.toLowerCase().includes("descripcion de la plantilla"))
        // console.log(`field.label.toLowerCase().includes("descripcion de la plantilla")`, field.label.toLowerCase().includes("nombre de la plantilla"))
      } else if (fieldType === "numeric") {
        console.log("fieldType", fieldType)
        console.log("Number(formData)", formData)
        console.log("key", key)
        // console.log("Number(formData[key])", formData[key])
        // console.log("Number(formData[key])", Number(formData[key]))
        // console.log("Number(field.properties.rangeMax)", Number(field.properties.rangeMax))
        // console.log("Number(field.properties.rangeMin)", Number(field.properties.rangeMin))
        // console.log("first", Number(formData[key]) > Number(field.properties.rangeMax))
        // console.log("last", Number(formData[key]) < Number(field.properties.rangeMin))
        if (Number(formData[key]) > Number(field.properties.rangeMax) || Number(formData[key]) < Number(field.properties.rangeMin))
          templateMatches = false;
      } else {
        console.log("other", fieldType)
        console.log("key", key)
        console.log("Number(formData[key])", formData[key])
        console.log("Number(formData[key])", Number(formData[key]))
        if (formData[key] != field.value)
          templateMatches = false;
      }
      console.log("templateMatches", templateMatches)
      // if(field.properties.correctValue){
      // if(field.value){
        // if(formData[key] != field.properties.correctValue && !field.label.toLowerCase().includes("descripcion de la plantilla") && !field.label.toLowerCase().includes("nombre de la plantilla"))
        // if(formData[key] != field.value && !field.label.toLowerCase().includes("descripcion de la plantilla") && !field.label.toLowerCase().includes("nombre de la plantilla"))
        //   templateMatches = false;
      // }

      if(formData[key].length === 0){
        tempFormDataErrors[key] = true;
        canContinue = false;
      }else{
        tempFormDataErrors[key] = false;
      }
    }

    if(canContinue){
      if(templateMatches){
        firePopup({ html : html,type:"success",title: "Realizado",isHtmlComponent:true})
        let customData = {
          template_id : selectedTemplate['id'],
        } 
        
        let keysFormData = Object.keys(formData);

        for(let i =0;i < keysFormData.length;i++){
          customData[keysFormData[i]] = formData[keysFormData[i]];
        }

        let response = await fetch(`${BASE_URL}${PORT}/samples`,{
          method:"POST",
          headers:{ "Content-Type": "application/json"},
          body:JSON.stringify(customData)
        });
  
      }else{
        firePopup({ html : html2,type:"error",title: "Error",isHtmlComponent:true})
      }
    }else{
      firePopup({ html : html3,type:"error",title: "Error",isHtmlComponent:true})
    }

    setFormDataErrors(tempFormDataErrors);
  }


  const handleRenderNumberFields = (field,index) => {
    return (
      <div key={index} className={`container-Input-placeholder custom-field-container ${formDataErrors[field.label] ? "error" : ""}`}>
        <input onChange={handleFormFieldChange} id={ field.id } value={formData[ field.label ]} className="full-width huge-height blue-border  left-alignment form-input" name={ field.id } type="text" required/>
        <label className="placeholder form-label" htmlFor="equipment">{ field.label }</label>
      </div>
    );
  }

  const handleRenderTextFields = (field,index) => {
    return (
      <div key={index} className={`container-Input-placeholder custom-field-container ${formDataErrors[field.label] ? "error" : ""}`}>
        <input onChange={handleFormFieldChange} id={ field.id } value={formData[ field.label ]} className="full-width huge-height blue-border  left-alignment form-input" name={ field.id } type="text" required/>
        <label className="placeholder form-label" htmlFor="equipment">{ field.label }</label>
      </div>
    );
  }

  const handleRenderDateFields = (field,index) => {
    return (
      <div key={index} className={`container-Input-placeholder custom-field-container ${formDataErrors[field.label] ? "error" : ""}`}>
        <input onChange={handleFormFieldChange} id={ field.id } value={formData[ field.label ]} className="full-width huge-height blue-border  left-alignment form-input" name={ field.id } type="date" required/>
        <label className="placeholder form-label" htmlFor="equipment">{ field.label }</label>
      </div>
    );
  }

  const handleRenderSelectFields = (field,index) => {
    let customData = field.properties.values.map((d) => {
      return {
        text: d,
        value: d,
      }
    }) 
    return (
      <div key={index} className={`container-Input-placeholder custom-field-container ${formDataErrors[field.label] ? "error" : ""}`}>
        <CustomSelect onChange={handleFormFieldChange} name={ field.id } placeholder={ field.label } searchable={ customData.length > 10 } noResults={ "Sin Opciones" } noOPtions={ "Sin Opciones" } data={ customData} placeholderSearchBar={ "Buscar.." }/>
      </div>
    );
  }

  const handleRenderBooleanFields = (field,index) => {
    let customData = field.properties.values.split("/").map((d) => {
      return { 
        text:d,
        value:d,
      }
    });
    return (
      <div key={index} className={`container-Input-placeholder custom-field-container `}>
        <CustomSelect onChange={handleFormFieldChange} name={ field.id } placeholder={ field.label } searchable={ customData.length > 10 } noResults={ "Sin Opciones" } noOPtions={ "Sin Opciones" } data={ customData} placeholderSearchBar={ "Buscar.." }/>
      </div>
    );
  }

  return (
    <div className="main-sample-form">
      <div className={`custom-field-header flex-container`}>
          <div className='template-header-title'> { selectedTemplate['name'] } </div>
          <div className="user-creator-container">{ userData.name }</div>
          { selectedTemplate['creation_date'] }
      </div>
    
      <div className="form-container">
        {
          fields.map((field,index) => {
            let type = field['type'].toLowerCase();
      
          if(type === "numeric")
              return handleRenderNumberFields(field,index);
      
            else if(type === "text")
              return handleRenderTextFields(field,index);
      
            else if(type === "date")
              return handleRenderDateFields(field,index);
      
            else if(type === "dropdown")
              return handleRenderSelectFields(field,index);
      
            else if(type === "boolean")
              return handleRenderBooleanFields(field,index);
          })
        }
      </div>
      <div className="flex-container full-width">
        <input type="button" className="extra-width blue-border small-height" id="form-action-button" onClick={ handleCheckData } value="Comprobar"/>
      </div>
    </div>
)
}
