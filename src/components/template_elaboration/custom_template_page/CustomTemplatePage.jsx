import CustomTemplate from "./custom_template/CustomTemplate"; 
import { FocusContextProvider } from "./FocusContext.jsx";

const CustomTemplatePage = ({ routes }) => {
  return (
      <FocusContextProvider>
        <CustomTemplate routes={routes} />
      </FocusContextProvider>
  );
};

export default CustomTemplatePage;
