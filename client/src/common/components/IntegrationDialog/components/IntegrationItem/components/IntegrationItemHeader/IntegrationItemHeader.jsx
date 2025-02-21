import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {t} from "i18next";
import {generateRelativeTime} from "@/pages/Home/components/LatestTest/utils";
import {
    faCheck,
    faChevronDown,
    faChevronUp,
    faFloppyDisk,
    faTrash,
    faTrashArrowUp
} from "@fortawesome/free-solid-svg-icons";
import "./styles.sass";
import {useContext, useEffect, useState} from "react";
import {ConfigContext} from "@/common/contexts/Config";

export const IntegrationItemHeader = ({integration, displayName, unsavedChanges, changesConfirmed, saveIntegration,
                                          deleteConfirmed, deleteIntegration, open, setOpen, data}) => {
    const [lastActivity, setLastActivity] = useState(generateRelativeTime(data.lastActivity));
    const [config] = useContext(ConfigContext);

    useEffect(() => {
        const interval = setInterval(() => {
            if (data.lastActivity !== null) setLastActivity(generateRelativeTime(data.lastActivity));
        }, 1000);

        return () => clearInterval(interval);
    });

    return (
    <div className="integration-item-header">
        <div className="integration-item-left">
            <FontAwesomeIcon icon={integration.icon} className="integration-item-icon"/>
            <div className="integration-title-container">
                <h3>{displayName}</h3>
                <div className="integration-item-activity">
                    <div className={"integration-item-activity-circle circle-" + (data.activityFailed ? "error"
                        : (data.lastActivity === null || !data.lastActivity ? "inactive" : "active"))}/>

                    <p>{data.activityFailed ? t("failed") : (data.lastActivity === null || !data.lastActivity
                        ? t("integrations.activity.never_executed") : t("integrations.activity.last_run") + lastActivity)}</p>
                </div>
            </div>
        </div>
        <div className="integration-item-right">
            {!config.previewMode && unsavedChanges && !changesConfirmed && <FontAwesomeIcon icon={faFloppyDisk} onClick={saveIntegration}
                                                                     className="integration-green"/>}
            {changesConfirmed && <FontAwesomeIcon icon={faCheck} className="icon-green"/>}

            {!config.previewMode && !deleteConfirmed &&
                <FontAwesomeIcon icon={faTrash} className="integration-red" onClick={deleteIntegration}/>}
            {deleteConfirmed &&
                <FontAwesomeIcon icon={faTrashArrowUp} className="integration-red" onClick={deleteIntegration}/>}

            <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} onClick={() => setOpen(!open)}
                             className="integration-green"/>
        </div>
    </div>
)}