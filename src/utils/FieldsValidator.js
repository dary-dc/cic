const FieldsValidator = {
  numeric: (value, properties) => {
      const numValue = parseFloat(value);
      if (!/^-?\d*\.?\d*$/.test(numValue)) return false;
  
      if (properties.rangeMin && numValue < parseFloat(properties.rangeMin)) return false;
      if (properties.rangeMax && numValue > parseFloat(properties.rangeMax)) return false;
  
      if (properties.precision) {
        const decimalPlaces = (value.split('.')[1] || '').length;
        if (decimalPlaces > parseInt(properties.precision)) return false;
      }
  
      return true;
  },
  text: (value, properties) => {
    if (properties.maxLength && value.length > properties.maxLength) {
      return false;
    }
      switch (properties.format) {
        case 'Any':
          return true;
        case 'Alphabetic':
          return /^[a-zA-Z]*$/.test(value);
        case 'Numeric':
          return /^\d*$/.test(value);
        case 'Alphanumeric':
          return /^[a-zA-Z0-9]*$/.test(value);
        case 'Email':
          return /^[a-zA-Z0-9._%+-]*@?[a-zA-Z0-9.-]*\.?[a-zA-Z]*$/.test(value);
        default:
          return true;
      }
  },
  getTooltip: (field) => {
    const parseSpecifications = (specs) => 
      specs.replace(/[{}"]/g, "").replace(/:/g, ": ").replace(/,/g, ", ").replace(/\s{2}/g, " -"); 
    return field 
      ? `${field.type} (${parseSpecifications(JSON.stringify(field.properties))})` 
      : "";
  },

  customField: (field, validationRules, fieldConfig, setError) => {
    const newErrors = fieldConfig[field.type].reduce((acc, key) => {
      acc[key] = !validationRules[key]?.test(field.properties[key] || "");
      return acc;
    }, {});
    if (Object.values(newErrors).some((e) => e)) {
      // if (Object.properties(newErrors).some((e) => e)) {
      if (setError) setError(newErrors);
      return false;
    }
    if (setError) setError({});
    return true;
  },

}

export default FieldsValidator;