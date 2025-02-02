export const ErrorSvg = () => {
    return (
        <svg 
          className="error-svg"
          viewBox="0 0 100 100" // Adjusted viewBox to fit the icon
          style={{ display: 'block' }} // Prevents extra space around the SVG
        >
          <polygon points="68.7,29.3 50,48 31.3,29.3 29.3,31.3 48,50 29.3,68.7 31.3,70.7 50,52 68.7,70.7 70.7,68.7 52,50 70.7,31.3" />
          <path d="M50,2.5C23.8,2.5,2.5,23.8,2.5,50S23.8,97.5,50,97.5S97.5,76.2,97.5,50S76.2,2.5,50,2.5z M50,94.7 c-24.7,0-44.7-20-44.7-44.7S25.3,5.3,50,5.3s44.7,20,44.7,44.7S74.7,94.7,50,94.7z" />
          <text x="0" y="115" fill="#000000" fontSize="5px" fontWeight="bold" fontFamily="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif">Created by Alice Design</text>
          <text x="0" y="120" fill="#000000" fontSize="5px" fontWeight="bold" fontFamily="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif">from the Noun Project</text>
        </svg>
      );
    // <svg className="error-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"/></svg>
} 