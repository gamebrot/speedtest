import React, {createContext, useContext, useEffect, useState} from "react";
import {InputDialogContext} from "../InputDialog";
import {request} from "@/common/utils/RequestUtil";
import {apiErrorDialog, passwordRequiredDialog} from "@/common/contexts/Config/dialog";
import WelcomeDialog from "@/common/components/WelcomeDialog";
import {useNavigate} from "react-router-dom";

export const ConfigContext = createContext({});

export const ConfigProvider = (props) => {
    const [config, setConfig] = useState({});
    const [setDialog] = useContext(InputDialogContext);
    const [welcomeShown, setWelcomeShown] = useState(false);
    const navigate = useNavigate();


    const reloadConfig = () => {
        request("/config").then(async res => {
            if (res.status === 401) throw 1;
            if (!res.ok) throw 2;

            try {
                return JSON.parse(await res.text());
            } catch (e) {
                throw 2;
            }
        }).then(result => {
            if (config !== result)
                result.viewMode && localStorage.getItem("currentNode") !== null && localStorage.getItem("currentNode") !== "0"
                    ? navigate("/nodes") : setConfig(result);
        }).catch((code) => {
            localStorage.getItem("currentNode") !== null && localStorage.getItem("currentNode") !== "0"
                ? navigate("/nodes") : setDialog(code === 1 ? passwordRequiredDialog() : apiErrorDialog());
        });
    }

    const checkConfig = async () => (await request("/config")).json();

    useEffect(reloadConfig, []);

    useEffect(() => {
        if (config.previewMode && !localStorage.getItem("welcomeShown")) setWelcomeShown(true);
        if (!config.previewMode && config.provider === "none") setWelcomeShown(true);
    }, [config]);

    return (
        <ConfigContext.Provider value={[config, reloadConfig, checkConfig]}>
            {welcomeShown && <WelcomeDialog onClose={() => setWelcomeShown(false)}/>}
            {props.children}
        </ConfigContext.Provider>
    )
}