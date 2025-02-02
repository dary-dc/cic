// "Sample Types" are the sidebar content in the Urine Control template elaboration process  
import { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from 'react-router-dom';

const FormPageSidebarContent = () => {
    const navigate = useNavigate();
    const [selectedType, setSelectedType] = useState('/');

    const formCreationMap = {
        "commercial serum": "/commercial_serum/new", 
        "control serum": "/control_form/new", 
        "urine sample": "/control_form/new",
    };

    useEffect(() => {
        navigate(formCreationMap[selectedType]);
    }, [selectedType])

    return (
        <div className="checkbox-group">
            {Object.keys(formCreationMap).map((type) => (
                <label
                key={type}
                className={`checkbox-label ${
                    selectedType === type ? "checkbox-label-selected" : ""
                }`}
                // onClick={handleButtonsRoutes(type)}
                >
                <input
                    type="radio"
                    name="sample-type"
                    value={type}
                    checked={selectedType === type}
                    onChange={() => setSelectedType(type)}
                />
                {type}
                </label>
            ))}
        </div>
    );
}

export default FormPageSidebarContent;