import { Routes,Route, Outlet } from "react-router-dom";
import { Login } from '../Login';
import { lazy,Suspense, useEffect, useRef, useState } from "react";
import { getCookie } from "../../utils/utils";
import { RequireAuth } from "../RequiredAuth";
import { NavBar } from '../NavBar';
import { QualityControlSvg } from "../svg_components/QualityControlSvg";
import { AboutSvg } from "../svg_components/AboutSvg";
import { HelpSvg } from "../svg_components/HelpSvg";
import NavigateHandler from "./NavigateHandler";
import Users from "../Users";
import Report from "../Report";
import Footer from "../Footer";
import RepeatabilityProcess from "../help/tab_content/RepeatabilityProcess";
import ReproducibilityProcess from "../help/tab_content/ReproducibilityProcess";
import UrineControlProcess from "../help/tab_content/UrineControlProcess";
import SerumElaborationProcess from "../help/tab_content/SerumElaborationProcess";
import { ProfileSettings } from "../profile/ProfileSettings";
import { Fallback } from "../Fallback";
import { CommercialSerumElaboration } from "../CommercialSerumElaboration";
import { SelectionContextProvider } from "../template_elaboration/custom_template_page/SelectionContext";
import { DeviceNotSupported } from "../DeviceNotSupported";

const AdminPanel = lazy(() => import("../AdminPanel"));
const Repeatability = lazy(() => import("../Repeatability"));
const Reproducibility = lazy(() => import("../Reproducibility"));
const About = lazy(() => import("../About"));
const Help = lazy(() => import("../help/Help"));
const TemplateElaboration = lazy(() => import("../TemplateElaboration"));
const SampleElaboration = lazy(() => import("../sample_elaboration/SampleElaboration"));
const CustomTemplatePage = lazy(() => import("../template_elaboration/custom_template_page/CustomTemplatePage"));
const Home = lazy(() => import("../Home"));


