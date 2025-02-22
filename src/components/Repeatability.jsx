import "../style-sheets/Repeatability.css"
import { useContext, useEffect, useRef, useState } from "react";
import { ApiContext } from "./ApiContext.jsx";
import { Table } from "./table_components/Table";
import { N } from "./svg_components/NSvg";
import { D1D2 } from "./svg_components/D1D2Svg";
import { D1AndD2 } from "./svg_components/D1AndD2Svg";
import { DateSvg } from "./svg_components/DateSvg";
import { About1Svg } from "./svg_components/About1Svg.jsx";
import { TrashSvg } from "./svg_components/TrashSvg.jsx";
import { EditSvg } from "./svg_components/EditSvg.jsx";
import { AddSvg } from "./svg_components/AddSvg.jsx";
import { CancelSvg } from "./svg_components/CancelSvg"
import { SaveSvg } from "./svg_components/SaveSvg.jsx";
import { getCookie, getPreviousMonthDate, handleResponse } from "../utils/utils.js";
import ReactApexChart from "react-apexcharts";
import { TableHeaders } from "./TableHeaders.jsx";
import { closePopup, firePopup, fireToast } from "./alert_components/Alert/CustomAlert.jsx";


const Repeatability = () => {
    const { BASE_URL,PORT } = useContext(ApiContext);

    const [determinationData,setDeterminationData] = useState([]);
    const [institutionsData,setInstitutionsData] = useState([]);
    const [controllersData,setControllersData] = useState([]);
    const [fragmentsDataRepeatability,setFragmentsDataRepeatability] = useState({});

    const [formData,setFormData] = useState({
        "institution_id" : getCookie("institution_id"),
        "repeatability_id"  : -1,
        "header_id" : -1,
        "equipment_name" : "",
        "remaining_modifications" : 2,
        "analytic_method_name" : "",
        "analytic_technique_name" : "",
        "controller_concentration" : "",
        "temperature_value" : "",
        "controller_id" : "",
        "controller_commercial_brand" : "",
        "is_commercial_serum" : false
    })

    const [formDataErrors,setFormDataErrors] = useState({
        "equipment_name" : false,
        "analytic_method_name" : false,
        "analytic_technique_name" : false,
        "controller_concentration" : false,
        "temperature_value" : false,
        "controller_id" : false,
        "controller_commercial_brand" : false,
    })

    const [dataRows,setDataRows] = useState([]);
    const [dataRowsPreviousMonth,setDataRowsPreviousMonth] = useState([]);
    const [isZeroMonth,setIsZeroMonth] = useState(false);

    const[dates,setDates] = useState([]);
    const[dataSeries,setDataSeries] = useState([]);
    const[deviations,setDeviations] = useState({});

    var formFieldsObject = {};
    var remainingModifications = 2;
    var rowsObject = useRef({});
    var buttons = useRef(null);

    const requestDeterminationsData = async () => {
        let response = await fetch(`${BASE_URL}${PORT}/determinations`);
        setDeterminationData(await handleResponse(response));
        
        response = await fetch(`${BASE_URL}${PORT}/controllers`);
        setControllersData(await handleResponse(response));
        
    }
    
    const isLastFragmentFull = (data) => {
        let dataKeys = Object.keys(data)
        let lastPosition = dataKeys[dataKeys.length - 1]
        let lastFragment = data[lastPosition]; 

        let isAnyElementEmpty = Object.values(lastFragment).filter(d => d.length === 0).length === 0;

        return isAnyElementEmpty;
    }

    const handleTableChange = (e,data) => {
        if(isLastFragmentFull(data))
            rowsObject.current = data;
    }

    useEffect(() => {
        requestDeterminationsData();
    },[])

    const getRepeatabilityData = async (e) => {
        const actualDate = new Date();
        const previousDate = getPreviousMonthDate()

        let html = <img className="baby_bottle" width="150px" height="150px" src={require("../resources/test_tube.gif")} alt="Loading..." />      
        
        firePopup({ html : html,showConfirmButton:false,isHtmlComponent:true})
        
        let body = {
            repeatability_date: `${previousDate.getFullYear()}-${ previousDate.getMonth() + 1 }-1`,
            determination_id : e.target.value
        }

        let response = await fetch(`${BASE_URL}${PORT}/repeatability/get`,{
            method:"POST",
            headers:{ "Content-Type": "application/json"},
            body:JSON.stringify(body)
        });
        
        
        let jsonDataPreviousMonth = await handleResponse(response);
        
        if(jsonDataPreviousMonth['header_id'] === -1 && jsonDataPreviousMonth['repeatability_id'] === -1)
            setIsZeroMonth(true);
        else{
            setIsZeroMonth(false);
            handleSetDeviations(jsonDataPreviousMonth['table_fragments']);
        }

        body = {    
            repeatability_date: `${actualDate.getFullYear()}-${actualDate.getMonth() + 1}-1`,
            determination_id : e.target.value
        }

        response = await fetch(`${BASE_URL}${PORT}/repeatability/get`,{
            method:"POST",
            headers:{ "Content-Type": "application/json"},
            body:JSON.stringify(body)
        });
        
        let jsonData = await handleResponse(response);


        jsonData['analytic_method_name'] = jsonData['analytic_method_name'] ?? "";
        jsonData['analytic_technique_name'] = jsonData['analytic_technique_name'] ?? "";
        jsonData['equipment_name'] = jsonData['equipment_name']?? "";
        jsonData['temperature_value'] = jsonData['temperature_value'] ?? "";
        jsonData['controller_id'] = jsonData['controller_id'] ?? "";
        jsonData['remaining_modifications'] = jsonData['remaining_modifications'] ?? 2;
        jsonData['institution_id'] = jsonData['institution_id'] === undefined || jsonData['institution_id'] === "" ? getCookie("institution_id") : jsonData['institution_id'];

        setDataRows(!jsonData['table_fragments'] ? [] : jsonData['table_fragments'].map((d) => {
            d.date = d.date.split("T")[0]
            return d
        }));

        setDataRowsPreviousMonth(!jsonDataPreviousMonth['table_fragments'] ? [] : jsonDataPreviousMonth['table_fragments'].map((d) => {
            d.date = d.date.split("T")[0]
            return d
        }));

        closePopup({minTime : 1000});

        return jsonData;
    }

    const handleFormFieldChange = async (e) => {
        let name = e.target.getAttribute("name");
        let value = !e.target.value.length ? e.target.getAttribute("value") : e.target.value;
        
        setFormData((prevData) => ({...prevData,[name] : value}));
        setFormDataErrors((prevData) => ({...prevData,[name] : value === ""}));

        if(e.target.getAttribute("name") === "determination_id"){
            let data = await getRepeatabilityData(e)
            data[name] = value;

            setFormData(data);
            setFormDataErrors({
                "equipment_name" : false,
                "analytic_method_name" : false,
                "analytic_technique_name" : false,
                "controller_concentration" : false,
                "temperature_value" : false,
                "controller_id" : false,
                "controller_commercial_brand" : false,
            })
        }
    }

    
    const handlePlotData = async (e,data) => {
        let datesTemp = [];
        let dataTemp = [];

        let fetchedData = await handleSetDeviations(dataRowsPreviousMonth);
        let dataF = Object.values(dataRowsPreviousMonth)
        for(let i =0;i < dataF.length;i++){
            let actualObject = dataF[i];

            if(actualObject?.date)
                datesTemp.push(actualObject.date)
            if(actualObject?.d1 && actualObject?.d2)
                dataTemp.push(Math.pow(actualObject.d1 - actualObject.d2,2))
        }

        console.log(dataTemp,fetchedData)
        setDataSeries(dataTemp);
        setDates(datesTemp);
    }

    const handleSetDeviations =  async (data) => {
        let nArray = [];
        let differenceArray = [];

        let keys_data = Object.keys(data);

        for(let i = 0;i < keys_data.length;i++){
            let actual_key = keys_data[i];
            let data_object = data[actual_key];

            nArray.push(data_object["n"]);
            differenceArray.push(data_object["d1"] - data_object["d2"]);            
        }
        let body = {
            "totalNSum":nArray.length,
            "differenceArray":differenceArray,
        }

        let response = await fetch(`${BASE_URL}${PORT}/deviations`,{
            method:"POST",
            headers:{ "Content-Type": "application/json"},
            body:JSON.stringify(body)
        });
        let jsonData = await handleResponse(response);
        setDeviations(jsonData);

        return jsonData
    }


    const handleRowModifications = async (e,type) => {
        if(type === "pre-save"){
            const actualDate = new Date();  
            
            if(formData['remaining_modifications'] === 2){
                let html = `
                    <span>Recuerde que al editar una fila usa sus <span style="color:#7066e0">MODIFICACIONES POSIBLES</span>, solo haga esto cuando sea <span style="color:#7066e0">NECESARIO</span> por un error humano</span>
                `
                const status = await new Promise((resolve) => {

                    firePopup({
                        title: "Advertencia",
                        type:"warning",
                        html: html,
                        showCancelButton: true,
                        cancelButtonText: "Cancelar",
                        didOpen: () => console.log("Popup abierto"),
                        onCanceled: () => resolve("canceled"),
                        onAccepted: () => resolve("accepted"),
                    });
    
                });

                
                if(status === "canceled") return false; 
            }
            
            let body = {    
                repeatability_date: `${actualDate.getFullYear()}-${actualDate.getMonth() + 1}-1`,
                determination_id : formData['determination_id']
            }
    
            let response = await fetch(`${BASE_URL}${PORT}/repeatability/remaining-modifications`,{
                method:"POST",
                headers:{ "Content-Type": "application/json"},
                body:JSON.stringify(body)
            });

            let jsonData = await handleResponse( response );
            
            remainingModifications = jsonData['remaining_modifications'];

            return true;
        }

        if(type == "post-save" || type == "post-add"){
            let formDataTemp = {};
            Object.assign(formDataTemp,formData);
            formDataTemp['remaining_modifications'] = remainingModifications;
            
            setFormData(formDataTemp);
            setFragmentsDataRepeatability(rowsObject.current);
        }
    }

    const handleSubmitFormData = async (e) => {
        let html = <img className="baby_bottle" width="150px" height="150px" src={require("../resources/test_tube.gif")} alt="Loading..." />      
        let html2 = <span><span style={{color:"#7066e0"}}>RECUERDE</span> que no puede dejar ningún <span style={{color:"#7066e0"}}>CAMPO VACÍO</span></span>

        let canContinue = true;

        let tableFragments = [];
        let keysFragments = Object.keys(fragmentsDataRepeatability);
        for(let i = 0; i < keysFragments.length;i++){
            let row = keysFragments[i];
            let keysActualObject = Object.keys(fragmentsDataRepeatability[row]);

            let canPush = true;
            for(let g = 0;g < keysActualObject.length;g++){
                if(fragmentsDataRepeatability[row][keysActualObject[g]] === "")
                    canPush = false
            }

            if(canPush){
                tableFragments.push(fragmentsDataRepeatability[row]);
            }
        } 
        const actualDate = new Date();

        formFieldsObject = formData;

        formFieldsObject["header_id"] = formData["header_id"] ?? -1;
        formFieldsObject["repeatability_id"] = formData["repeatability_id"] ?? -1;
        formFieldsObject["repeatability_date"] = `${actualDate.getFullYear()}-${actualDate.getMonth() + 1}-1`;

        let keysFormField = Object.keys(formFieldsObject);
        let tempErrors = {};
        Object.assign(tempErrors,formDataErrors);

        for(let i = 0;i < keysFormField.length;i++){
            if(formFieldsObject[keysFormField[i]] === ""){
                tempErrors[keysFormField[i]] = true;
                canContinue = false;
            }else{
                tempErrors[keysFormField[i]] = false;
            }
        }

        setFormDataErrors(tempErrors);

        if(!canContinue){
            firePopup({ html : html2,type:"warning",title: "Advertencia",isHtmlComponent:true})
            return;
        }

        firePopup({ html : html,showConfirmButton:false,isHtmlComponent:true})

        let body = {
            "formHeaders":formFieldsObject,
            "tableFragments":tableFragments
        }

        let response = await fetch(`${BASE_URL}${PORT}/repeatability`,{
            method:"POST",
            headers:{ "Content-Type": "application/json"},
            body:JSON.stringify(body)
        });

        let jsonData = await handleResponse(response);

        let formDataTemp = {};
        Object.assign(formDataTemp,formData);

        formDataTemp["header_id"] = jsonData['repeatability_data']['repeatability_id'];
        formDataTemp["repeatability_id"] = jsonData['table_header']['header_id'];

        closePopup({minTime : 1000, onClose : () => {
            if(response.status === 200){
                fireToast({ text: "Datos insertados correctamente", type: "success" });
            }else{
                fireToast({ text: "Datos no insertados, intentelo más tarde", type: "error" });
            }
        }});
        
    }

    // useEffect(() => {
    //     buttons = [
    //         {
    //             name:'add-row',
    //             svgComponent:<AddSvg/>,
    //             action:'add',
    //             callback:async (e,type) => { return await handleRowModifications(e,type) }
    //         },  
            
    //         {
    //             name:'delete-row',
    //             svgComponent:<TrashSvg/>            ,
    //             action:'delete',
    //             callback:(e,type) => {console.log(e)}
    //         },
    //     ]  
    // },[])

    useEffect(() => {
        buttons.current = [
            {
                name:'add-row',
                svgComponent:<AddSvg/>,
                action:'add',
                callback:async (e,type) => { return await handleRowModifications(e,type) }
            },  
            
            {
                name:'delete-row',
                svgComponent:<TrashSvg/>            ,
                action:'delete',
                callback:(e,type) => {console.log(e)}
            },  
        ];
        
        if(!isZeroMonth && formData['determination_id']){
            buttons.current.push({
                name:'plot-data',
                svgComponent:<About1Svg/>,
                action:'custom',
                callback:(e,data) => { handlePlotData(e,data) }
            })
        }else{
            buttons.current = buttons.current.filter(d => d.name !== "plot-data");
        }
    
        if(parseInt(formData['remaining_modifications']) ?? false){
             
            buttons.current.push({
                name:'edit-row',
                svgComponent:<EditSvg/>,
                secondSvgComponent:<SaveSvg/>,
                thirdSvgComponent:<CancelSvg/>,
                action:'edit',
                callback: async (e,type) =>  { return await handleRowModifications(e,type) }
            }); 
        }else{
            buttons.current = buttons.current.filter(d => d.name !== "edit-row");
        }
    },[isZeroMonth])

    let columns = [{
        name:'n',
        label:'N',
        svgComponent:<N/>,
        options:{
            handleChange:handleTableChange,
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
            handleChange:handleTableChange,
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
        options:{
            handleChange:handleTableChange,
            validator:"only-numbers"
        }
    },
    {
        name:'d2',
        label:
            <span>d
                <sub>2</sub>
            </span>,
        svgComponent:<D1D2/>,
        options:{
            handleChange:handleTableChange,
            validator:"only-numbers"
        }
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

    let state = {
          
        series: [{
          name: "d1_d2",
          data: dataSeries
        }],


        options: {
          chart: {
            height: 350,
            type: 'area',
            id: 'report-graph',
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'smooth'
          },
          xaxis: {
            type: 'datetime',
            categories: dates
          },
          tooltip: {
            x: {
              format: 'dd/MM/yy HH:mm'
            },
          },
          annotations: {
            position: 'front',
            yaxis: [
              {
                y: deviations['r1'],
                borderColor: 'green',
                label: {
                  borderColor: 'green',
                  text: '1 R'
                }
              },
              {
                y: deviations['r2'],
                borderColor: 'yellow',
                label: {
                  borderColor: 'yellow',
                  text: '2 R'
                }
              },
              {
                y: deviations['r3'],
                borderColor: 'red',
                label: {
                  borderColor: 'red',
                  text: '3 R'
                }
              }
            ]
        }
        },
      
      
      };


    return (
        <section className="TableContainer">
            <TableHeaders tableTitle={"Repetibilidad"} dataRows={dataRows} columnHeaders={columns} handleFormFieldChange={handleFormFieldChange} controllersData={controllersData} institutionsData={institutionsData} determinationData={determinationData} formDataErrors={formDataErrors} formData={formData} setInstitutionsData={setInstitutionsData} setControllersData={setControllersData} setDeterminationData={setDeterminationData} handleSubmitFormData={handleSubmitFormData}  />
            <div className="left-alignment short-margin-top container">
                <div className="short-margin-left current-date">{new Date().toLocaleDateString("es-MX",{ weekday:'long', day:'numeric', month:'long', year:'numeric' })}</div>
                <Table tableTitle={"Repetibilidad"} columns={columns} data={dataRows} buttons={buttons.current} />
            </div>
            <div className={`${dataSeries.length ? 'visible' : ''} report-graph`} >
                <ReactApexChart options={state.options} series={state.series} type="area" height={350} />
            </div>
        </section>
    );
}
export default Repeatability;