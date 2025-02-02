import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CustomSelect } from "../../custom_components/custom_select_component/CustomSelect.jsx";
import SearchBar from "./SearchBar.jsx"
import Carousel from "./Carousel.jsx";
import { SelectionContext } from "../custom_template_page/SelectionContext.jsx";
import "../../../style-sheets/SampleElaboration/TwoStepForm/SampleTypeSelect.css";

const testSamples = [
  { name: 'Blood Sample', components: ['Red Blood Cells', 'White Blood Cells', 'Platelets', 'Plasma'] },
  { name: 'Water Sample', components: ['pH Level', 'Dissolved Oxygen', 'Conductivity', 'Turbidity'] },
  { name: 'Soil Sample', components: ['Organic Matter', 'Nutrients', 'pH', 'Moisture Content'] },
  { name: 'Air Sample', components: ['Nitrogen', 'Oxygen', 'Carbon Dioxide', 'Particulates'] },
  { name: 'Milk Sample', components: ['Fat Content', 'Protein', 'Lactose', 'Vitamins', 'Minerals'] },
  { name: 'Urine Sample', components: ['Glucose', 'Proteins', 'Ketones', 'pH', 'Color', 'Clarity'] },
  { name: 'Food Sample', components: ['Calories', 'Carbohydrates', 'Proteins', 'Fats', 'Fiber'] },
  { name: 'DNA Sample', components: ['Adenine', 'Thymine', 'Guanine', 'Cytosine'] },
  { name: 'Plant Sample', components: ['Chlorophyll', 'Water Content', 'Minerals', 'Tissue Structure'] },
  { name: 'Hair Sample', components: ['Keratin', 'Color Pigments', 'Scalp Oil', 'Moisture'] },
];

const SampleTypeSelect = () => {

	const [selectedSample, setSelectedSample] = useState(null)
	const [samples, setSamples] = useState(testSamples)
	const { setTemplateId } = useContext(SelectionContext);

	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
		const response = await fetch('https://api.example.com/data');
		const result = await response.json();
		setSamples(result);
		};
		// fetchData();
	}, []);	

	const handleSelectChange = (e) => {
		console.log("e", e)
		setSelectedSample(e.target.getAttribute("value"));
	}

	const handleDelete = () => {
		
	}

	const handleEdit = (e, newTemplate=false) => {
		let uri_end = newTemplate ? "nuevo" : ":id";
		setTemplateId()
		navigate(`/Elaboración-de-Muestras/formulario-de-control/${uri_end}`)
	}

	// console.log("selectedSample", selectedSample)
	// console.log("dropdrownData", dropdrownData)

	return (
		<div className="sample-select-container">
			<h2>Seleccione la plantilla de control</h2>
			<div className="selection-actions-container">				
				<CustomSelect 
					customClassName={"capitalize-text"} 
					onChange={handleSelectChange} // onClick option
					name="sample_type" 
					placeholder={"Tipo de muestra"} 
					searchable={true} 
					noResults={"Sin Opciones"} 
					noOPtions={"Sin Opciones"} 
					data={samples.map(sample => { return { text: sample.name, value: sample.name, }} )}
					placeholderSearchBar={"Buscar.."}  
					SearchBar={SearchBar}
					selectedValue={selectedSample}
				/>
				<div className="selection-buttons-container">
					<button className="create" onClick={(e) => handleEdit(e, true)}>Nueva</button>
					<button className="edit"   onClick={handleEdit}>Editar</button>
					<button className="delete" onClick={handleDelete}>Eliminar</button>
				</div>
			</div>
			<Carousel 
				selectedSample={selectedSample}
				onSampleSelection={setSelectedSample}
				// cardsData={testSamples.map((sample, index) => sample.name)} 
				cards={testSamples} 
			/>
		</div>
  );
};

export default SampleTypeSelect;