export const RouteHandler = ({navigate}) => {
    const authToken = getCookie('auth_token');

    const isAuth = authToken !== null;
    const isDeviceNotSupported = useRef(null);
  
    useEffect(() => {
        const checkScreenSize = () => {
            // const screenWidth = window.screen.width;
            // const screenHeight = window.screen.height;
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const desktopWidthThreshold = 1024;
            const desktopHeightThreshold = 710;
            let isDeviceNotSupportedTemp = screenWidth < desktopWidthThreshold || screenHeight < desktopHeightThreshold;


            console.log("metrics","isDeviceNotSupportedTemp",isDeviceNotSupportedTemp,"",screenWidth ,desktopWidthThreshold ,screenHeight ,desktopHeightThreshold,screenWidth < desktopWidthThreshold || screenHeight < desktopHeightThreshold)

            if(isDeviceNotSupportedTemp !== isDeviceNotSupported.current && !isDeviceNotSupportedTemp) {
                console.log("navigating");
                navigate("/Autenticarse");
            }

            console.log(isDeviceNotSupportedTemp,isDeviceNotSupported.current)
            if(isDeviceNotSupportedTemp !== isDeviceNotSupported.current && isDeviceNotSupportedTemp){
                console.log("changing","isDeviceNotSupportedTemp",isDeviceNotSupportedTemp,"isDeviceNotSupported",isDeviceNotSupported.current)
                navigate("/Dispositivo-no-soportado");
            }

            isDeviceNotSupported.current = isDeviceNotSupportedTemp;
        };

        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);


        return () => window.removeEventListener("resize", checkScreenSize);
    },[]);
  
    let admin_menu_data = [
        {
            'tag':'Datos',
            'subMenu':[
                {
                    'tag' : 'Usuarios',
                    'to'  : '/Users',
                },
            ],
            'svgComponent':<QualityControlSvg/>
        },
    ]

    let laboratory_worker_menu_data = [
        {
            'tag':'Control de Calidad',
            'subMenu':[
                {
                    'tag' : 'Repetibilidad',
                    'to'  : '/Repetibilidad',
                },
                {
                    'tag' : 'Reproducibilidad',
                    'to'  : '/Reproducibilidad',
                },{
                    'tag' : 'Elaboración de Plantillas',
                    'to'  : '/Elaboración-de-Plantillas',
                },{
                    'tag' : 'Elaboración de Muestras',
                    'to'  : '/Elaboración-de-Muestras',
                },{
                    'tag' : 'Elaboración de Sueros Comerciales',
                    'to'  : '/Elaboración-de-Sueros-Comerciales',
                }
            ],
            'svgComponent':<QualityControlSvg/>
        },
        {
            'tag':'Acerca',
            'to' : '/Acerca',
            'svgComponent':<AboutSvg/>
        },

        {
            'tag':'Ayuda',
            'to' : '/Ayuda',
            'svgComponent':<HelpSvg/>
        }
    ]
    
    return(
            <Suspense fallback={ <Fallback/> }>
                <Routes>
                    
                    <Route element={<RequireAuth allowedLevels={[3]} />}>
                        <Route element={
                            <>
                                <NavBar navigate={navigate} data={[]} />
                                <Outlet />
                                <Footer/>
                            </>
                        }>
                            <Route exact path="/Report" element={<Report />} />
                        </Route>
                    </Route>
                    <Route element={<RequireAuth allowedLevels={[0,2]} />}>
                        <Route element={
                            <>
                                <NavBar navigate={navigate} data={admin_menu_data} />
                                <Outlet />
                                <Footer/>
                            </>
                        }>
                            <Route exact path="/Admin" element={<AdminPanel />} />
                            <Route exact path="/Users" element={<Users />} />
                        </Route>
                    </Route>

                    <Route element={<RequireAuth allowedLevels={[0,2]} />}>
                        <Route element={
                            <>
                                <NavBar navigate={navigate} data={laboratory_worker_menu_data} />
                                <Outlet />
                                <Footer/>
                            </>
                        }>
                            <Route exact path="/Home" element={<Home navigate={navigate} />} />
                            <Route exact path="/Repetibilidad" element={<Repeatability />} />
                            <Route exact path="/Reproducibilidad" element={<Reproducibility />} />
                            <Route exact path="/Acerca" element={<About />} />
                            <Route exact path="/Ayuda" element={<Help />} />
                            <Route exact path="/Ayuda/Proceso-de-Repetibilidad" element={<RepeatabilityProcess />} />
                            <Route exact path="/Ayuda/Proceso-de-Reproducibilidad" element={<ReproducibilityProcess />} />
                            <Route exact path="/Ayuda/Proceso-de-Elaboracion-de-Suero" element={<UrineControlProcess />} />
                            <Route exact path="/Ayuda/Proceso-de-Elaboracion-de-Orina-Control" element={<SerumElaborationProcess />} />
                            <Route exact path="/Elaboración-de-muestras" element={
                                <SelectionContextProvider>
                                    <SampleElaboration />
                                </SelectionContextProvider>} />
                            <Route exact path="/Elaboración-de-Plantillas" element={<TemplateElaboration routes={{ base: "/Elaboración-de-Plantillas", customTemplate: "/plantilla-de-control", commercialSerum: "/suero-comercial" }} />} />
                            <Route exact path="/Elaboración-de-Plantillas/plantilla-de-control/:id" element={<CustomTemplatePage routes={{ base: "/Elaboración-de-Plantillas", }} />} />
                            <Route exact path="/Elaboración-de-Plantillas/plantilla-de-control/nuevo" element={<CustomTemplatePage routes={{ base: "/Elaboración-de-Plantillas", }} />}  />
                            <Route exact path="/Elaboración-de-Sueros-Comerciales" element={<CommercialSerumElaboration />} />
                        </Route>
                    </Route>

                    <Route exact path="/Autenticarse" element={<Login navigate={navigate} />} />
                    <Route exact path="/Configuracion de Perfil" element={<ProfileSettings />} />
                    <Route exact path="/" element={<NavigateHandler />} />
                    <Route path="/Dispositivo-no-soportado" element={<DeviceNotSupported />} />
                </Routes>
            </Suspense>
);
} 
