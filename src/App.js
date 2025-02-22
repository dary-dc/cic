import './App.css';
import './style-sheets/General.css';
import './style-sheets/General2.css';
import './style-sheets/General3.css';
import './style-sheets/General4.css';
import './style-sheets/General5.css';
import { useNavigate } from "react-router-dom";
import { RouteHandler } from './components/routes//RouteHandler';
import { getCookie } from "./utils/utils";
import { useEffect } from 'react';
import { ApiContext } from './components/ApiContext';
import { Provider } from 'react-redux';
import store from './redux/store';
import { HelmetProvider } from 'react-helmet-async';

function App() {
  const navigate = useNavigate();
  const authToken = getCookie('auth_token');
  const BASE_URL =  "http://localhost:";
  const isAuth = authToken !== null;

  
  useEffect(() => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const desktopWidthThreshold = 1024;
    const desktopHeightThreshold = 710;
    let isDeviceNotSupportedTemp = screenWidth < desktopWidthThreshold || screenHeight < desktopHeightThreshold;
    
    if(isDeviceNotSupportedTemp){
      navigate("/Dispositivo-no-soportado");
    }else 
    if(!isAuth){
      navigate("/Autenticarse");
  }

    },[isAuth,navigate])

  return (
    <HelmetProvider>
      <Provider store={store}>
        <ApiContext.Provider value={{"BASE_URL" : BASE_URL,PORT:5000 }} >
          <div className="App">
            <RouteHandler navigate={navigate}/>
          </div>
        </ApiContext.Provider>
      </Provider>
    </HelmetProvider>
  );
}

export default App;
