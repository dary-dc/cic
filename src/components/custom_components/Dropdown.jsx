import { useState, useEffect, useCallback, useRef, memo } from 'react';
import { LeftArrowSvg } from "../svg_components/LeftArrowSvg";

const Dropdown = ({ 
  options, 
  onOptionSelect, 
  buttonOptions, 
  customClasses, 
  defaultClass="sort-control-dropdown" 
  // selectedOption, 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const dropdownRef = useRef(null);

  const toggleDropdown = (e) => {
    setIsOpen((prev) => !prev);
  }

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  // useEffect(() => {
  //   console.log("options", customClasses.listClass, "'changed'")
  //   if (!buttonOptions && (Object.prototype.toString.call(options) === "[object Array]" ? options.length : null)) {
  //     setIsDropdownVisible(true);
  //   }
  // }, [options, buttonOptions, customClasses.listClass]);


  const handleOptionSelect = (e) => {
    onOptionSelect(e);
    setSelectedValue(e.target.textContent);
    setIsOpen(false);
  };

  // for debugging
  // console.log("isDropdownVisible", isOpen)
  // console.log("dropdownRef.current", dropdownRef.current)
  // console.log("options", options)

  return (
    <div className={`${customClasses.dropdown ?? "custom-dropdown"} custom-dropdown-scrollable`} ref={dropdownRef}>
      {buttonOptions && (
        <button className={buttonOptions.buttonClass} onClick={toggleDropdown}>
          {buttonOptions?.buttonSvg}
          {selectedValue ?? buttonOptions?.buttonLabel}
          {buttonOptions?.dropdownSvg ?? (
            <LeftArrowSvg customClass={"rotate-down-left-arrow"}/>
          )}
        </button>
      )}
      <ul className={`${defaultClass} ${customClasses.listClass} ${isOpen ? 'visible' : ''}`}>
        {options.map((option, index) => (
          <li key={index} onClick={handleOptionSelect}>
            {option.label ?? option}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default memo(Dropdown);