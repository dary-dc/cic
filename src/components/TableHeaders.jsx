import { useContext, useEffect, useState } from "react";
import { CustomSelect } from "./custom_components/custom_select_component/CustomSelect";
import { ComponentSvg } from "./svg_components/ComponentSvg";
import { ConcentrationSerumSvg } from "./svg_components/ConcentrationSerumSvg";
import { EquipmentSvg } from "./svg_components/EquipmentSvg";
import { MethodSvg } from "./svg_components/MethodSvg";
import { PatternSvg } from "./svg_components/PatternSvg";
import { TemperatureSvg } from "./svg_components/TemperatureSvg";
import { handleResponse } from "../utils/utils";
import { ApiContext } from "./ApiContext";
import ReactDOMServer from 'react-dom/server';
import ApexCharts from 'apexcharts';
import { Buffer } from 'buffer';
const ExcelJS = await import('exceljs');

export const TableHeaders = ({ dataRows,columnHeaders,tableTitle,handleFormFieldChange,controllersData,determinationData,formDataErrors,formData,setControllersData,setDeterminationData,handleSubmitFormData }) => {
    var temperatureData = [
        {
            text:"Celsius",
            value:"celsius"
        },
        {
            text:"Farenheit",
            value:"Farenheit"
        }
    ];
    
    const { BASE_URL,PORT } = useContext(ApiContext);
    
    const requestDeterminationsData = async () => {
        let response = await fetch(`${BASE_URL}${PORT}/determinations`);
        setDeterminationData(await handleResponse(response));
        
        response = await fetch(`${BASE_URL}${PORT}/controllers`);
        setControllersData(await handleResponse(response));
        
    }

    const generatePrintableTable = async () => {
        let responseInstitutions = await fetch(`${BASE_URL}${PORT}/institutions`);
        let institutionData = await handleResponse(responseInstitutions);

        let translateDict = {
            "institution_id" : {
                name : "Institución",
                isId:true,
                data: institutionData
            },
            "determination_id" : {
                name : "Determinación",
                isId:true,
                data: determinationData
            },
            "controller_id" : {
                name : "Controlador",
                isId:true,
                data: controllersData
            },
            "equipment_name" : {
                name : "Equipo",
                isId: false,
            },
            "analytic_technique_name" : {
                name : "Técnica analítica",
                isId: false,
            },
            "analytic_method_name" : {
                name : "Método analítica",
                isId: false,
            },
            "temperature_value" : {
                name : "Temperatura",
                isId: false,
            } ,
        };

        let fieldNames = Object.keys(formData)
        const tableHeaders = document.createElement('table');
        tableHeaders.classList.add('printable-table');
        tableHeaders.classList.add('centered-table');
        
        const tbodyTableHeaders = document.createElement('tbody');
        
        fieldNames.forEach((fieldName) => {

            if (translateDict[fieldName]){
                const headerRowTableHeaders = document.createElement('tr');
                
                let finalName = translateDict[fieldName]['name'];
                let finalValue = formData[fieldName];

                if(translateDict[fieldName]["isId"]){
                    let data = translateDict[fieldName]["data"]
                    for(let i = 0;i < data.length;i++) {
                        let d = data[i];

                        if(parseInt(d.value) === parseInt(finalValue)){
                            finalValue = d.text;
                            break;
                        }
                    };

                }

                if(fieldName === "temperature_value")
                    finalValue += `° ${formData["temperature_type"]}`;

                const thFieldName = document.createElement('td');
                thFieldName.textContent = finalName;
                
                const thValue = document.createElement('td');
                thValue.textContent = finalValue;
    
                headerRowTableHeaders.appendChild(thFieldName);
                headerRowTableHeaders.appendChild(thValue);
    
                tbodyTableHeaders.appendChild(headerRowTableHeaders);
            }
        })
        
        tableHeaders.appendChild(tbodyTableHeaders);

        const dataTable = document.createElement('table');
        dataTable.classList.add('printable-table');
        dataTable.classList.add('centered-table');
        
        const theadDataTable = document.createElement('thead');
        const headerRowDataTable = document.createElement('tr');
        let columnNames = [];
        
        columnHeaders.forEach(header => {
          const th = document.createElement('th');
          th.textContent = ReactDOMServer.renderToStaticMarkup(header.label).replaceAll(/(&nbsp;|<([^>]+)>)/ig,"");
          
          columnNames.push(header.name.toLowerCase());
          headerRowDataTable.appendChild(th);
        });
    
        theadDataTable.appendChild(headerRowDataTable);
        dataTable.appendChild(theadDataTable);
      
        const tbody = document.createElement('tbody');
        let dataRowsArray = Object.keys(dataRows);
    
        for(let i =0;i < dataRowsArray.length;i++){
            let row = dataRowsArray[i];
            let dataObject = dataRows[row];
    
            const bodyRow = document.createElement('tr');
            let dataObjectKeysArray = Object.keys(dataObject);
    
            for(let x =0;x < dataObjectKeysArray.length;x++){
                let columnName = dataObjectKeysArray[x];
                let data = dataObject[columnName];
    
                if(!columnNames.includes(columnName.toLowerCase())) continue;
    
                const td = document.createElement('td');
                
                td.textContent = data;
                bodyRow.appendChild(td);
            }
            
            tbody.appendChild(bodyRow);
    
        }
    
        dataTable.appendChild(tbody);

        const tableContainer = document.createElement('div'); 
        tableContainer.classList.add("table-container");
        
        tableContainer.appendChild(tableHeaders);
        tableContainer.appendChild(dataTable);
        if(document.querySelector(".report-graph")) {
            const graphElement = document.querySelector(".report-graph");
            const graphClone = graphElement.cloneNode(true);
            tableContainer.appendChild(graphClone);
        }
        return tableContainer;
    }
    
    const handlePrintTable = async (e,dataRows,columnHeaders) => {
        // firePopup({html : "hola",title : "hola",icon : "success",footer: '<a href="#">Why do I have this issue?</a>',draggable:true});
        const printableTable = await generatePrintableTable(dataRows, columnHeaders);
    
        document.body.appendChild(printableTable);
        window.print();
    
        document.body.removeChild(printableTable);
    
    }
    
    const handleDownloadExcel = async (e) => {
        let responseInstitutions = await fetch(`${BASE_URL}${PORT}/institutions`);
        let institutionData = await handleResponse(responseInstitutions);
    
        let translateDict = {
            "institution_id": {
                name: "Institución",
                isId: true,
                data: institutionData
            },
            "determination_id": {
                name: "Determinación",
                isId: true,
                data: determinationData
            },
            "controller_id": {
                name: "Controlador",
                isId: true,
                data: controllersData
            },
            "equipment_name": {
                name: "Equipo",
                isId: false,
            },
            "analytic_technique_name": {
                name: "Técnica analítica",
                isId: false,
            },
            "analytic_method_name": {
                name: "Método analítica",
                isId: false,
            },
            "temperature_value": {
                name: "Temperatura",
                isId: false,
            },
        };
    
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(tableTitle);
    
        Object.keys(formData).forEach(fieldName => {
            if (translateDict[fieldName]) {
                const header = translateDict[fieldName].name;
                let value = formData[fieldName];
    
                if (translateDict[fieldName].isId) {
                    const data = translateDict[fieldName].data;
                    for (let i = 0; i < data.length; i++) {
                        if (parseInt(data[i].value) === parseInt(value)) {
                            value = data[i].text;
                            break;
                        }
                    }
                }
    
                if (fieldName === "temperature_value") {
                    value += `° ${formData["temperature_type"]}`;
                }
    
                worksheet.addRow([header, value]);
            }
        });
    
        const keys = columnHeaders.map(header => header.name);
        worksheet.addRow([]); 
        worksheet.addRow(keys); 
    
        Object.keys(dataRows).forEach(key => {
            const rowData = keys.map(headerKey => {
                let value = dataRows[key][headerKey];
                return value; 
            });
            worksheet.addRow(rowData); 
        });
        
        if(document.querySelector(".report-graph")){
            const chart = ApexCharts.getChartByID('report-graph');
            const { imgURI } = await chart.dataURI();
        
            const base64Data = imgURI.split(',')[1]; 
            const imageBuffer = Buffer.from(base64Data, 'base64');
            const imageId = workbook.addImage({
                buffer: imageBuffer,
                extension: 'png',
            });
        
            worksheet.addImage(imageId, {
                tl: { col: 0, row: worksheet.rowCount + 2 },
                ext: { width: 600, height: 400 },
            });
        
        }
        
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
    
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = `${tableTitle}.xlsx`;
    
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        });
    };
      


    useEffect(() => {
        requestDeterminationsData();
    },[])

    return (
        <form className="side-form">
            <div className={`container-Input-placeholder ${formDataErrors.determination_id ? 'error' : ''}`}>
                <ComponentSvg/>
                <div className="custom-select-wrapper">
                    <CustomSelect   onChange={handleFormFieldChange} name="determination_id" placeholder={"Determinación"} searchable={true} noResults={"Sin Opciones"} noOPtions={"Sin Opciones"} data={determinationData} placeholderSearchBar={"Buscar.."}/>
                </div>
            </div>
            <div className={`container-Input-placeholder ${formDataErrors.equipment_name ? 'error' : ''}`}>
                <EquipmentSvg/>
                <input onChange={handleFormFieldChange} value={formData.equipment_name} className="medium-height blue-border  left-alignment form-input" name="equipment_name" type="text" required/>
                <label className="placeholder form-label" htmlFor="equipment">Equipo</label>
            </div>
            <div className={`container-Input-placeholder ${formDataErrors.analytic_method_name ? 'error' : ''}`}>
                <PatternSvg/>
                <input onChange={handleFormFieldChange} value={formData.analytic_method_name} className="medium-height blue-border  left-alignment form-input" name="analytic_method_name" type="text" required/>
                <label className="placeholder form-label" htmlFor="analytic_method">Método analítica</label>
            </div>
            <div className={`container-Input-placeholder ${formDataErrors.analytic_technique_name ? 'error' : ''}`}>
                <MethodSvg/>
                <input onChange={handleFormFieldChange} value={formData.analytic_technique_name} className="medium-height blue-border  left-alignment form-input" name="analytic_technique_name" type="text" required/>
                <label className="placeholder form-label" htmlFor="analytic_technique">Técnica analítico</label>
            </div>
            <div className={`container-Input-placeholder ${formDataErrors.temperature_value ? 'error' : ''}`}>
                <TemperatureSvg/>
                <input onChange={handleFormFieldChange} value={formData.temperature_value} className="medium-height blue-border left-alignment form-input temperature-input" name="temperature_value" type="text" required/>
                <label className="placeholder form-label" htmlFor="temperature">Temperatura</label>
                <div className="custom-select-wrapper-small">
                    <CustomSelect   name="temperature_type" selectedValue = {formData.temperature_type} onChange={handleFormFieldChange} placeholder={"Tipo"} noResults={"Sin Opciones"} noOPtions={"Sin Opciones"} data={temperatureData} placeholderSearchBar={"Buscar.."}/>
                </div>
            </div>
            <div className={`container-Input-placeholder ${formDataErrors.controller_id ? 'error' : ''}`}>
                <ConcentrationSerumSvg/>
                <div className="custom-select-wrapper">
                    <CustomSelect   name="controller_id" selectedValue = {formData.controller_id} onChange={handleFormFieldChange} placeholder={"Controlador"} searchable={true} noResults={"Sin Opciones"} noOPtions={"Sin Opciones"} data={controllersData} placeholderSearchBar={"Buscar.."}/>
                </div>
            </div>
            
            <div className="flex-container flex-column">
                <input type="button" className="extra-width blue-border " id="form-action-button" onClick={handleSubmitFormData} value="Guardar"/>
                <input type="button" className="extra-width blue-border " id="form-action-button" onClick={handleDownloadExcel} value="Descargar Excel"/>
                <input type="button" className="extra-width blue-border " id="form-action-button" onClick={handlePrintTable} value="Imprimir"/>
            </div>
            
        </form>
    );
}