import React, {forwardRef, useContext, useRef, useImperativeHandle} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowDown, faArrowUp, faClockRotateLeft, faClose,
    faInfo, faPingPongPaddleBall, faTrashCan, faWaveSquare
} from "@fortawesome/free-solid-svg-icons";
import {useAlert} from "@/common/contexts/Alert";
import {SpeedtestContext} from "@/common/contexts/Speedtests";
import {deleteRequest} from "@/common/utils/RequestUtil";
import "./styles.sass";
import {averageResultDialog, resultDialog} from "@/pages/Home/components/Speedtest/utils/infos";
import {errors} from "@/pages/Home/components/Speedtest/utils/errors";
import {t} from "i18next";
import {ConfigContext} from "@/common/contexts/Config";
import {ToastNotificationContext} from "@/common/contexts/ToastNotification";

const SpeedtestComponent = forwardRef((props, forwardedRef) => {
    const alert = useAlert();
    const updateToast = useContext(ToastNotificationContext);
    const [config] = useContext(ConfigContext);
    const {deleteTest} = useContext(SpeedtestContext);

    const ref = useRef();

    useImperativeHandle(forwardedRef, () => ref.current);

    let errorMessage = t("test.unknown_error") + " " + props.error;

    let isAverage = props.type === "average";
    let timeString = (String(isAverage ? props.time.getDate() : props.time.getHours()).padStart(2, '0')) + (isAverage ? "." : ":")
        + (String(isAverage ? (props.time.getMonth() + 1) : props.time.getMinutes()).padStart(2, '0'));

    if (props.error) {
        for (let errorsKey in errors())
            if (props.error.includes(errorsKey)) errorMessage = errors()[errorsKey];
    }

    const fadeOut = () => {
        if (ref.current == null) return;
        ref.current.classList.add("speedtest-hidden");
        updateToast(t("test.deleted"), "green", faTrashCan);
        setTimeout(() => deleteTest(props.id), 300);
    }

    const showErrorDialog = async () => {
        await alert.openAlert(
            t("test.failed"),
            errorMessage + ". " + t("test.recheck"),
            {
                buttonText: t("dialog.okay"),
                clearButton: t("test.delete"),
                onClear: () => deleteRequest(`/speedtests/${props.id}`).then(fadeOut)
            }
        );
    };

    const showInfoDialog = async () => {
        if (props.type === "average") {
            await alert.openAlert(
                t("test.average.title"),
                averageResultDialog(timeString, props),
                {buttonText: t("dialog.okay")}
            );
        } else {
            await alert.openAlert(
                t("test.result.title"),
                resultDialog(props),
                {
                    buttonText: t("dialog.okay"),
                    clearButton: !config.viewMode ? t("test.delete") : undefined,
                    onClear: () => deleteRequest(`/speedtests/${props.id}`).then(fadeOut)
                }
            );
        }
    };

    return (
        <div className="speedtest" ref={ref} onClick={props.error ? showErrorDialog : showInfoDialog}>
            <div className="date">
                <FontAwesomeIcon icon={props.error ? faInfo : faClockRotateLeft}
                                 className={"container-icon icon-" + (props.error ? "error" : "blue")}/>
                <h2 className="date-text">{(t("time." + (isAverage ? "on" : "at"))) + " " + timeString}</h2>
            </div>
            <div className="speedtest-row">
                <FontAwesomeIcon icon={props.error ? faClose : faPingPongPaddleBall}
                                 className={"speedtest-icon icon-" + props.pingLevel}/>
                <h2 className="speedtest-text">
                    {props.error ? "" : props.ping}
                    {!props.error && props.jitter !== null && props.jitter !== undefined && (
                        <span className="jitter-suffix"><FontAwesomeIcon icon={faWaveSquare} className="jitter-icon" />{props.jitter}</span>
                    )}
                </h2>
            </div>
            <div className="speedtest-row">
                <FontAwesomeIcon icon={props.error ? faClose : faArrowDown}
                                 className={"speedtest-icon icon-" + props.downLevel}/>
                <h2 className="speedtest-text">{props.error ? "" : props.down}</h2>
            </div>
            <div className="speedtest-row">
                <FontAwesomeIcon icon={props.error ? faClose : faArrowUp}
                                 className={"speedtest-icon icon-" + props.upLevel}/>
                <h2 className="speedtest-text">{props.error ? "" : props.up}</h2>
            </div>
        </div>
    );
});

export default SpeedtestComponent;