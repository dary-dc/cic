import React from 'react'
import { CustomSelect } from '../custom_components/custom_select_component/CustomSelect'
import Carousel from '../template_elaboration/search_page/Carousel'

export const TemplateSelection = ({
    handleSelectChange,
    templates,
    onSetTemplates, 
    SearchBar,
    selectedTemplate,
    setSelectedTemplate,
}) => {
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
					data={templates.map(template => ({ text: template.name, value: template.name, }) )}
					placeholderSearchBar={"Buscar.."}  
					SearchBar={SearchBar}
					selectedValue={selectedTemplate?.name}
				/>

			</div>
			{
                templates.length ? (
                    <Carousel
                        selectedTemplate={selectedTemplate}
                        onTemplateSelection={setSelectedTemplate}
                        // cardsData={testSamples.map((sample, index) => sample.name)} 
                        cards={templates} 
                        setCards={onSetTemplates} 
                    />
                ) : (
                    <div className="no-data-container">
                        <p>No se han creado <span className='custom-header-label'>plantillas de control </span> 
                        Para crear una nueva plantilla, dirígete a "Nuevo" en el menú y 
                        selecciona la opción correspondiente.</p>

                        <img className="no-data-png" src={require("../../resources/no-data.png")} alt="Loading..." /> 
                    </div>
                )
			}
		</div>
  )
}
