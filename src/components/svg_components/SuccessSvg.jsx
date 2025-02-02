export const SuccessSvg = () => {
    return (
        <svg 
            className="success-svg"
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 100 100" // Adjusted viewBox
          style={{ display: 'block' }} // Prevents extra space
        >
          <title>03</title> {/* You can keep the title if needed */}
          <g> {/* Removed data-name attributes, they are not needed for rendering */}
            <polygon points="36.8 40.3 35.3 41.6 51.2 58.7 78.1 31.8 76.7 30.4 51.3 55.8 36.8 40.3" />
            <path d="M50,79.7A29.7,29.7,0,0,0,79.7,50h-2A27.7,27.7,0,1,1,50,22.3v-2a29.7,29.7,0,0,0,0,59.4Z" />
          </g>
          <text x="0" y="115" fill="#000000" fontSize="5px" fontWeight="bold" fontFamily="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif">Created by Manish</text>
          <text x="0" y="120" fill="#000000" fontSize="5px" fontWeight="bold" fontFamily="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif">from the Noun Project</text>
        </svg>
      ); 
    // <svg className="success-svg"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"/></svg>;
} 