import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import '../../../style-sheets/SampleElaboration/TwoStepForm/Carousel.css';
import CustomCard from "../../custom_components/CustomCard.jsx";
import TemplateSvg from "../../svg_components/TemplateSvg.jsx";
import { capitalize, getMexicoDate, formatTimestampToDate } from "../../../utils/utils.js";

const SPANISH_PROCESSES = {
  "urine control": "orina control",
  "serum control": "suero control",
  "commercial serum": "suero comercial",
};

const Carousel = ({ selectedTemplate, onSampleSelection, cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [translationValue, setTranslationValue] = useState(0);
  const [isUsingTransition, setIsUsingTransition] = useState(true);
  const [isMoving, setIsMoving] = useState(false);
  
  const extendedCardsRef = useRef([]);
  const newCountRef = useRef(0);

  const updateIndex = useCallback((newIndex, isTransitioning = true) => {
    if (cards.length <= 4) {
      newIndex = (newIndex + cards.length) % cards.length;
    }
    setIsUsingTransition(isTransitioning);
    setCurrentIndex(newIndex);
    setTranslationValue(-(newIndex * 20 - 40));
    setIsMoving(isTransitioning);
    onSampleSelection(extendedCardsRef.current[newIndex]);
  }, [cards.length, onSampleSelection]);

  useEffect(() => {
    if (cards.length > 4) {
      extendedCardsRef.current = [
        ...cards.slice(-3),
        ...cards,
        ...cards.slice(0, 3)
      ];
      newCountRef.current = 3;
    } else {
      extendedCardsRef.current = [...cards];
      newCountRef.current = 0;
    }
  }, [cards]);

  useEffect(() => {
    const handleTransitionEnd = () => {
      setIsMoving(false);
      if (cards.length > 4) {
        if (currentIndex === extendedCardsRef.current.length - 1) {
          updateIndex(cards.length - 1, false);
        } else if (currentIndex === 0) {
          updateIndex(cards.length, false);
        }
      }
    };
    const carouselInner = document.querySelector(".carousel-inner");
    carouselInner?.addEventListener("transitionend", handleTransitionEnd);
    return () => carouselInner?.removeEventListener("transitionend", handleTransitionEnd);
  }, [currentIndex, updateIndex, cards.length]);

  useEffect(() => {
    if (selectedTemplate) {
      const newIndex = cards.findIndex(({ id }) => id === selectedTemplate.id);
      if (newIndex !== -1) {
        updateIndex(newIndex + newCountRef.current);
      }
    }
  }, [selectedTemplate, cards, updateIndex]);

  useEffect(() => {
    updateIndex(cards.length > 4 ? 3 : 0, false);
  }, [cards.length]);

  return (
    <div className="carousel">
      <div 
        className="carousel-inner" 
        style={{ transform: `translateX(${translationValue}%)`, transition: isUsingTransition ? "transform 0.3s ease" : "none" }}
      >
        {extendedCardsRef.current.map(({ name, type, id, creation_date, last_modified, description }, index) => (
          <div className="carousel-item" key={id || index}>
            <CustomCard 
              CustomSvg={{ SvgComponent: <TemplateSvg />, svgClass: "carousel-template-svg" }}
              cardCustomClass={id === selectedTemplate?.id ? "selected sample-card" : "sample-card"}
              title={name}
              bodyInnerHTML={`
                <p>${capitalize(SPANISH_PROCESSES[type] || type)}</p>
                <p>Creación: ${formatTimestampToDate(Number(creation_date))}</p>
                <p>Última modificación:<br/>${getMexicoDate(last_modified)}</p>
                <p>Descripción:<br/>${description}</p>
              `}
              bodyCustomClass="carousel-card-body"
            />
          </div>
        ))}
      </div>
      <button className="carousel-button prev" disabled={isMoving} onClick={() => updateIndex(currentIndex - 1)}>‹</button>
      <button className="carousel-button next" disabled={isMoving} onClick={() => updateIndex(currentIndex + 1)}>›</button>
    </div>
  );
};

export default Carousel;
