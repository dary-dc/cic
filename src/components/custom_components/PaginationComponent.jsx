import React, { useEffect, useRef, useState } from 'react'
import { LeftArrowSvg } from '../svg_components/LeftArrowSvg';
import { RightArrowSvg } from '../svg_components/RightArrowSvg';

export const PaginationComponent = ({actualPage,setActualPage,maximumDataAmount}) => {
    const dynamicButtonsContainer = useRef(null);
    const customPageCount = useRef(null);
    const [buttonsValue,setButtonsValue] = useState({
        first:1,
        last:maximumDataAmount
    });
  
    useEffect(() => {
        if(Object.keys(buttonsValue).length === 2){
            let buttonsValueTemp = {};
            Object.assign(buttonsValueTemp,buttonsValue);
    
            let count = 1;
            for(let i = 2;i < maximumDataAmount - 2;i++){
                buttonsValueTemp[count] = i;
                count++
            }
            console.log("buttonsValue",buttonsValueTemp)
            
            setButtonsValue(buttonsValueTemp)
        }
    },[ maximumDataAmount ])

    const handlePagination = (pageNumber) => {
        if(!isNaN(pageNumber)){
            pageNumber = parseInt(pageNumber);
            
            let buttonsValueTemp = {};
            Object.assign(buttonsValueTemp,buttonsValue);
    
            let number = pageNumber; 
            
            //ARRAY STARTS IN 0
            if(pageNumber > maximumDataAmount - 1){
                number = maximumDataAmount - 1;
            }if (pageNumber < 0){
                number = 0
            }   
            
            let page_buttons_container = dynamicButtonsContainer.current
            let quantityToIncrement = 3;
    
            let last_element = page_buttons_container.lastElementChild
    
            // console.log(number , last_element?.value - 1)
            if (number >= last_element?.value - 1){
                let count = 1
                let minimumDistance = maximumDataAmount - quantityToIncrement;
                let actualDistance = maximumDataAmount - number + 1;
    
                let startPoint = actualDistance > minimumDistance ? number + 1 : minimumDistance;
                console.log("startPoint",startPoint,Math.min(parseInt(number) + quantityToIncrement,maximumDataAmount));
                
                // 1 (ALREADY RENDER ) | RANGE (SELECTED NUMBER OR DIFFERENCE BETWEEN MAX AND QUANTITY TO INCREMENT) - PREVIOUS NUMBER + QUANTITY TO INCREMENT | MAX DATA AMOUNT (ALREADY RENDER )
                for(let i = startPoint;i <= Math.min(parseInt(number) + quantityToIncrement,maximumDataAmount);i++){
                    console.log(number,Math.min(parseInt(number) + quantityToIncrement))
    
                    buttonsValueTemp[count] = i
                    buttonsValueTemp[count] = i
                    count++;
                }
            }

            if (number < quantityToIncrement){
                let count = 1
                // 1 (ALREADY RENDER ) | RANGE 2 - 4 | MAX DATA AMOUNT (ALREADY RENDER )
                for(let i = 2;i <= quantityToIncrement + 1;i++){
                    buttonsValueTemp[count] = i
                    buttonsValueTemp[count] = i
                    count++;
                }
            }
            
            setButtonsValue(buttonsValueTemp);
            setActualPage(number);
            console.log("buttonsValueTemp",buttonsValueTemp);

        }

    }

    return (
        <div id='pages-buttons-container'>
        {
            actualPage > 2 && 
            <div className="pagination-button" onClick={ (e) => handlePagination(actualPage - 3) }>
                <LeftArrowSvg/>
                Previo
            </div>    
        }
        <button onClick={ (e) => handlePagination(e.target.value - 1) } className={`page-button-container ${(actualPage + 1) === buttonsValue['first'] ? "active-pagination-button" : ""}`} value={ buttonsValue['first'] }>{ buttonsValue['first'] }</button>
        <div ref={ dynamicButtonsContainer } id='pages-buttons-container-steps'>
            {/* +2 AND -2 BECAUSE YOUR BUTTONS START IN 1 AND YOU GO UNTIL THE ARRAY LENGTH AND MAP INDEX START IN 0 SOO JOINT THE POINTS!! */}
            {
                Array.from({ length: Math.min(Object.keys(buttonsValue).length - 2,3) }, (_, index) => {
                    return <button key={index} onClick={ (e) => handlePagination(e.target.value - 1) } className={`page-button-container ${(actualPage + 1) === buttonsValue[index + 1] ? "active-pagination-button" : ""}`} value={ buttonsValue[index + 1] }>{ buttonsValue[index + 1] }</button>
                })
            }
        </div>
        <button onClick={ (e) => handlePagination(e.target.value - 1) } className={`page-button-container ${ (actualPage + 1) === buttonsValue['last'] ? "active-pagination-button" : "" }`} value={ buttonsValue['last'] }>{ buttonsValue['last'] }</button>
        {
            actualPage + 3 < maximumDataAmount && 
            
            <div className='pagination-button' onClick={ (e) => handlePagination(actualPage + 3) }>
                Siguiente
                <RightArrowSvg/>
            </div>}

        {
            actualPage + 3 < maximumDataAmount &&
         
            <div className="flex-container">
                Ir a página
                <div className="custom-page-button-container">
                    <input type="text" ref={ customPageCount }/>
                    <input type="button" className="blue-border confirm-pagination-button" onClick={(e) => handlePagination( customPageCount.current.value ) } value="Confirmar"/>
                </div>
            </div> 
        }
        
    </div>
  )
}
