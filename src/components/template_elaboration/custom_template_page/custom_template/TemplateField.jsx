import { memo } from "react";
import Dropdown from "../../../custom_components/Dropdown.jsx";
import { CustomArrowSvgComponent } from "../../../custom_components/custom_select_component/CustomArrowSvgComponent.jsx";
import { useFocusContext } from "../FocusContext.jsx";
import { TrashSvg } from "../../../svg_components/TrashSvg";
import { AddSvg } from "../../../svg_components/AddSvg.jsx";

const TemplateField = ({ 
    index, 
    field, 
    focusClass, 
    onDeleteField, 
    onUpdateFieldValue, 
    // onUpdateField, 
    fieldData, 
    FieldsValidator,
    // setDraggedIndex, 
    onDragStart, 
    onDrop, 
    onClick,
    localFocusInputRef, 
}) => {

    // console.log("TemplateField field", field)
    // console.log("TemplateField Object.values(field.errors).some((type) => type)", Object.values(field.errors).some((type) => type))
    // console.log("TemplateField index", index)

    const renderInput = (field) => {
        const { type, properties } = field;
        
        switch (type) {
            case 'Numeric':
                return (
                    <input
                        // type="text" // Changed to text to have more control over input
                        type="number"
                        value={field.value}
                        // onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                        const value = e.target.value;
                        // Only update if the value is valid
                        console.log("value", value)
                        console.log("FieldsValidator", FieldsValidator)
                        if (FieldsValidator.numeric(value, properties) || value === '') {
                            onUpdateFieldValue(field.id, value);
                        }
                        }}
                        onBlur={(e) => {
                        // Format the number on blur if it's not empty
                        if (e.target.value && e.target.value !== '-') {
                            const formatted = properties.precision 
                            ? parseFloat(e.target.value).toFixed(parseInt(properties.precision))
                            : e.target.value;
                            onUpdateFieldValue(field.id, formatted);
                        }
                        }}
                        // placeholder={`Enter ${values.label || "value"}`}
                        placeholder={`Enter the ${field.type.toLowerCase()} value`}
                    />
                );

            case 'Text':
                return (
                    <input
                        type={properties.format === 'Email' ? 'email' : 'text'}
                        value={field.value}
                        onChange={(e) => {
                        const value = e.target.value;
                        console.log("value", value);
                        console.log("FieldsValidator.text(value, values)", FieldsValidator.text(value, properties))
                        if (FieldsValidator.text(value, properties)) {
                            onUpdateFieldValue(field.id, value);
                        }
                        }}
                        onBlur={(e) => {
                        if (properties.format === 'Email') {
                            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                            if (!emailRegex.test(e.target.value)) {
                            console.log('Invalid email format');
                            }
                        }
                        }}
                        maxLength={properties.maxLength}
                        // placeholder={`Enter ${values.label || "value"}`}
                        placeholder={`Enter the ${field.type.toLowerCase()} value`}
                        className={`form-input ${properties.format}`}
                    />
                );

            case 'Date':
                return (
                    <input
                        type="date"
                        value={field.value}
                        onChange={(e) => onUpdateFieldValue(field.id, e.target.value)}
                        // placeholder={`Enter ${values.label || "value"}`}
                        placeholder={`Enter the ${field.type.toLowerCase()} value`}
                    />
                );

            case 'Time':
                return (
                    <input
                        type="time"
                        value={field.value}
                        onChange={(e) => onUpdateFieldValue(field.id, e.target.value)}
                        // placeholder={`Enter ${values.label || "value"}`}
                        placeholder={`Enter the ${field.type.toLowerCase()} value`}
                    />
                );

            case 'Boolean':
                const booleanOptions = properties.values?.split('/').map(v => v.trim()) || ['True', 'False'];
                return (
                    <select
                        value={field.value}
                        onChange={(e) => onUpdateFieldValue(field.id, e.target.value)}
                    >
                        {booleanOptions.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                        ))}
                    </select>
                );

            case 'Select':
                const options = properties.options || [];
                return (
                    <Dropdown 
                        options={options}
                        onOptionSelect={(e) => onUpdateFieldValue(field.id, e.target.textContent)} 
						buttonOptions={{
							buttonLabel: "--Seleccione--", 
							// buttonSvg: <AddSvg customClass={"process-select-add-svg"} />,
							dropdownSvg: <CustomArrowSvgComponent customClass={"process-select-add-svg"} />,
							// buttonClass: "process-select-button",
						}}
                        customClasses={{
                            listClass: "control-processes-list",
                            // dropdown: "custom-template-dropdown",
                        }} 
						defaultClass="control-processes-dropdown"
                    />
                    // <select
                    //     value={field.value}
                    //     onChange={(e) => onUpdateFieldValue(field.id, e.target.value)}
                    // >
                    //     {options.map((option, index) => (
                    //     <option key={index} value={option}>
                    //         {option}
                    //     </option>
                    //     ))}
                    // </select>
                );
    
            default:
                return (
                    <input
                        type="text"
                        value={field.value}
                        onChange={(e) => onUpdateFieldValue(field.id, e.target.value)}
                        // placeholder={`Enter ${values.label || "value"}`}
                        placeholder={`Enter the ${field.type.toLowerCase()} value`}
                        />
                );
        }
    };

    return (
        <div 
            // key={field.id} 
            className={`form-custom-field ${focusClass} ${Object.values(field.errors).some((type) => type) ? "error" : ""}`}
            draggable
            // onDragStart={handleDragStart}
            // onDragStart={() => handleDragStart(index)}
            onDragStart={(e) => onDragStart(e, index)}
            onDrop={(e) => onDrop(e, index)}
            onClick={(e) => onClick(e, field)}
            onDragOver={(e) => e.preventDefault()} // Prevent the default handling of the `dragover` event, so we can drop the element
            // onBlur={(e) => onUpdateField(e, field)}
            // onClick={(e) => setFocusTemplateField(e, field)}
        >
            <h4>
                {/* {field.values.label || "Unnamed Field"} */}
                {/* {field.values.label || "(Unnamed)"} */}
                {field.label || "(Unnamed)"}
            </h4>
            {/* <div className="form-field-input" ref={localFocusInputRef} draggable={false}> */}
            <div 
                className="form-field-input" 
                ref={localFocusInputRef} 
                draggable 
                onDragStart={(e) => {e.preventDefault(); e.stopPropagation();}}
            >
                <label>
                    {/* {field.values.label}: */}
                    {/* {field.values.units && (
                    <span className="units">{`(${field.values.units})`}</span>
                    )}
                    {field.type === "Text" && (
                    <span className="format">{`(${field.values.format})`}</span>
                    )}
                    {field.type === "Date" && (
                    <span className="format">{`(${field.values.format})`}</span>
                    )}
                    {field.type === "Time" && (
                    <span className="format">{`(${field.values.format})`}</span>
                    )}
                    {field.type === "Boolean" && (
                    <span className="format">{`(${field.values.values})`}</span>
                    )} */}
                </label>
                <span className="tooltip">{FieldsValidator.getTooltip(field)}</span>
                {renderInput(field)}
            </div>
            {focusClass && (
                <div className="field-actions">
                    <button
                        className="trash-button"
                        onClick={() => onDeleteField(field.id)}
                    >
                        <TrashSvg />
                    </button>
                </div>
            )}
        </div>
    );
}

export default memo(TemplateField);