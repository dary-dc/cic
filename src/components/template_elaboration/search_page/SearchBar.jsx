import { SearchSvg } from '../../svg_components/SearchSvg.jsx';

const SearchBar = ({ 
	searchTerm, 
	ID, 
	onSearchChange=()=>{}, 
	onSearchInput=()=>{}, 
	customClassName="search-bar-input-container", 
	placeholder="Search...", 
}) => {
	
	return (
		<label className={customClassName} id={ID}>
			<SearchSvg 
				customClassName={"sample-elaboration"}
			/>
			<input
				type="text"
				placeholder={placeholder}
				value={searchTerm}
				onChange={(e) => onSearchChange(e)}
				onInput={(e) => onSearchInput(e)}
			/>
		</label>
	);
}

export default SearchBar;