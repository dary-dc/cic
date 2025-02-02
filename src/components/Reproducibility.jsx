import "../style-sheets/Reproducibility.css"
import { useContext, useEffect, useRef, useState} from "react";
import { N } from "./svg_components/NSvg";
import { D1D2 } from "./svg_components/D1D2Svg";
import { D1AndD2 } from "./svg_components/D1AndD2Svg";
import { DateSvg } from "./svg_components/DateSvg";
import { v4 as uuid } from "uuid"
import { Table } from "./table_components/Table";
import { About1Svg } from "./svg_components/About1Svg";
import { AddSvg } from "./svg_components/AddSvg";
import { SaveSvg } from "./svg_components/SaveSvg";
import { EditSvg } from "./svg_components/EditSvg";
import { TrashSvg } from "./svg_components/TrashSvg";
import { ApiContext } from "./ApiContext";
import { getCookie, getPreviousMonthDate,handleResponse } from "../utils/utils";
import { CancelSvg } from "./svg_components/CancelSvg"
import ReactApexChart from "react-apexcharts";
import { TableHeaders } from "./TableHeaders";
import { closePopup, firePopup, fireToast } from "./alert_components/Alert/CustomAlert";


const Reproducibility = () => {
    const { BASE_URL,PORT } = useContext(ApiContext);
    const [days,setDays] = useState([]); 
    const [determinationData,setDeterminationData] = useState([]);
    const [controllersData,setControllersData] = useState([]);
    const [fragmentsDataReproducibility,setFragmentsDataReproducibility] = useState([]);

    const [formData,setFormData] = useState({
        "institution_id" : getCookie("institution_id"),
        "reproducibility_id"  : "",
        "header_id" : "",
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
    const [isDeterminationDayFulfilled,setIsDeterminationDayFulfilled] = useState(false);

    const[dates,setDates] = useState([]);
    const[data,setData] = useState([]);
    const[deviations,setDeviations] = useState({});
    var remainingModifications = 2;

    var formFieldsObject = {};
    var rowsObject = useRef ({});
    var buttons = useRef (null);

    const requestDeterminationsData = async () => {
        let response = await fetch(`${BASE_URL}${PORT}/reproducibility/determinations`);
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
        generateInitialDays();
    },[])

    const generateInitialDays = async () => {
        setDays(await generateDays(1,22,"forward"))
    }

    const getReproducibilityData = async (e) => {
        const actualDate = new Date();

        let html = <img className="baby_bottle" width="150px" height="150px" src={require("../resources/test_tube.gif")} alt="Loading..." />      
        
        firePopup({ html : html,showConfirmButton:false,isHtmlComponent:true})
        
        let body = {
            reproducibility_date: `${actualDate.getFullYear()}-${ getPreviousMonthDate().getMonth() + 1 }-1`,
            determination_id : e.target.value
        }

        let response = await fetch(`${BASE_URL}${PORT}/reproducibility/get`,{
            method:"POST",
            headers:{ "Content-Type": "application/json"},
            body:JSON.stringify(body)
        });
        
        
        let jsonDataPreviousMonth = await handleResponse(response);
        

        if(jsonDataPreviousMonth['header_id'] === -1 && jsonDataPreviousMonth['reproducibility_id'] === -1)
            setIsZeroMonth(true);
        else{
            setIsZeroMonth(false);
            await handleSetDeviations(jsonDataPreviousMonth['table_fragments']);
        }

        body = {    
            reproducibility_date: `${actualDate.getFullYear()}-${actualDate.getMonth() + 1}-1`,
            determination_id : e.target.value
        }

        response = await fetch(`${BASE_URL}${PORT}/reproducibility/get`,{
            method:"POST",
            headers:{ "Content-Type": "application/json"},
            body:JSON.stringify(body)
        });
        
        let jsonData = await handleResponse(response);

        jsonData['equipment_name'] = jsonData['equipment_name'] === undefined ? "" : jsonData['equipment_name'];
        jsonData['analytic_method_name'] = jsonData['analytic_method_name'] === undefined ? "" : jsonData['analytic_method_name'];
        jsonData['analytic_technique_name'] = jsonData['analytic_technique_name'] === undefined ? "" : jsonData['analytic_technique_name'];
        jsonData['equipment_name'] = jsonData['equipment_name'] === undefined ? "" : jsonData['equipment_name'];
        jsonData['temperature_value'] = jsonData['temperature_value'] === undefined ? "" : jsonData['temperature_value'];
        jsonData['controller_id'] = jsonData['controller_id'] === undefined ? "" : jsonData['controller_id'];
        jsonData['institution_id'] = jsonData['institution_id'] === undefined || jsonData['institution_id'] === "" ? getCookie("institution_id") : jsonData['institution_id'];

        setDataRows(!jsonData['table_fragments'] ? [] : jsonData['table_fragments'].map((d) => {
            d.date = d.date.split("T")[0]
            return d
        }));

        setDataRowsPreviousMonth(!jsonDataPreviousMonth['table_fragments'] ? [] : jsonDataPreviousMonth['table_fragments'].map((d) => {
            d.date = d.date.split("T")[0]
            return d
        }));

        if(jsonData?.['table_fragments']){
            jsonData['table_fragments'].forEach(d => {
                if(d['date'] === new Date().toISOString().split("T")[0]){
                    setIsDeterminationDayFulfilled(true);
                }
            })
        }
        
        closePopup({minTime : 1000});
        return jsonData;
        
    }

    const handleFormFieldChange = async (e) => {
        let name = e.target.getAttribute("name");
        let value = !e.target.value.length ? e.target.getAttribute("value") : e.target.value;
        
        setFormData((prevData) => ({...prevData,[name] : value}));
        setFormDataErrors((prevData) => ({...prevData,[name] : value === ""}));

        if(e.target.getAttribute("name") === "determination_id"){
            let data = await getReproducibilityData(e)
            data[name] = value;

            
            setFormDataErrors({
                "equipment_name" : false,
                "analytic_method_name" : false,
                "analytic_technique_name" : false,
                "controller_concentration" : false,
                "temperature_value" : false,
                "controller_id" : false,
                "controller_commercial_brand" : false,
            })
            setFormData(data);
            setDays(await generateDays(1,22,"forward",data['determination_id']));
        }

    }

    const generateDays = async (init,end,arrow,determination_id) => {
        let objectDate = new Date();
        let actualDay = objectDate.getDate()
        let temp = [];

        let body = {
            start_date: new Date(objectDate.getFullYear(), objectDate.getMonth(), 1),
            end_date: new Date(objectDate.getFullYear(), objectDate.getMonth() + 1, 0),
            determination_id : determination_id ?? formData['determination_id']
        }

        let response = await fetch(`${BASE_URL}${PORT}/reproducibility/get-month-range`,{
            method:"POST",
            headers:{ "Content-Type": "application/json"},
            body:JSON.stringify(body)
        });

        let daysMap = await handleResponse(response);

        for(let i = init;i <= end;i++){
            let classNameDay = "day-container";
            
            if(i === actualDay)
                classNameDay += " active-day";
            else if(i < actualDay && daysMap.hasOwnProperty(i) && !daysMap[i])
                classNameDay += " not-worked-day";
            
            temp.push(
                <div key={uuid()} className={ classNameDay }>
                    {i}
                </div>
            );
        }
        switch(arrow){
            case "forward":
                temp.push(
                    <div key={uuid()} className="steps-forward" onClick={handleStepsForward}>
                        <p>{'>'}</p>
                    </div>
                );      
                break;
            case "backward":
                temp.unshift(
                    <div key={uuid()} className="steps-backward" onClick={handleStepsBackward}>
                        <p>{'<'}</p>
                    </div>
                );
                break;
            default:
                break;
        }

        return temp;
    }
    
    const handleStepsBackward = async () =>{
        setDays(await generateDays(1,22,"forward"));
    }

    const handleStepsForward = async (e) => {
        let objectDate = new Date();
        setDays(await generateDays(22,new Date(objectDate.getFullYear(), objectDate.getMonth() + 1 + 1, 0).getDate(),"backward"));
    }

    
    const handlePlotData = async (e,data) => {
        let datesTemp = [];
        let dataTemp = [];

        let fetchedData = await handleSetDeviations(dataRowsPreviousMonth);
        for(let i = 0;i < dataRowsPreviousMonth.length;i++){
            let actualObject = dataRowsPreviousMonth[i];

            if(actualObject?.date)
                datesTemp.push(actualObject.date)
            if(actualObject?.xi)
                dataTemp.push(Math.pow(actualObject.xi - fetchedData['x'],2));
        }

        setData(dataTemp);
        setDates(datesTemp);
    }

    const handleSetDeviations =  async (data) => {
        let body = data;

        let response = await fetch(`${BASE_URL}${PORT}/deviations/reproducibility`,{
            method:"POST",
            headers:{ "Content-Type": "application/json"},
            body:JSON.stringify(body)
        });
        let jsonData = await handleResponse(response);
        setDeviations(jsonData);
        
        return jsonData
    }

    const handleEditRow = async (e,type) => {
        setIsDeterminationDayFulfilled(true);   

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
                        onCanceled: () => resolve("canceled"), // Resolve promise with "canceled"
                        onAccepted: () => resolve("accepted"), // Resolve promise with "accepted"
                    });
    
                });

                
                if(status === "canceled") return false; 
            }
            
            let body = {    
                reproducibility_date: `${actualDate.getFullYear()}-${actualDate.getMonth() + 1}-1`,
                determination_id : formData['determination_id']
            }
    
            let response = await fetch(`${BASE_URL}${PORT}/reproducibility/remaining-modifications`,{
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
            setFragmentsDataReproducibility(rowsObject.current);
        }
        if(type == "pre-add") return true;
    }

    const handleSubmitFormData = async (e) => {
        let html = <img className="baby_bottle" width="150px" height="150px" src={require("../resources/test_tube.gif")} alt="Loading..." />      
        let html2 = <span><span style={{color:"#7066e0"}}>RECUERDE</span> que no puede dejar ningún <span style={{color:"#7066e0"}}>CAMPO VACÍO</span></span>

        let canContinue = true;

        let tableFragments = [];
        let keysFragments = Object.keys(fragmentsDataReproducibility);
        for(let i = 0; i < keysFragments.length;i++){
            let row = keysFragments[i];
            let keysActualObject = Object.keys(fragmentsDataReproducibility[row]);

            let canPush = true;
            for(let g = 0;g < keysActualObject.length;g++){
                if(fragmentsDataReproducibility[row][keysActualObject[g]] === "")
                    canPush = false
            }

            if(canPush){
                tableFragments.push(fragmentsDataReproducibility[row]);
            }
        } 
        const actualDate = new Date();

        formFieldsObject = formData;

        formFieldsObject["header_id"] = formData["header_id"] ?? -1;
        formFieldsObject["reproducibility_id"] = formData["reproducibility_id"] ?? -1;
        formFieldsObject["reproducibility_date"] = `${actualDate.getFullYear()}-${actualDate.getMonth() + 1}-1`;

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

        let response = await fetch(`${BASE_URL}${PORT}/reproducibility`,{
            method:"POST",
            headers:{ "Content-Type": "application/json"},
            body:JSON.stringify(body)
        });

        let jsonData = await handleResponse(response);

        let formDataTemp = {};
        Object.assign(formDataTemp,formData);

        formDataTemp["header_id"] = jsonData['reproducibility_data']['reproducibility_id'];
        formDataTemp["reproducibility_id"] = jsonData['table_header']['header_id'];

        closePopup({minTime : 1000, onClose : () => {
            if(response.status === 200){
                fireToast({ text: "Datos insertados correctamente", type: "success" });
            }else{
                fireToast({ text: "Datos no insertados, intentelo más tarde", type: "error" });
            }
        }});

        if(tableFragments) setDays(await generateDays(1,22,"forward"))
        
    }

    useEffect(() => {
        buttons.current = [    
            {
                name:'edit-row',
                svgComponent:<EditSvg/>,
                secondSvgComponent:<SaveSvg/>,
                thirdSvgComponent:<CancelSvg/>,
                action:'edit',
                callback:async (e,type) => { return await handleEditRow(e,type)}
            },  
            
            {
                name:'delete-row',
                svgComponent:<TrashSvg/>            ,
                action:'delete',
                callback:(e,type) => {console.log(e)}
            },  
        ];
    
        if(!isDeterminationDayFulfilled){
            buttons.current.push({
                name:'add-row',
                svgComponent:<AddSvg/>,
                action:'add',
                callback:async (e,type) => { return await handleEditRow(e,type) }
            })
        }else{
            buttons.current = buttons.current.filter(d => d.name !== "add-row");
        }
    
        if(!isZeroMonth){
            buttons.current.push({
                name:'plot-data',
                svgComponent:<About1Svg/>,
                action:'custom',
                callback:(e,data) => { handlePlotData(e,data) }
            })
        }
    },[isZeroMonth,isDeterminationDayFulfilled])

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
            name:'xi',
            label:
                <sub>(Xi)</sub>,
            svgComponent:<D1D2/>,
            options:{
                handleChange:handleTableChange,
                totalizer:"total",
                validator:"only-numbers",
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
                    equation:'xi - (xis / nt)',
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

    let state = {
          
        series: [{
          name: "xi_x",
          data: data
        }],


        options: {
          chart: {
            height: 350,
            type: 'area'
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
                  text: '1 DE'
                }
              },
              {
                y: deviations['r2'],
                borderColor: 'yellow',
                label: {
                  borderColor: 'yellow',
                  text: '2 DE'
                }
              },
              {
                y: deviations['r3'],
                borderColor: 'red',
                label: {
                  borderColor: 'red',
                  text: '3 DE'
                }
              },
              {
                y: deviations['r1Negative'],
                borderColor: 'green',
                label: {
                  borderColor: 'green',
                  text: '-1 DE'
                }
              },
              {
                y: deviations['r2Negative'],
                borderColor: 'yellow',
                label: {
                  borderColor: 'yellow',
                  text: '-2 DE'
                }
              },
              {
                y: deviations['r3Negative'],
                borderColor: 'red',
                label: {
                  borderColor: 'red',
                  text: '-3 DE'
                }
              }
            ]
        }
        },
      
      
      };

    
    return (
        <section className="TableContainer">
            <TableHeaders tableTitle={"Reproducibilidad"} dataRows={dataRows} columnHeaders={columns} handleFormFieldChange={handleFormFieldChange} controllersData={controllersData} determinationData={determinationData} formDataErrors={formDataErrors} formData={formData} setControllersData={setControllersData} setDeterminationData={setDeterminationData} handleSubmitFormData={handleSubmitFormData}  />
            <div className="left-alignment short-margin-top container">
            <div className="container-steps">
                <div className="current-date">{new Date().toLocaleDateString("es-MX",{ weekday:'long', day:'numeric', month:'long', year:'numeric' })}</div>
                    <div className="days-steps">
                        {
                            days.map((data) => {
                                return data
                            })
                        }
                    </div>
                </div>
                <Table tableTitle={"Reproducibilidad"} columns={columns} data={dataRows} buttons={buttons.current} />
            
                <div className="cv-label">
                    cv: { deviations['cv'] }
                </div>
            </div>
            <div className={`${data?.length ? 'visible' : ''} report-graph`}>
                <ReactApexChart options={state.options} series={state.series} type="area" height={350} />
            </div>
        </section>
    );
}
export default Reproducibility; 