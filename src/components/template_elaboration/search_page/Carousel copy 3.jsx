import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import '../../../style-sheets/SampleElaboration/TwoStepForm/Carousel.css';
import CustomCard from "../../custom_components/CustomCard.jsx";
import { QualityControlSvg } from "../../svg_components/QualityControlSvg.jsx";
import TemplateSvg from "../../svg_components/TemplateSvg.jsx";
import { capitalize, getMexicoDate, formatTimestampToDate } from "../../../utils/utils.js";

const SpanishProcesses = {
  "urine control": "orina control",
  "serum control": "suero control",
  "commercial serum": "suero comercial",
}

const Carousel = ({ selectedTemplate, onSampleSelection, cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // const [translationValue, setTranslationValue] = useState(0); // translation goes from 40% to -140%
  const [extendedCards, setExtendedCards] = useState([]);
  const [translationValue, setTranslationValue] = useState(0);
  const [isUsingTransition, setIsUsingTransition] = useState(true);
  const [isMoving, setIsMoving] = useState(false);
  
  const cardNamesRef = useRef(null);
  const extendedCardsRef = useRef(null);
  const newCountRef = useRef(null);
  const enoughCards = useRef(false);
  
  const handleNext = () => {
		// let newIndex = (currentIndex + 1) % cards.length;
    // setCurrentIndex((prevIndex) => (prevIndex + 1) % cardsData.length);
    updateIndex(currentIndex + 1);
  };

  const handlePrev = () => {
		// let newIndex = (currentIndex - 1 + cards.length) % cards.length;
    // setCurrentIndex((prevIndex) => (prevIndex - 1 + cardsData.length) % cardsData.length);
    updateIndex(currentIndex - 1);
  };

	const updateIndex = useCallback((newIndex, isTransitioning=true) => {
    console.log("updateIndex newIndex", newIndex)
    // if (!cards.length > 4) {
    if (!(cards.length > 4)) {
      // newIndex = newIndex < currentIndex ? (currentIndex - 1 + cards.length) % cards.length : (currentIndex + 1) % cards.length
      if (newIndex < 0) {
        newIndex = cards.length - 1
      } else if (newIndex >= cards.length) {
        newIndex = 0
      }
      console.log("updateIndex newIndex after", newIndex)
    }
    setIsUsingTransition(isTransitioning);
    setCurrentIndex(newIndex);
    setTranslationValue(-(newIndex * 20 - 40));
    setIsMoving(isTransitioning);
    // setTranslationValue(-(newIndex * 20));

    onSampleSelection(extendedCardsRef.current[newIndex])
	}, [extendedCardsRef, onSampleSelection, cards.length])

  // makes the carousel infinite and circular
  useEffect(() => {
    // if (enoughCards?.current) {
      let newCount = newCountRef.current
      if (isUsingTransition) {
        const transitionEndHandler = () => {
          setIsMoving(false)
          if (cards.length > 4) {
            if (currentIndex === newCount - 1) {
              updateIndex(cards.length + newCount - 1, false)
            } else if (currentIndex === cards.length + newCount) {
              updateIndex(newCount, false)
            }
          }
          //  else {
          //   if (currentIndex === cards.length - 1) {
          //     updateIndex(0)
          //   } else if (currentIndex === 0) {
          //     updateIndex(cards.length - 1)
          //   }
          // }    
        }
        document.querySelector(".carousel-inner")?.addEventListener("transitionend", transitionEndHandler)
        return () => {
          document.querySelector(".carousel-inner")?.removeEventListener("transitionend", transitionEndHandler)
        }        
      }
  }, [currentIndex, isUsingTransition, cards.length, updateIndex, newCountRef])


  useEffect(() => {
    console.log(cards)
    cardNamesRef.current = cards.map(({name}) => name);

    // if (enoughCards?.current) {
    if (cards.length > 4) {
      extendedCardsRef.current = [
        cards[cards.length - 3],
        cards[cards.length - 2],
        cards[cards.length - 1],
        ...cards,
        cards[0],
        cards[1],
        cards[2],
      ]
    } else {
      extendedCardsRef.current = cards
    }

    newCountRef.current = Math.floor((extendedCardsRef.current.length - cards.length) / 2)
  }, [cards, updateIndex])

  // makes the selected card using the `customSelector` component updates the carousel
  useEffect(() => {
    const extendedCards = extendedCardsRef.current
    let newCount = newCountRef.current
    // if the card selected is distinct
    if (selectedTemplate?.id !== extendedCards.map(({ id }) => id)[currentIndex]) {
      // update the index of the carousel
      let newIndex = cardNamesRef.current.indexOf(selectedTemplate);
      if (newIndex !== -1) {
        updateIndex(newIndex + newCount);
      }
    }
	}, [selectedTemplate, cards, updateIndex, currentIndex])

  
  useEffect(() => {
    if (cards.length > 4) {
      updateIndex(5, false)
      // enoughCards.current = true
    } else {
      updateIndex(0, false)
    }
  }, [])

  console.log("cards", cards)
  console.log("extendedCardsRef.current", extendedCardsRef.current)
  console.log("currentIndex", currentIndex)
  // console.log("isTransitioning", isUsingTransition)
  // console.log("isMoving", isMoving)

  return (
    <div className="carousel">
      {/* <div className="carousel-inner" style={{ transform: `translateX(${-(currentIndex * 20 - 40)}%)` }}> */}
      <div 
        className="carousel-inner" 
        style={{ 
          transform: `translateX(${translationValue}%)`, 
          transition: isUsingTransition ? "transform 0.3s ease" : "none",
        }}
      >
      {extendedCardsRef.current && (
        extendedCardsRef.current.map((
          {name, type, id, creation_date, last_modified, description, ...template}, index) => 
          (
            <div className="carousel-item" key={index}>
              <CustomCard 
                CustomSvg={{
                  SvgComponent: <TemplateSvg />,
                  svgClass: "carousel-template-svg",
                }}
                cardCustomClass={id === selectedTemplate.id ? "selected sample-card" : "sample-card"}
                title={name}
                bodyInnerHTML={`
                  <p>${capitalize(SpanishProcesses[type])}</p>
                  <p>Creacion: ${formatTimestampToDate(Number(creation_date))}</p>
                  <p>Ulitma modificacion:<br/>${getMexicoDate(last_modified)}</p>
                  <p>Descripcion:<br/>${description}</p>
                `}
                bodyCustomClass={"carousel-card-body"}
              />
            </div>
          )
        )
      )}
      </div>
      <button className="carousel-button prev" disabled={isMoving} onClick={handlePrev}>‹</button>
      <button className="carousel-button next" disabled={isMoving} onClick={handleNext}>›</button>
    </div>
  );
};

export default Carousel;
