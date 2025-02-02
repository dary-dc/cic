import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CustomSelect } from "../../custom_components/custom_select_component/CustomSelect.jsx";
import SearchBar from "./SearchBar.jsx"
import Carousel from "./Carousel.jsx";
import { useSelectionContext } from "../custom_template_page/SelectionContext.jsx";
import { ApiContext } from "../../ApiContext.jsx";
import { handleResponse } from "../../../utils/utils.js";
import Dropdown from "../../custom_components/Dropdown.jsx";
import { AddSvg } from "../../svg_components/AddSvg.jsx"
import { EditSvg } from "../../svg_components/EditSvg.jsx"
import { TrashSvg } from "../../svg_components/TrashSvg.jsx";
import "../../../style-sheets/TemplateElaboration/TwoStepForm/SampleTypeSelect.css";
import { firePopup } from "../../alert_components/Alert/CustomAlert.jsx";

const controlProcessesOptions = [
	{ label: "Orina Control", value: "Orina Control" },
	{ label: "Suero Control", value: "Suero Control" }
]

const TemplateSelect = ({ routes: {base, customTemplate, commercialSerum} }) => {
	const [selectedTemplate, setSelectedTemplate] = useState(null)
	const [templates, setTemplates] = useState([])
	const { templateData, setTemplateData } = useSelectionContext();
	const { BASE_URL, PORT } = useContext(ApiContext);
	const navigate = useNavigate();
	const handleRemoveRef = useRef(null)

	const fetchTemplates = useCallback(async () => {
		const response = await fetch(`${BASE_URL}${PORT}/templates`);
		console.log("response", response)
		const templates = await handleResponse(response);
		setTemplates(templates);
	}, [BASE_URL, PORT]);
	
	useEffect(() => {
		fetchTemplates();
	}, [BASE_URL, PORT, fetchTemplates]);

	const handleSelectChange = (e) => {
		console.log(`e.target.getAttribute("data-index")`, e.target.getAttribute("data-index"))
		console.log(`templates[e.target.getAttribute("data-index")].id`, templates[e.target.getAttribute("data-index")].id)
		setSelectedTemplate(templates[e.target.getAttribute("data-index")]);
	}

	const handleDelete = async () => {
		let html = <span><span style={{color:"#7066e0"}}>PLANTILLA ELIMINADA CORRECTAMENTE</span></span>
		let html2 = <span><span style={{color:"#7066e0"}}>NO SE PUDIERON ELIMINAR LOS DATOS</span></span>
		let html3 = <span><span style={{color:"#7066e0"}}>NO HAY PLANTILLA SELECCIONADA</span></span>

		if (selectedTemplate) {
			console.log("handleDelete selectedTemplate", selectedTemplate)
			// if (!window.confirm('Are you sure you want to delete this template?')) return;

			const response = await fetch(`${BASE_URL}${PORT}/template/${selectedTemplate.id}`,{
				method:"DELETE",
			});
			await handleResponse(response);			
			if (response.ok) {
				firePopup({ html : html,type:"success",title: "Realizado",isHtmlComponent:true})

				// update the items in the carousel
				// fetchTemplates();

				console.log("templates.filter(template => template.id !== selectedTemplate.id)", templates.filter(template => template.id !== selectedTemplate.id))
				let newTemplates = templates.filter(template => template.id !== selectedTemplate.id)
				setTemplates(newTemplates)
				// let newIndex = templates.indexOf(selectedTemplate)
				// // newIndex = newIndex !== templates.length - 1 ? newIndex : templates.length - 2
				// newIndex = newIndex--

				// console.log("templates.indexOf(selectedTemplate)", templates.indexOf(selectedTemplate))
				// console.log("newIndex", newIndex)
				// console.log("templates[newIndex]", newTemplates[newIndex])

				// setSelectedTemplate(newTemplates[newIndex])
				// handleRemoveRef.current(selectedTemplate.id)
			} else {
				firePopup({ html : html2,type:"success",title: "Realizado",isHtmlComponent:true})
			}
		} else {
			firePopup({ html : html3,type:"success",title: "Realizado",isHtmlComponent:true})
		}
	}

	const handleEdit = (e) => {
		// pass the template data through the context to make it accessible from the `CustomTemplate` component, 
		// which gets in charge of requesting the fields of the custom_template to the backend
		setTemplateData(selectedTemplate)
		// navigate(`${base}${getProcessSlug(selectedTemplate.type)}/${selectedTemplate.id}`)
		navigate(`${base}${getProcessSlug(selectedTemplate.type)}/${selectedTemplate.id}`, {
			state: { template: selectedTemplate } // Pass data via navigation state
		});
	}

	const handleControlProcessSelect = (e) => {
		const selectedValue = e.target.textContent.toLowerCase();
		setTemplateData({ type: selectedValue })
		navigate(`${base}${getProcessSlug(selectedValue)}/nuevo`)
	}

	const getProcessSlug = (process) => {
		switch (process) {
			case 'orina control':
				return customTemplate
			case 'suero comercial':
				return commercialSerum
			case 'suero control':
				return customTemplate
			default:
				return customTemplate
		}
	}

	console.log("selectedTemplate", selectedTemplate)
	console.log("templateData", templateData)
	console.log("templates", templates)

	return (
		<div className="sample-select-container">
			<h2>Seleccione o cree una plantilla de control</h2>
			<div className="selection-actions-container">				
				<CustomSelect 
					customClassName={"capitalize-text"} 
					onChange={handleSelectChange} // onClick option
					name="sample_type" 
					placeholder={"Tipo de muestra"} 
					searchable={true} 
					noResults={"Sin Opciones"} 
					noOPtions={"Sin Opciones"} 
					data={templates.map(template => ({ text: template.name, value: template.name, }) )}
					placeholderSearchBar={"Buscar.."}  
					SearchBar={SearchBar}
					selectedValue={selectedTemplate?.name}
				/>
				<div className="selection-buttons-container">
					<Dropdown
						options={controlProcessesOptions}
						onOptionSelect={handleControlProcessSelect}
						buttonOptions={{
							buttonLabel: "Nuevo", 
							buttonSvg: <AddSvg customClass={"process-select-add-svg"} />,
							buttonClass: "process-select-button",
						}}
						customClasses={{
							listClass:"control-processes-list",
						}}
						defaultClass="control-processes-dropdown"
					/>
					<button className="edit"   onClick={handleEdit}>
						<EditSvg />
						Editar
					</button>
					<button className="delete" onClick={handleDelete}>
						<TrashSvg />
						Eliminar
					</button>
				</div>
			</div>
			{templates.length ? (
				<Carousel 
					selectedTemplate={selectedTemplate}
					onTemplateSelection={setSelectedTemplate}
					// cardsData={testSamples.map((sample, index) => sample.name)} 
					cards={templates} 
					setCards={setTemplates}
				/>
			) : (
                <div className="no-data-container custom-no-data-container">
                    <p>No se han creado <span className='custom-header-label'>plantillas de control </span> 
                    Para crear una nueva plantilla, dirígete a "Nuevo" en el menú y 
                    selecciona la opción correspondiente.</p>

                    <img className="no-data-png" src={require("../../../resources/no-data.png")} alt="Loading..." /> 
				</div>
			)
			}
		</div>
  );
};

export default TemplateSelect;