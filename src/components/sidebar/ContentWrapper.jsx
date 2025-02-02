// Content wrapper for Sidebar component
// Allow the content of the page to move with the sidebar

import "../../style-sheets/TemplateElaboration/SearchPage/SearchPage.css";

// const offSet = 0.375;
const offSet = 0.156;

const ContentWrapper = ({ sidebarData, children }) => {
    return (
        <div className={`page-content ${sidebarData.isOpen ? 'displaced' : ''}`} style={{ transform: `translateX(${sidebarData.isOpen ? `${sidebarData.width * offSet}px` : `0px`}`, }}>
            {children}
        </div>
    );
}

export default ContentWrapper;