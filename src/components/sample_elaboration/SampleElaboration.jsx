import React, { useState, useCallback, useEffect, useContext } from "react";
import "../../style-sheets/TemplateElaboration/SearchPage/SearchPage.css";
import "../../style-sheets/TemplateElaboration/SearchPage/SearchBar.css";
import "../../style-sheets/SampleElaboration.css";

import "../../style-sheets/TemplateElaboration/TwoStepForm/SampleTypeSelect.css";
import { ApiContext } from "../ApiContext.jsx";
import { handleResponse } from "../../utils/utils.js";
import { useSelectionContext } from "../template_elaboration/custom_template_page/SelectionContext.jsx";
import SearchBar from "../SearchBar.jsx";
import { TemplateSelection } from "./TemplateSelection.jsx";
import { TemplateFieldRenderer } from "./TemplateFieldRenderer.jsx";
import { RightArrowSvg } from "../svg_components/RightArrowSvg.jsx";
import { LeftArrowSvg } from "../svg_components/LeftArrowSvg.jsx";
import { v4 as uuid } from "uuid"

const stepsTotal = 2;

const SampleElaboration = () => {
	const { BASE_URL,PORT } = useContext(ApiContext);

	const [selectedTemplate, setSelectedTemplate] = useState(null)
	const [templates, setTemplates] = useState([])
	const { setTemplateData } = useSelectionContext();
	const [actualStep,setActualStep] = useState(1);

  
	useEffect(() => {
		const fetchTemplates = async () => {
		const response = await fetch(`${BASE_URL}${PORT}/templates`);

		const templates = await handleResponse(response);
		setTemplates(templates);
	};
		fetchTemplates();
	}, [BASE_URL, PORT]);	

	const handleStep = (e,type) => {
		switch(type){
			case "prev":
				if(actualStep > 1){
					setActualStep(actualStep - 1);
				}
				break;
			case "next":
				if(actualStep <= stepsTotal && selectedTemplate && actualStep < stepsTotal){
					setActualStep(actualStep + 1);
				}
				break;
			default:
				break;
		}
		
	}

	const handleSelectChange = (e) => {
		// console.log("e", e)
		setSelectedTemplate(templates[e.target.getAttribute("data-index")]);
	}

	const handleStepChange = () => {
		switch(actualStep){
			case 1:
				return (
					<TemplateSelection
						handleSelectChange = {handleSelectChange} 
						templates = {templates} 
						onSetTemplates = {setTemplates} 
						SearchBar = {SearchBar} 
						selectedTemplate = {selectedTemplate} 
						setSelectedTemplate = {setSelectedTemplate} 
					/>
				)

			case 2:
				return (
					<TemplateFieldRenderer
						handleSelectChange = {handleSelectChange} 
						templates = {templates} 
						SearchBar = {SearchBar} 
						selectedTemplate = {selectedTemplate} 
						setSelectedTemplate = {setSelectedTemplate} 
					/>
				)

			default:
				break;
		}
	}

  return (
	<div className="sample-elaboration-form-container">
		<div className="steps-form">
			{
				Array.from({ length: stepsTotal * 2 + 1 }, (_, index) => {
					let actualStepNumber = (index + 1) / 2;
					let prevStepNumber = index / 2;
					let isBlueLine = false;

					if( (actualStep >= actualStepNumber) || (actualStep >= prevStepNumber && prevStepNumber === stepsTotal) )
						isBlueLine = true;

					return (
							index % 2 !== 0 ?
							<div key={uuid()} className={`step-item ${actualStep >= actualStepNumber ? "actual-step" : ""}`}>
								{ actualStepNumber }
							</div> 
							:
							<div key={uuid()} className={`gray-line ${ isBlueLine  ? "blue-line" : ""}`}></div>
						)
					
				})
			}
		</div>
		
		<div className="navigate-container">
			<div className={`blue-border steps-navigate-buttons ${actualStep === 1 ? "disabled-button" : "" }`} id="form-action-button" onClick={ (e) => handleStep(e,"prev") } value=">">
				<LeftArrowSvg/> Previo
			</div>
			<div className={`blue-border steps-navigate-buttons ${selectedTemplate && actualStep < stepsTotal ? "" : "disabled-button"}`} id='form-action-button' onClick={ (e) => handleStep(e,"next") } value=">">
				Siguiente <RightArrowSvg/>
			</div>
		</div>

		{ handleStepChange() }

		
	</div>
  );
}
export default SampleElaboration;