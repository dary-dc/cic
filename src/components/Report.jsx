import { useContext, useEffect, useRef, useState } from "react";
import { CustomSelect } from "./custom_components/custom_select_component/CustomSelect";
import { DateSvg } from "./svg_components/DateSvg";
import { ComponentSvg } from "./svg_components/ComponentSvg";
import { calculateAverageXi, handleResponse } from "../utils/utils";
import { ApiContext } from "./ApiContext";
import { Table } from "./table_components/Table";
import { D1D2 } from "./svg_components/D1D2Svg";
import { N } from "./svg_components/NSvg";
import ReactApexChart from "react-apexcharts";
import "../style-sheets/Report.css";
import { CustomCalendar } from "./custom_components/CustomCalendar";
import { PaginationComponent } from "./custom_components/PaginationComponent";
import { v4 as uuid } from "uuid"
import { D1AndD2 } from "./svg_components/D1AndD2Svg";
import ReactDOMServer from 'react-dom/server';
import ApexCharts from 'apexcharts';
import { Buffer } from 'buffer';
import { ReportDataContainer } from "./ReportDataContainer";
import { render } from "react-dom";
const ExcelJS = await import('exceljs');

const Report = () => {

    const { BASE_URL,PORT } = useContext(ApiContext);

    
    const [controllersData,setControllersData] = useState([]);
    const [determinationData,setDeterminationData] = useState([]);

    const methodValue = useRef(null);
    const translateDict = useRef(null);
    const [methodFetchedData,setMethodFetchedData] = useState([]);
    const[dates,setDates] = useState([]);
    const[data,setData] = useState([]);
    const [actualPage,setActualPage] = useState(0);
    const methodData = useRef([
        {
            "text" : "Repetibilidad",
            "value" : "repeatability"
        },
        {
            "text" : "Reproducibilidad",
            "value" : "reproducibility"
        },
    ]);

    const [formData,setFormData] = useState({
        "start_year"  : "",
        "end_year" : "",
        "determination_id" : "",
        "method" : "",
        "start_month_date" : "",
        "end_month_date" : "",
    })

    const [formDataErrors,setFormDataErrors] = useState({
        "start_year"  : false,
        "date" : false,
        "end_year" : false,
        "determination_id" : false,
        "method" : false
    })

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
    
    let columnsRepeatability = [{
        name:'n',
        label:'N',
        svgComponent:<N/>,
        options:{
            readOnly:true,
            calculable:{
                fields:['date'],
                equation:'month-day',
            },
            totalizer:"row-count",
            initialValue: new Date().getMonth() + 1
        }
        
    },
    {
        name:'date',
        label:'Fecha',
        svgComponent:<DateSvg/>,
        options:{
            initialValue: new Date().toISOString().split("T")[0]
        }
    },
    {
        name:'d1',
        label:
            <span>d
                <sub>1</sub>
            </span>,
        svgComponent:<D1D2/>,
    },
    {
        name:'d2',
        label:
            <span>d
                <sub>2</sub>
            </span>,
        svgComponent:<D1D2/>,
    },
    {
        name:'d1_d2',
        label:
            <span>|d
                <sub>1</sub>
                -
                d
                <sub>2</sub>
            |</span>,
        svgComponent:<D1AndD2/>,
        options:{
            calculable:{
                fields:['d1','d2'],
                equation:'d1-d2',
            },
            readOnly:true,
        }
    },
    {
        name:'d1_d2_2',
        label:
            <span>(|d
                <sub>1</sub>
                -
                d
                <sub>2</sub>
                |)^
                <sup>2</sup>
            </span>,
        svgComponent:<D1AndD2/>,
        options:{
            calculable:{
                fields:['d1_d2'],
                equation:'^2',
            },
            readOnly:true,
            totalizer:"total",
        }
    },
    
    ];

    let columnsReproducibility = [
        {
            name:'n',
            label:'N',
            svgComponent:<N/>,
            options:{
                readOnly:true,
                calculable:{
                    fields:['date'],
                    equation:'month-day',
                },
                totalizer:"row-count",
                initialValue: new Date().getMonth() + 1
            }
        },
        {
            name:'date',
            label:'Fecha',
            svgComponent:<DateSvg/>,
            options:{
                initialValue: new Date().toISOString().split("T")[0]
            }
        },
        {
            name:'xi',
            label:
                <sub>(Xi)</sub>,
            svgComponent:<D1D2/>,
            options:{
                totalizer:"total",
            }
        },
        {
            name:'xi_x',
            label:
                <sub>(Xi-X)</sub>,
            svgComponent:<D1D2/>,
            options:{
                calculable:{
                    fields:['xi','n'],
                    type:"Dynamic",
                    equation:'(xis / nt) - xi',
                    modifiers:{
                        'xi': {
                            operations : ["total"],
                            outputVariableName : "xis"
                        },
                        'n': {
                            operations : ["row-count"],
                            outputVariableName : "nt"
                        },
                    },
                },
                readOnly:true,
                totalizer:"total",
            }
        },
        {
            name:'xi_x_2',
            label:
            <span>(Xi-X)
                <sup>2</sup>
            </span>,
            svgComponent:<D1AndD2/>,
            options:{
                calculable:{
                    fields:['xi_x'],
                    equation:'^2',
                },
                readOnly:true,
                totalizer:"total",
            }
        }
    ];

    const getAdittionalData = async () => {
        
        let responseInstitutions = await fetch(`${BASE_URL}${PORT}/institutions`);
        let institutionData = await handleResponse(responseInstitutions);
        
        translateDict.current = {
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
    }
    useEffect(() => {
        getAdittionalData()
    })
    const handlePageChange = (pageNumber) => {
        setActualPage(pageNumber);
    };  

    const requestDeterminationsData = async () => {
        let response = await fetch(`${BASE_URL}${PORT}/determinations`);
        setDeterminationData(await handleResponse(response));
     
        response = await fetch(`${BASE_URL}${PORT}/controllers`);
        setControllersData(await handleResponse(response));   
    }
    

    const handleFormFieldChange = async (e) => {
        let name = e.target.name !== "" ? e.target.name : e.target.getAttribute("name");
        let value = e.target.value !== "" && e.target.value != 0 ? e.target.value : e.target.getAttribute("value");

        setFormData((prevData) => ({...prevData,[name] : value}));
        setFormDataErrors((prevData) => ({...prevData,[name] : value === ""}));
    }

    const handleGetData = async (e) => {
        let areAlmostOneError = false;

        let dataKeys = Object.keys(formData); 

        for(let i =0;i < dataKeys.length;i++){

            if(formData[dataKeys[i]] === ""){
                areAlmostOneError = true;
                setFormDataErrors((preValue) => ({...preValue,[dataKeys[i]]:true}));
            }
        }

        if(!areAlmostOneError){
            let body = formData;
            let start_date = `${formData['start_year']}-${monthsData[formData["start_month_date"]]}-1`;
            let end_date = `${formData['end_year']}-${monthsData[formData["end_month_date"]]}-1`;

            let response = undefined;

            methodValue.current = body['method'];
            
            if(body['method'] === "repeatability"){
                response = await fetch(`${BASE_URL}${PORT}/repeatability?start_date=${start_date}&end_date=${end_date}&determination_id=${formData['determination_id']}`);
                
                let jsonData = await handleResponse(response);
                jsonData.push(jsonData[0])
                jsonData.push(jsonData[0])
                jsonData.push(jsonData[0])
                jsonData.push(jsonData[0])
                
                setMethodFetchedData(jsonData);
                let datesDataTemp = [];
                let fragmentDataTemp = [];
    
                let fragmentsDataArray = jsonData;
    
                for(let i = 0;i < fragmentsDataArray.length;i++){
                    let fragmentData = fragmentsDataArray[i]["fragments_data"];
    
                    datesDataTemp.push([]);
                    fragmentDataTemp.push([]);
                    
                    for(let x = 0;x < fragmentData.length;x++){
                        if(fragmentData[x]?.date)
                            datesDataTemp[i].push(fragmentData[x]?.date)
                        if(fragmentData[x]?.d1 && fragmentData[x]?.d2)
                            fragmentDataTemp[i].push(fragmentData[x]?.d1 - fragmentData[x]?.d2)
                    
                    }
    
                    setData(fragmentDataTemp);
                    setDates(datesDataTemp);
                }
            }
            
            if(body['method'] === "reproducibility"){
                response = await fetch(`${BASE_URL}${PORT}/reproducibility?start_date=${start_date}&end_date=${end_date}&determination_id=${formData['determination_id']}`);
                
                let jsonData = await handleResponse(response);
                
                setMethodFetchedData(jsonData);
                let datesDataTemp = [];
                let fragmentDataTemp = [];

                let fragmentsDataArray = jsonData;

                for(let i = 0;i < fragmentsDataArray.length;i++){
                    let fragmentData = fragmentsDataArray[i]["fragments_data"];

                    datesDataTemp.push([]);
                    fragmentDataTemp.push([]);
                    
                    let xiAverage = calculateAverageXi(fragmentData);
                    for(let x = 0;x < fragmentData.length;x++){
                        if(fragmentData[x]?.date)
                            datesDataTemp[i].push(fragmentData[x]?.date)
                        if(fragmentData[x]?.xi)
                            fragmentDataTemp[i].push(fragmentData[x]?.xi - xiAverage)
                    }

                    setData(fragmentDataTemp);
                    setDates(datesDataTemp);
                }
            }
        }
    }

    const generatePrintableTable = async () => {
        let columnHeaders = formData['method'] === "repeatability" ? columnsRepeatability : columnsReproducibility;
        let states = [];
    
        const tableContainer = document.createElement('div'); 
        tableContainer.classList.add("table-container", "container");
    
        for(let i = 0; i < methodFetchedData.length; i++){
            let dataRows = methodFetchedData[i]['fragments_data'];
    
            let fieldNames = Object.keys(methodFetchedData[i]['headers_data']);
            const tableHeaders = document.createElement('table');
            tableHeaders.classList.add('printable-table', 'centered-table');
            
            const tbodyTableHeaders = document.createElement('tbody');
            
            fieldNames.forEach((fieldName) => {
                if (translateDict.current[fieldName]){
                    const headerRowTableHeaders = document.createElement('tr');
                    
                    let finalName = translateDict.current[fieldName]['name'];
                    let finalValue = methodFetchedData[i]['headers_data'][fieldName];
    
                    if(translateDict.current[fieldName]["isId"]){
                        let data = translateDict.current[fieldName]["data"];

                        for(let j = 0; j < data.length; j++) {
                            let d = data[j];
                            if(Number(d.value) === Number(finalValue)){
                                finalValue = d.text;
                                break;
                            }
                        };
                    }
    
                    if(fieldName === "temperature_value"){
                        finalValue += `° ${methodFetchedData[i]['headers_data']["temperature_type"]}`;
                    }
    
                    const thFieldName = document.createElement('td');
                    thFieldName.textContent = finalName;
                    
                    const thValue = document.createElement('td');
                    thValue.textContent = finalValue;
    
                    headerRowTableHeaders.appendChild(thFieldName);
                    headerRowTableHeaders.appendChild(thValue);
    
                    tbodyTableHeaders.appendChild(headerRowTableHeaders);
                }
            });
            
            tableHeaders.appendChild(tbodyTableHeaders);
            tableContainer.appendChild(tableHeaders);
    
            const dataTable = document.createElement('table');
            dataTable.classList.add('printable-table', 'centered-table');
            
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
    
            for(let row of dataRowsArray){
                let dataObject = dataRows[row];
                const bodyRow = document.createElement('tr');
    
                for(let columnName in dataObject) {
                    if(columnNames.includes(columnName.toLowerCase())) {
                        const td = document.createElement('td');
                        td.textContent = dataObject[columnName];
                        bodyRow.appendChild(td);
                    }
                }
                
                tbody.appendChild(bodyRow);
            }
    
            dataTable.appendChild(tbody);
            tableContainer.appendChild(dataTable);
    
            if(formData['method'] == "repeatability"){
                let dataSeries = [];
                let datesCalc = [];
        
                for(let k = 0; k < dataRows.length; k++){
                    let actualObject = dataRows[k];
        
                    if(actualObject?.date)
                        datesCalc.push(actualObject.date);
                    if(actualObject?.d1 && actualObject?.d2)
                        dataSeries.push(Math.pow(actualObject.d1 - actualObject.d2, 2));
                }
        
                let nArray = [];
                let differenceArray = [];
                
                for(let l = 0; l < dataRows.length; l++){
                    let data_object = dataRows[l];
        
                    nArray.push(data_object["n"]);
                    differenceArray.push(data_object["d1"] - data_object["d2"]);            
                }
        
                let body = {
                    "totalNSum": nArray.length,
                    "differenceArray": differenceArray,
                }
        
                let response = await fetch(`${BASE_URL}${PORT}/deviations`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });
                
                let jsonData = await handleResponse(response);
        
                let state = {
                    series: [{
                        name: "d1_d2",
                        data: dataSeries
                    }],
                    chart: {
                        height: 350,
                        type: 'area',
                        id: 'report-graph'
                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        curve: 'smooth'
                    },
                    xaxis: {
                        type: 'datetime',
                        categories: datesCalc
                    },
                    tooltip: {
                        x: {
                            format: 'dd/MM/yy HH:mm'
                        }
                    },
                    annotations: {
                        yaxis: [
                            { y: jsonData['r1'], borderColor: 'green', label: { text: '1 R', borderColor: 'green' } },
                            { y: jsonData['r2'], borderColor: 'yellow', label: { text: '2 R', borderColor: 'yellow' } },
                            { y: jsonData['r3'], borderColor: 'red', label: { text: '3 R', borderColor: 'red' } }
                        ]
                    }
                };
        
                states.push(state);
                const graphContainer = document.createElement('div');
                graphContainer.classList.add("graphContainer");
                tableContainer.appendChild(graphContainer);
            
            }else{
                let dataSeries = [];
                let datesCalc = [];


                let response = await fetch(`${BASE_URL}${PORT}/deviations/reproducibility`,{
                    method:"POST",
                    headers:{ "Content-Type": "application/json"},
                    body:JSON.stringify(dataRows)
                });

                let fetchedData = handleResponse(response);
                for(let k = 0; k < dataRows.length; k++){
                    let actualObject = dataRows[k];
        
                    if(actualObject?.date)
                        datesCalc.push(actualObject.date);
                    if(actualObject?.xi)
                        dataSeries.push(Math.pow(actualObject.xi - fetchedData['x'],2));
                }
        
                
                let state = {
                    series: [{
                        name: "d1_d2",
                        data: dataSeries
                    }],
                    chart: {
                        height: 350,
                        type: 'area',
                        id: 'report-graph'
                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        curve: 'smooth'
                    },
                    xaxis: {
                        type: 'datetime',
                        categories: datesCalc
                    },
                    tooltip: {
                        x: {
                            format: 'dd/MM/yy HH:mm'
                        }
                    },
                    annotations: {
                        yaxis: [
                            {
                              y: fetchedData['r1'],
                              borderColor: 'green',
                              label: {
                                borderColor: 'green',
                                text: '1 DE'
                              }
                            },
                            {
                              y: fetchedData['r2'],
                              borderColor: 'yellow',
                              label: {
                                borderColor: 'yellow',
                                text: '2 DE'
                              }
                            },
                            {
                              y: fetchedData['r3'],
                              borderColor: 'red',
                              label: {
                                borderColor: 'red',
                                text: '3 DE'
                              }
                            },
                            {
                              y: fetchedData['r1Negative'],
                              borderColor: 'green',
                              label: {
                                borderColor: 'green',
                                text: '-1 DE'
                              }
                            },
                            {
                              y: fetchedData['r2Negative'],
                              borderColor: 'yellow',
                              label: {
                                borderColor: 'yellow',
                                text: '-2 DE'
                              }
                            },
                            {
                              y: fetchedData['r3Negative'],
                              borderColor: 'red',
                              label: {
                                borderColor: 'red',
                                text: '-3 DE'
                              }
                            }
                          ]
                    }
                };
        
                states.push(state);
                const graphContainer = document.createElement('div');
                graphContainer.classList.add("graphContainer");
                tableContainer.appendChild(graphContainer);
            }
            
        }
        
        return { printableTable: tableContainer, states: states };
    }
    
    const handlePrintTable = async (e, dataRows, columnHeaders) => {
        const { printableTable, states } = await generatePrintableTable(dataRows, columnHeaders);
    
        document.body.appendChild(printableTable);
    
        let containers = document.querySelectorAll(".graphContainer");
        for(let i = 0; i < containers.length; i++) {
            let chart = new ApexCharts(containers[i], states[i]);
            chart.render(); // Render the chart after creating it
        }
    
        window.print();
    
        document.body.removeChild(printableTable);
    }
    
    
    const handleDownloadExcel = async (e) => {
        let columnHeaders = formData['method'] === "repeatability" ? columnsRepeatability : columnsReproducibility;
        let states = [];
    
    
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(formData['method'] === "repeatability" ? "Repetibilidad" : "Reproducibilidad");
    
        for (let i = 0; i < methodFetchedData.length; i++) {
            let dataRows = methodFetchedData[i]['fragments_data'];
            let fieldNames = Object.keys(methodFetchedData[i]['headers_data']);
    
            fieldNames.forEach(fieldName => {
                if (translateDict.current[fieldName]) {
                    const header = translateDict.current[fieldName].name;
                    let value = methodFetchedData[i]['headers_data'][fieldName];
    
                    if (translateDict.current[fieldName].isId) {
                        const data = translateDict.current[fieldName].data;
                        for (let j = 0; j < data.length; j++) {
                            if (parseInt(data[j].value) === parseInt(value)) {
                                value = data[j].text;
                                break;
                            }
                        }
                    }
    
                    if (fieldName === "temperature_value") {
                        value += `° ${methodFetchedData[i]['headers_data']["temperature_type"]}`;
                    }
    
                    worksheet.addRow([header, value]);
                }
            });
    
            const keys = columnHeaders.map(header => header.name);
            worksheet.addRow([]); 
            worksheet.addRow(keys); 
    
            Object.keys(dataRows).forEach(key => {
                const rowData = keys.map(headerKey => dataRows[key][headerKey]);
                worksheet.addRow(rowData); 
            });
    
            worksheet.addRow([]);
    
            let chartDataURI;
            const graphContainer = document.createElement('div');
            document.body.appendChild(graphContainer);
            let state;
    
            if (formData['method'] === "repeatability") {
                let dataSeries = [];
                let datesCalc = [];
    
                for (let k = 0; k < dataRows.length; k++) {
                    let actualObject = dataRows[k];
                    if (actualObject?.date)
                        datesCalc.push(actualObject.date);
                    if (actualObject?.d1 && actualObject?.d2)
                        dataSeries.push(Math.pow(actualObject.d1 - actualObject.d2, 2));
                }
    
                let nArray = [];
                let differenceArray = [];
    
                for (let l = 0; l < dataRows.length; l++) {
                    let data_object = dataRows[l];
                    nArray.push(data_object["n"]);
                    differenceArray.push(data_object["d1"] - data_object["d2"]);
                }
    
                let body = {
                    "totalNSum": nArray.length,
                    "differenceArray": differenceArray,
                }
    
                let response = await fetch(`${BASE_URL}${PORT}/deviations`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });
    
                let jsonData = await handleResponse(response);
    
                state = {
                    series: [{
                        name: "d1_d2",
                        data: dataSeries
                    }],
                    chart: {
                        height: 350,
                        type: 'area',
                        id: 'report-graph'
                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        curve: 'smooth'
                    },
                    xaxis: {
                        type: 'datetime',
                        categories: datesCalc
                    },
                    tooltip: {
                        x: {
                            format: 'dd/MM/yy HH:mm'
                        }
                    },
                    annotations: {
                        yaxis: [
                            { y: jsonData['r1'], borderColor: 'green', label: { text: '1 R', borderColor: 'green' } },
                            { y: jsonData['r2'], borderColor: 'yellow', label: { text: '2 R', borderColor: 'yellow' } },
                            { y: jsonData['r3'], borderColor: 'red', label: { text: '3 R', borderColor: 'red' } }
                        ]
                    }
                };
            } else {
                let dataSeries = [];
                let datesCalc = [];
    
                let response = await fetch(`${BASE_URL}${PORT}/deviations/reproducibility`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dataRows)
                });
    
                let fetchedData = await handleResponse(response);
    
                for (let k = 0; k < dataRows.length; k++) {
                    let actualObject = dataRows[k];
                    if (actualObject?.date)
                        datesCalc.push(actualObject.date);
                    if (actualObject?.xi)
                        dataSeries.push(Math.pow(actualObject.xi - fetchedData['x'], 2));
                }
    
                state = {
                    series: [{
                        name: "d1_d2",
                        data: dataSeries
                    }],
                    chart: {
                        height: 350,
                        type: 'area',
                        id: 'report-graph'
                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        curve: 'smooth'
                    },
                    xaxis: {
                        type: 'datetime',
                        categories: datesCalc
                    },
                    tooltip: {
                        x: {
                            format: 'dd/MM/yy HH:mm'
                        }
                    },
                    annotations: {
                        yaxis: [
                            {
                              y: fetchedData['r1'],
                              borderColor: 'green',
                              label: {
                                borderColor: 'green',
                                text: '1 DE'
                              }
                            },
                            {
                              y: fetchedData['r2'],
                              borderColor: 'yellow',
                              label: {
                                borderColor: 'yellow',
                                text: '2 DE'
                              }
                            },
                            {
                              y: fetchedData['r3'],
                              borderColor: 'red',
                              label: {
                                borderColor: 'red',
                                text: '3 DE'
                              }
                            },
                            {
                              y: fetchedData['r1Negative'],
                              borderColor: 'green',
                              label: {
                                borderColor: 'green',
                                text: '-1 DE'
                              }
                            },
                            {
                              y: fetchedData['r2Negative'],
                              borderColor: 'yellow',
                              label: {
                                borderColor: 'yellow',
                                text: '-2 DE'
                              }
                            },
                            {
                              y: fetchedData['r3Negative'],
                              borderColor: 'red',
                              label: {
                                borderColor: 'red',
                                text: '-3 DE'
                              }
                            }
                          ]
                    }
                };
            }
    
            let chart = new ApexCharts(graphContainer, state);
            await chart.render();
            chartDataURI = await chart.dataURI();
    
            const base64Data = chartDataURI.imgURI.split(',')[1];
            const imageBuffer = Buffer.from(base64Data, 'base64');
            const imageId = workbook.addImage({
                buffer: imageBuffer,
                extension: 'png',
            });
    
            worksheet.addImage(imageId, {
                tl: { col: 0, row: worksheet.rowCount + 2 },
                ext: { width: 1000, height: 400 },
            });

            for(let i = 0;i < Math.max(dataRows.length,20);i++){
                worksheet.addRow([]);
            }
    
            document.body.removeChild(graphContainer);
        }   
    
        // Descargar el archivo Excel
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
    
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = `${formData['method'] === "repeatability" ? "Repetibilidad" : "Reproducibilidad"}.xlsx`;
    
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        });
    };
    

    useEffect(() => {
        requestDeterminationsData();
    },[])

    return(
        <section className="TableContainer">
            <form className="side-form report-side-form">
                <div className={`container-Input-placeholder ${formDataErrors.determination_id ? 'error' : ''}`}>
                    <ComponentSvg/>
                    <div className="custom-select-wrapper">
                        <CustomSelect customClassName={"capitalize-text"} onChange={handleFormFieldChange} name="determination_id" placeholder={"Determinación"} searchable={true} noResults={"Sin Opciones"} noOPtions={"Sin Opciones"} data={determinationData} placeholderSearchBar={"Buscar.."}/>
                    </div>
                </div>
                <div className={`container-Input-placeholder ${formDataErrors.method ? 'error' : ''}`}>
                    <ComponentSvg/>
                    <div className="custom-select-wrapper">
                        <CustomSelect customClassName={"capitalize-text"} onChange={handleFormFieldChange} name="method" placeholder={"Método"} searchable={false} noResults={"Sin Opciones"} noOPtions={"Sin Opciones"} data={ methodData.current } placeholderSearchBar={"Buscar.."}/>
                    </div>
                </div>

                <CustomCalendar formData={formData} onChange={ handleFormFieldChange } name={"date"}/>
                
                
                <div className="flex-container flex-column">
                    <input type="button" className="extra-width blue-border small-height" id="form-action-button" onClick={handleGetData} value="Enviar"/>
                    <input type="button" className="extra-width blue-border " id="form-action-button" onClick={handleDownloadExcel} value="Descargar Excel"/>
                    <input type="button" className="extra-width blue-border " id="form-action-button" onClick={handlePrintTable} value="Imprimir"/>
                </div>
            </form>
            <ReportDataContainer translateDict={translateDict} methodFetchedData={methodFetchedData} columns={formData['method'] === "repeatability" ? columnsRepeatability : columnsReproducibility} data={data} dates={dates} actualPage={actualPage}/>
            {
                methodFetchedData.length > 0 && <PaginationComponent actualPage={ actualPage } setActualPage={ handlePageChange } maximumDataAmount={ methodFetchedData.length }/>
            }
        </section>
    )
}
export default Report;