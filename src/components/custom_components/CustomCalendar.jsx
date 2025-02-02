import React, { useEffect, useRef, useState } from 'react'
import { DateSvg } from '../svg_components/DateSvg';
import { CustomSelect } from './custom_select_component/CustomSelect';

export const CustomCalendar = ({formData,onChange,name}) => {
    const[showCalendar,setShowCalendar] = useState(false);
    const dateInputContainer  = useRef(null);
    const calendarMainContainer  = useRef(null);
        
    const monthsData = {
        ene: 1,
        fbr: 2,
        mrz: 3,
        abr: 4,
        may: 5,
        jun: 6,
        jul: 7,
        ags: 8,
        spt: 9,
        oct: 10,
        nov: 11,
        dic: 12,
    };

    const [yearsData,setYearsData] = useState([
        {
            "text" : "2024",
            "value" : "2024"
        },
        {
            "text" : "2025",
            "value" : "2025"
        },

    ]);

    const handleMonthClick = (e,type,month) => {
        dateInputContainer.current.name = type;
        dateInputContainer.current.value = month;
        console.log(dateInputContainer.current);
        
        e.target = dateInputContainer.current;

        onChange(e);    

        dateInputContainer.current.classList.add("calendar-valid");
        
        if(formData['start_month_date'] && type === "end_month_date" && month !== ""){
            dateInputContainer.current.value = `${formData['start_year']} ${formData['start_month_date']} - ${formData['end_year']} ${month}`;   
        }else if(formData['end_month_date'] && type === "start_month_date" && month !== ""){
            dateInputContainer.current.value = `${formData['start_year']} ${month} - ${formData['end_year']} ${formData['end_month_date']}`;   
        }

    }

    const handleChangeYear = (e) => {
        dateInputContainer.current.value = `${formData['start_year']} ${formData['start_month_date']} - ${formData['end_year']} ${formData['end_month_date']}`;   
        if(e.target.name === "start_year"){
            dateInputContainer.current.value = `${e.target.value} ${formData['start_month_date']} - ${formData['end_year']} ${formData['end_month_date']}`;   
        }else
            dateInputContainer.current.value = `${formData['start_year']} ${formData['start_month_date']} - ${e.target.value} ${formData['end_month_date']}`;   
    
        onChange(e);
    }

    const handleClickMenu = (e) => {
        if(showCalendar && calendarMainContainer.current){
            if(!calendarMainContainer.current.contains(e.target) && calendarMainContainer.current != e.target && !e.target.classList.contains("custom-select-dropdown-option")){
                setShowCalendar(false);
            }
        }
    }

    useEffect(() => {
        window.removeEventListener("click",handleClickMenu);
        window.addEventListener("click",handleClickMenu);
    });

    return (
        <div ref={calendarMainContainer} className="calendar-main-container container-Input-placeholder ">
            <DateSvg/>
            <input ref={dateInputContainer} onChange={onChange} readOnly={ true } className="medium-width blue-border  left-alignment form-input" name={name} type="text" onClick={() => setShowCalendar(!showCalendar)} required/>
            <label className="placeholder form-label">Fecha | Inicio - Fin</label>
            <div className={`calendars-container ${ showCalendar ? "active-calendars" : "" }`}>
                <div className="flex-container calendar-container flex-column">
                    <div className="custom-select-wrapper">
                        <CustomSelect onChange={handleChangeYear} name="start_year" placeholder={"Año inicio"} searchable={false} noResults={"Sin Opciones"} noOPtions={"Sin Opciones"} data={yearsData} placeholderSearchBar={"Buscar.."}/>
                    </div>
                    <div className="months-container">
                        <div className={`calendar-month-button ${formData['start_month_date'] === "ene" ? "active-month" : "" }`} onClick={(e) =>  handleMonthClick(e,"start_month_date","ene") }>
                            ene
                        </div> 
                        <div className={`calendar-month-button ${formData['start_month_date'] === "fbr" ? "active-month" : "" }`} onClick={(e) =>  handleMonthClick(e,"start_month_date","fbr") }>
                            fbr
                        </div>
                        <div className={`calendar-month-button ${formData['start_month_date'] === "mrz" ? "active-month" : "" }`} onClick={(e) =>  handleMonthClick(e,"start_month_date","mrz") }>
                            mrz
                        </div>
                        <div className={`calendar-month-button ${formData['start_month_date'] === "abr" ? "active-month" : "" }`} onClick={(e) =>  handleMonthClick(e,"start_month_date","abr") }>
                            abr
                        </div>
                        <div className={`calendar-month-button ${formData['start_month_date'] === "may" ? "active-month" : "" }`} onClick={(e) =>  handleMonthClick(e,"start_month_date","may") }>
                            may
                        </div>
                        <div className={`calendar-month-button ${formData['start_month_date'] === "jun" ? "active-month" : "" }`} onClick={(e) =>  handleMonthClick(e,"start_month_date","jun") }>
                            jun
                        </div>
                        <div className={`calendar-month-button ${formData['start_month_date'] === "jul" ? "active-month" : "" }`} onClick={(e) =>  handleMonthClick(e,"start_month_date","jul") }>
                            jul
                        </div>
                        <div className={`calendar-month-button ${formData['start_month_date'] === "ags" ? "active-month" : "" }`} onClick={(e) =>  handleMonthClick(e,"start_month_date","ags") }>
                            ags
                        </div>
                        <div className={`calendar-month-button ${formData['start_month_date'] === "spt" ? "active-month" : "" }`} onClick={(e) =>  handleMonthClick(e,"start_month_date","spt") }>
                            spt
                        </div>
                        <div className={`calendar-month-button ${formData['start_month_date'] === "oct" ? "active-month" : "" }`} onClick={(e) =>  handleMonthClick(e,"start_month_date","oct") }>
                            oct
                        </div>
                        <div className={`calendar-month-button ${formData['start_month_date'] === "nov" ? "active-month" : "" }`} onClick={(e) =>  handleMonthClick(e,"start_month_date","nov") }>
                            nov
                        </div>
                        <div className={`calendar-month-button ${formData['start_month_date'] === "dic" ? "active-month" : "" }`} onClick={(e) =>  handleMonthClick(e,"start_month_date","dic") }>
                            dic
                        </div>
                    </div>
                </div>

                <div className="flex-container calendar-container flex-column">
                    <div className="custom-select-wrapper">
                        <CustomSelect onChange={handleChangeYear} name="end_year" placeholder={"Año final"} searchable={false} noResults={"Sin Opciones"} noOPtions={"Sin Opciones"} data={yearsData} placeholderSearchBar={"Buscar.."}/>
                    </div>
                    {console.log("end_month_date",formData['end_month_date'])}
                    <div className="months-container">
                        <div className={`calendar-month-button ${formData['end_month_date'] === "ene" ? "active-month" : "" }`} onClick={ (e) =>  handleMonthClick(e,"end_month_date","ene") }>
                            ene
                        </div> 
                        <div className={`calendar-month-button ${formData['end_month_date'] === "fbr" ? "active-month" : "" }`} onClick={ (e) =>  handleMonthClick(e,"end_month_date","fbr") }>
                            fbr
                        </div>
                        <div className={`calendar-month-button ${formData['end_month_date'] === "mrz" ? "active-month" : "" }`} onClick={ (e) =>  handleMonthClick(e,"end_month_date","mrz") }>
                            mrz
                        </div>
                        <div className={`calendar-month-button ${formData['end_month_date'] === "abr" ? "active-month" : "" }`} onClick={ (e) =>  handleMonthClick(e,"end_month_date","abr") }>
                            abr
                        </div>
                        <div className={`calendar-month-button ${formData['end_month_date'] === "may" ? "active-month" : "" }`} onClick={ (e) =>  handleMonthClick(e,"end_month_date","may") }>
                            may
                        </div>
                        <div className={`calendar-month-button ${formData['end_month_date'] === "jun" ? "active-month" : "" }`} onClick={ (e) =>  handleMonthClick(e,"end_month_date","jun") }>
                            jun
                        </div>
                        <div className={`calendar-month-button ${formData['end_month_date'] === "jul" ? "active-month" : "" }`} onClick={ (e) =>  handleMonthClick(e,"end_month_date","jul") }>
                            jul
                        </div>
                        <div className={`calendar-month-button ${formData['end_month_date'] === "ags" ? "active-month" : "" }`} onClick={ (e) =>  handleMonthClick(e,"end_month_date","ags") }>
                            ags
                        </div>
                        <div className={`calendar-month-button ${formData['end_month_date'] === "spt" ? "active-month" : "" }`} onClick={ (e) =>  handleMonthClick(e,"end_month_date","spt") }>
                            spt
                        </div>
                        <div className={`calendar-month-button ${formData['end_month_date'] === "oct" ? "active-month" : "" }`} onClick={ (e) =>  handleMonthClick(e,"end_month_date","oct") }>
                            oct
                        </div>
                        <div className={`calendar-month-button ${formData['end_month_date'] === "nov" ? "active-month" : "" }`} onClick={ (e) =>  handleMonthClick(e,"end_month_date","nov") }>
                            nov
                        </div>
                        <div className={`calendar-month-button ${formData['end_month_date'] === "dic" ? "active-month" : "" }`} onClick={ (e) =>  handleMonthClick(e,"end_month_date","dic") }>
                            dic
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}