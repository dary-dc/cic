import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { Table } from './table_components/Table'
import { firePopup } from './alert_components/Alert/CustomAlert';

export const ReportDataContainer = ({translateDict,methodFetchedData,columns,data,dates,actualPage}) => {

    let state = {
        series: [{
            name: "d1_d2",
            data: data[actualPage]
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
                categories: dates[actualPage]
            },
            tooltip: {
                x: {
                    format: 'dd/MM/yy HH:mm'
                },
            },
        },
    };

    const handleGetDetails = (e) => {
        let actualObjectData = methodFetchedData[actualPage];
        let fieldNames = Object.keys(actualObjectData['headers_data']);
        let html = '<div style="display:flex;flex-direction:column;gap:1vw;min-width: 20vw;justify-content: center;align-items: center;">';

        fieldNames.forEach((fieldName) => {
            if (translateDict.current[fieldName]){
                
                let finalName = translateDict.current[fieldName]['name'];
                let finalValue = actualObjectData['headers_data'][fieldName];

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
                    finalValue += `° ${actualObjectData['headers_data']["temperature_type"]}`;
                }

                html += `
                <div style="width:100%;display:grid;grid-template-columns:45% 45%;">
                    <span style='color:#7066e0'>${finalName}</span>
                    <span>${finalValue}</span>
                </div>`;

            }
        });

        html += '</div>';
        
        console.log(html,fieldNames)
        firePopup({ html : html,title: "Info",isHtmlComponent:false})
    }

    return (
    <div className="short-margin-top container-data">
        {
            methodFetchedData.length === 0 ? 
                <div className="no-data-container">
                    No hay datos por el momento
                    <img className="no-data-png" src={require("../resources/no-data.png")} alt="Loading..." /> 
                </div> 
                : 
                <>
                    <div className="tables-details">
                        <input type="button" className="extra-width blue-border small-height" id="form-action-button" onClick={handleGetDetails} value="Ver detalles"/>
                    </div>
                    <div className="report-container">
                        <Table tableTitle={"Reportes"} columns={ columns } data={ methodFetchedData[actualPage]['fragments_data'] } />
                        
                        <div className="visible report-graph">
                            <ReactApexChart options={ state.options } series={ state.series } type="area" height={350} />
                        </div>                    
                    </div>
                </>
        }
    </div>
  )
}
