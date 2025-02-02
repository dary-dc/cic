
const FieldData = {
  fieldConfig: {
    // Numeric: ["label", "rangeMin", "rangeMax", "precision", "units"],
    // Text: ["label", "maxLength", "format"],
    // Date: ["label", "format"],
    // Time: ["label", "format"],
    // Boolean: ["label", "values"],
    // Select: ["label", "options"],
    Numeric: ["rangeMin", "rangeMax", "precision", "units"],
    Text: ["maxLength", "format", "correctValue"],
    Date: ["format"],
    Time: ["format"],
    Boolean: ["values"],
    Select: ["options"],
  },
  formats: {
    Numeric: ["g/dL", "mg/dL", "cells/µL"],
    Text: ["Alphabetic", "Numeric", "Alphanumeric", "Email", "Any"],
    Date: ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"],
    Time: ["12-hour", "24-hour", "Duration"],
    // Select: ["Alphabetic", "Numeric", "Alphanumeric", "Email", "Any"],
  },
  booleanOptions: [
    "True/False",
    "Yes/No",
    "Active/Inactive",
    "On/Off",
    "1/0"
  ],
  validationRules: {
    label: /^.{1,50}$/,
    rangeMin: /^-?\d*\.?\d*$/,
    rangeMax: /^-?\d*\.?\d*$/,
    precision: /^[0-9]{1}$/,
    maxLength: /^[1-9][0-9]*$/,
    units: /.+/,
    format: /.+/,
    values: /.+/,
  },
  tooltips: {
    label: "A unique name for the field (1-50 characters)",
    rangeMin: "Minimum numeric value (numbers only)",
    rangeMax: "Maximum numeric value (numbers only)",
    precision: "Decimal precision (0-9)",
    maxLength: "Maximum text length (positive number)",
    format: "Select the expected format",
    units: "Select a measurement unit",
    values: "Select boolean value options",
    type: "Select the type of the field",
    options: "Type the name of the option",
  },
  // Options: {},
  getDefaultValues: (field, fieldConfig, formats) => {
    const defaultValues = {};

    fieldConfig[field.type].forEach((key) => {
      // Default value for units
      if (key === "units" && !field.properties[key]) {
        defaultValues[key] = "g/dL";
      }
      // Default value for format based on field type
      if (key === "format" && !field.properties[key]) {
        const formatOptions = formats[field.type];
        if (formatOptions && formatOptions.length > 0) {
          defaultValues[key] = formatOptions[0]; // Set to the first available format
        }
      }
      // Default value for boolean values
      if (key === "values" && field.type === "Boolean" && !field.properties[key]) {
        defaultValues[key] = "True/False";
      }
      // Default options for select
      if (key === "options" && field.type === "Select" && !field.properties[key]) {
        // defaultValues[key] = { "opcion 1": {}, "opcion 2": {}, "opcion 3": {}, };
        defaultValues[key] = ["opcion 1", "opcion 2", "opcion 3",];
      }
    });

    console.log(Object.keys(defaultValues).length > 0 
    ? { ...field, properties: { ...field.properties, ...defaultValues } } 
    : field)

    return Object.keys(defaultValues).length > 0 
      ? { ...field, properties: { ...field.properties, ...defaultValues } } 
      : field;
  }, 
  getDefaultFields: () => [
    {
      // id: new Date().toISOString().split("T")[0],
      id: new Date(Date.now()).toISOString(),
      type: "Text",
      value: "",
      label: "Nombre de la plantilla",
      errors: { label: false, maxLength: false, format: false },
      properties: { maxLength: "100", format: "Any" }
    },
    // {
    //   id: Date.now() + 1,
    //   type: "Date",
    //   value: "",
    //   errors: { label: false, format: false },
    //   values: { label: "Fecha de creacion", format: "DD/MM/YYYY" }
    // },
    {
      // id: Date.now() + 1,
      id: new Date(Date.now() + 1).toISOString(),
      type: "Text",
      value: "",
      label: "Descripcion de la plantilla",
      errors: { label: false, maxLength: false, format: false },
      properties: { maxLength: "150", format: "Any" }
    }
  ], 
}

export default FieldData;