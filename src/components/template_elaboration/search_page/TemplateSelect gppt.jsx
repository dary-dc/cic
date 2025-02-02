import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CustomSelect } from "../../custom_components/custom_select_component/CustomSelect.jsx";
import SearchBar from "./SearchBar.jsx";
import Carousel from "./Carousel.jsx";
import { useSelectionContext } from "../custom_template_page/SelectionContext.jsx";
import { ApiContext } from "../../ApiContext.jsx";
import { handleResponse } from "../../../utils/utils.js";
import Dropdown from "../../custom_components/Dropdown.jsx";
import { AddSvg } from "../../svg_components/AddSvg.jsx";
import { EditSvg } from "../../svg_components/EditSvg.jsx";
import { TrashSvg } from "../../svg_components/TrashSvg.jsx";
import "../../../style-sheets/SampleElaboration/TwoStepForm/SampleTypeSelect.css";

const controlProcessesOptions = [
    { label: "Orina Control", value: "Orina Control" },
    { label: "Suero Control", value: "Suero Control" }
];

const TemplateSelect = ({ routes: { base, customTemplate, commercialSerum } }) => {
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [templates, setTemplates] = useState([]);
    const { setTemplateData } = useSelectionContext();
    const { BASE_URL, PORT } = useContext(ApiContext);
    const navigate = useNavigate();
    const handleRemoveRef = useRef(null);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await fetch(`${BASE_URL}${PORT}/templates`);
                const templates = await handleResponse(response);
                setTemplates(templates);
            } catch (error) {
                console.error("Error fetching templates:", error);
            }
        };
        fetchTemplates();
    }, [BASE_URL, PORT]);

    const handleSelectChange = (e) => {
        const index = e.target.getAttribute("data-index");
        if (index !== null) {
            setSelectedTemplate(templates[index]);
        }
    };

    const handleDelete = async () => {
        if (!selectedTemplate) {
            return alert("Please select a template to delete.");
        }
        try {
            const response = await fetch(`${BASE_URL}${PORT}/template/${selectedTemplate.id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                alert("Successful deletion!");
                const newTemplates = templates.filter(template => template.id !== selectedTemplate.id);
                setTemplates(newTemplates);
                setSelectedTemplate(newTemplates.length ? newTemplates[0] : null);
                handleRemoveRef.current?.(selectedTemplate.id);
            } else {
                alert("Deletion failed!");
            }
        } catch (error) {
            console.error("Error deleting template:", error);
        }
    };

    const handleEdit = () => {
        if (!selectedTemplate) {
            return alert("Please select a template to edit.");
        }
        setTemplateData(selectedTemplate);
        navigate(`${base}${getProcessSlug(selectedTemplate.type)}/${selectedTemplate.id}`);
    };

    const handleControlProcessSelect = (e) => {
        const selectedValue = e.target.textContent.toLowerCase();
        setTemplateData({ type: selectedValue });
        navigate(`${base}${getProcessSlug(selectedValue)}/nuevo`);
    };

    const getProcessSlug = (process) => {
        return process === "suero comercial" ? commercialSerum : customTemplate;
    };

    return (
        <div className="sample-select-container">
            <h2>Seleccione o cree una plantilla de control</h2>
            <div className="selection-actions-container">
                <CustomSelect 
                    customClassName="capitalize-text"
                    onChange={handleSelectChange}
                    name="sample_type"
                    placeholder="Tipo de muestra"
                    searchable
                    noResults="Sin Opciones"
                    data={templates.map((template, index) => ({ text: template.name, value: index }))}
                    placeholderSearchBar="Buscar.."
                    SearchBar={SearchBar}
                    selectedValue={selectedTemplate?.name}
                />
                <div className="selection-buttons-container">
                    <Dropdown
                        options={controlProcessesOptions}
                        onOptionSelect={handleControlProcessSelect}
                        buttonOptions={{
                            buttonLabel: "Nuevo",
                            buttonSvg: <AddSvg customClass="process-select-add-svg" />,
                            buttonClass: "process-select-button",
                        }}
                        customClasses={{ listClass: "control-processes-list" }}
                        defaultClass="control-processes-dropdown"
                    />
                    <button className="edit" onClick={handleEdit} disabled={!selectedTemplate}>
                        <EditSvg /> Editar
                    </button>
                    <button className="delete" onClick={handleDelete} disabled={!selectedTemplate}>
                        <TrashSvg /> Eliminar
                    </button>
                </div>
            </div>
            {templates.length ? (
                <Carousel 
                    selectedTemplate={selectedTemplate}
                    onSampleSelection={setSelectedTemplate}
                    cards={templates}
                    setCards={setTemplates}
                    removeCallbackRef={handleRemoveRef}
                />
            ) : (
                <p>No se han creado plantillas de control ni sueros comerciales. Para crear una nueva plantilla, dirígete a "Nuevo" en el menú y selecciona la opción correspondiente.</p>
            )}
        </div>
    );
};

export default TemplateSelect;
