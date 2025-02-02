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

const Carousel = ({ selectedSample, onSampleSelection, cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // const [translationValue, setTranslationValue] = useState(0); // translation goes from 40% to -140%
  const [translationValue, setTranslationValue] = useState(0);
  const [isUsingTransition, setIsUsingTransition] = useState(true);
  const [isMoving, setIsMoving] = useState(false);
  
  const cardNamesRef = useRef(null);
  const extendedCardsRef = useRef(null);
  const newCountRef = useRef(null);
  
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
    setIsUsingTransition(isTransitioning);
    setCurrentIndex(newIndex);
    setTranslationValue(-(newIndex * 20 - 40));
    setIsMoving(isTransitioning);
    // setTranslationValue(-(newIndex * 20));

    onSampleSelection(extendedCardsRef.current[newIndex].name)
	}, [extendedCardsRef, onSampleSelection])

  // makes the carousel infinite and circular
  useEffect(() => {
    let newCount = newCountRef.current
    if (isUsingTransition) {
      const transitionEndHandler = () => {
        setIsMoving(false)
        if (currentIndex === newCount - 1) {
          updateIndex(cards.length + newCount - 1, false)
        } else if (currentIndex === cards.length + newCount) {
          updateIndex(newCount, false)
        }
      };

      document.querySelector(".carousel-inner").addEventListener("transitionend", transitionEndHandler)
      return () => {
        document.querySelector(".carousel-inner").removeEventListener("transitionend", transitionEndHandler)
      }

    }
  }, [currentIndex, isUsingTransition, cards.length, updateIndex, newCountRef])


  // make the selected card using the selector updates the carousel
  useEffect(() => {
    console.log(cards)
    cardNamesRef.current = cards.map(({name}) => name);

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
  }, [cards])

  useEffect(() => {
    const extendedCards = extendedCardsRef.current
    let newCount = newCountRef.current
    // if the card name is distinct
    if (selectedSample !== extendedCards.map(({name}) => name)[currentIndex]) {
      // update the index
      let newIndex = cardNamesRef.current.indexOf(selectedSample);
      if (newIndex !== -1) {
        updateIndex(newIndex + newCount);
      }
    }
	}, [selectedSample, cards, updateIndex, currentIndex])

  
  useEffect(() => {
    if (cards.length > 4) {
      updateIndex(5, false)
    } else {
      updateIndex(1, false)
    }
  }, [])

  // console.log("extendedCardsRef.current", extendedCardsRef.current)
  // console.log("currentIndex", currentIndex)
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
                cardCustomClass={name === selectedSample ? "selected sample-card" : "sample-card"}
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
