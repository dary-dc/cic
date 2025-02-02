import { useEffect, useRef } from "react";

const CustomCard = ({ 
	CustomSvg, 
	cardCustomClass='', 
	title="Texto de la card.",
	text,
	bodyInnerHTML, 
	bodyCustomClass, 
}) => {
	const cardBodyRef = useRef(null);
	const { SvgComponent, svgClass } = CustomSvg;

	// console.log("cardBodyRef", cardBodyRef)
	
	useEffect(() => {
		cardBodyRef.current.innerHTML = bodyInnerHTML;
	}, [])

	return (
		<div className={`card top-column-alignment ${cardCustomClass}`}>
			<div className="flex-container column-flex extra-gap large-margin-top">
				{CustomSvg && (
					<span className={`${svgClass}`}>
						{SvgComponent}
					</span>
				)}
				<h3>{title}</h3>
				<div className={bodyCustomClass} ref={cardBodyRef}>
					{text}
				</div>
			</div>
		</div>
	);
}

export default CustomCard;