import { Navigate, useLocation } from "react-router-dom";
import { getCookie } from "../../utils/utils";
import { useEffect, useState } from "react";

const NavigateHandler = () => {
    const location = useLocation();
    const user_deep_level = getCookie('user_deep_level');

    let url = "";
    // if(isDeviceNotSupported){
    //     url = "/Dispositivo-no-soportado"
    // }
    if (user_deep_level === null) {
        url = "/Autenticarse";
    } else if (user_deep_level.includes("0")) {
        url = "/Admin";
    } else if (user_deep_level.includes("2")) {
        url = "/Home";
    } else if (user_deep_level.includes("3")) {
        url = "/Report";
    }

    return <Navigate to={url} state={{ from: location }} replace />;
};

export default NavigateHandler;