import React, { useContext, useEffect, useState } from 'react';
import { Table } from './table_components/Table';
import { AddSvg } from './svg_components/AddSvg';
import { TrashSvg } from './svg_components/TrashSvg';
import { EditSvg } from './svg_components/EditSvg';
import { SaveSvg } from './svg_components/SaveSvg';
import { CancelSvg } from './svg_components/CancelSvg';
import { ConcentrationSerumSvg } from './svg_components/ConcentrationSerumSvg';
import "../style-sheets/CommercialSerumElaboration.css"
import { ApiContext } from './ApiContext';
import { handleResponse } from '../utils/utils';

export const CommercialSerumElaboration = () => {
	const [dataRows,setDataRows] = useState([]);
	const { BASE_URL,PORT } = useContext(ApiContext);

	const handleEditRow = async (e,type) => {
		if(type === "post-save"){
			let body = {
				data : e.detail.data
			}
	
			let response = await fetch(`${BASE_URL}${PORT}/controllers`,{
				method:"POST",
				headers:{ "Content-Type": "application/json"},
				body:JSON.stringify(body)
			});

			console.log(response)
		}
	}

	const handleDeleteRow = async (e,type) => {
		if(type === "post-delete"){
			let commercial_serum_id = e.detail?.deletedRow?.commercial_serum_id;

			if(commercial_serum_id){
				let response = await fetch(`${BASE_URL}${PORT}/controllers/commercial/${commercial_serum_id}`,{
					method:"DELETE",
					headers:{ "Content-Type": "application/json"},
				});

				console.log(response);
			}
		}
	}

	
	useEffect(() => {
		requestControllersData();
	},[])

	
	const requestControllersData = async () => {
		let response = await fetch(`${BASE_URL}${PORT}/controllers/commercials`);
		let result = await handleResponse(response);

		if(result.length > 0)
			setDataRows(result);
	}

	let buttons = [
		{
			name:'add-row',
			svgComponent:<AddSvg/>,
			action:'add',
			callback:(e,type) => {console.log(e)}
		},  
		
		{
			name:'delete-row',
			svgComponent:<TrashSvg/>            ,
			action:'delete',
			callback:async (e,type) =>  { return await handleDeleteRow(e,type) }
		},  

		{
			name:'edit-row',
			svgComponent:<EditSvg/>,
			secondSvgComponent:<SaveSvg/>,
			thirdSvgComponent:<CancelSvg/>,
			action:'edit',
			callback: async (e,type) =>  { return await handleEditRow(e,type) }
		}
	];
		
	
	let columns = [
		{
			name:'commercial_serum_name',
			label:'Nombre del Suero',
			svgComponent:<ConcentrationSerumSvg/>,
		},
		{
			name:'commercial_brand',
			label:'Marca Comercial',
			svgComponent:<ConcentrationSerumSvg/>,
		},
		{
			name:'concentration',
			label:"Concentración",
			svgComponent:<ConcentrationSerumSvg/>,
		},
	];

	return (
		<div className='commercial-serum-container'>
            <Table tableTitle={"Sueros Comerciales"} columns={columns} data={dataRows} buttons={buttons} />
		</div>
	)
} 
