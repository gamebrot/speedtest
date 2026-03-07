import React, {useState, useContext} from "react";
import {Dialog, DialogHeader, DialogBody, DialogFooter} from "@/common/contexts/Dialog";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faQuestionCircle, faBolt, faGauge, faClock, faLeaf, faSeedling, faChevronDown} from "@fortawesome/free-solid-svg-icons";
import {t} from "i18next";
import {patchRequest} from "@/common/utils/RequestUtil";
import {ConfigContext} from "@/common/contexts/Config";
import {ToastNotificationContext} from "@/common/contexts/ToastNotification";
import {CronExpressionParser} from "cron-parser";
import "./styles.sass";

const PRESETS = [
    {id: "continuous", cron: "* * * * *", icon: faBolt},
    {id: "frequent", cron: "0,30 * * * *", icon: faGauge},
    {id: "default", cron: "0 * * * *", icon: faClock},
    {id: "rare", cron: "0 0,3,6,9,12,15,18,21 * * *", icon: faLeaf},
    {id: "really_rare", cron: "0 0,6,12,18 * * *", icon: faSeedling}
];

const getNextRun = (cron) => {
    try {
        return CronExpressionParser.parse(cron).next().toDate().toLocaleString();
    } catch {
        return null;
    }
};

export const FrequencyDialog = ({open, onClose}) => {
    const [config, reloadConfig] = useContext(ConfigContext);
    const updateToast = useContext(ToastNotificationContext);
    const isCustomPreset = !PRESETS.find(p => p.cron === config.cron);
    const [selected, setSelected] = useState(() => {
        const preset = PRESETS.find(p => p.cron === config.cron);
        return preset ? preset.id : "custom";
    });
    const [customCron, setCustomCron] = useState(config.cron || "0 * * * *");
    const [scheduleOffset, setScheduleOffset] = useState(config.scheduleOffset === "true");
    const [showAdvanced, setShowAdvanced] = useState(isCustomPreset);
    const [saving, setSaving] = useState(false);

    const handlePresetClick = (preset) => {
        setSelected(preset.id);
        setCustomCron(preset.cron);
    };

    const handleSave = async (close) => {
        const cronValue = selected === "custom" ? customCron : PRESETS.find(p => p.id === selected)?.cron;
        if (!cronValue || !getNextRun(cronValue)) return;
        
        setSaving(true);
        const cronRes = await patchRequest("/config/cron", {value: cronValue});
        const offsetRes = await patchRequest("/config/scheduleOffset", {value: scheduleOffset ? "true" : "false"});
        setSaving(false);
        
        if (cronRes.ok && offsetRes.ok) {
            updateToast(t("dropdown.changes_applied"), "green", faCheck);
            reloadConfig();
            close();
        } else {
            updateToast(t("dropdown.changes_unsaved"), "red");
        }
    };

    const isCustomValid = selected !== "custom" || getNextRun(customCron);
    const nextRun = getNextRun(customCron);

    return (
        <Dialog open={open} onClose={onClose} className="frequency-dialog">
            {({close}) => (
                <>
                    <DialogHeader onClose={close}>{t("update.cron_title")}</DialogHeader>
                    <DialogBody>
                        <div className="frequency-content">
                            <div className="frequency-presets">
                                {PRESETS.map(preset => (
                                    <div key={preset.id} 
                                        className={`frequency-item${selected === preset.id ? " frequency-item-active" : ""}`}
                                        onClick={() => handlePresetClick(preset)}>
                                        <FontAwesomeIcon icon={preset.icon}/>
                                        <div className="frequency-item-text">
                                            <h3>{t(`options.cron.${preset.id}`)}</h3>
                                            <p>{t(`options.cron.${preset.id}_desc`)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <button 
                                className={`frequency-advanced-toggle${showAdvanced ? " frequency-advanced-open" : ""}`}
                                onClick={() => setShowAdvanced(!showAdvanced)}
                            >
                                <span>{t("update.custom_cron")}</span>
                                <FontAwesomeIcon icon={faChevronDown}/>
                            </button>
                            
                            {showAdvanced && (
                                <div className="frequency-custom">
                                    <div className="frequency-custom-input">
                                        <input type="text" 
                                            className={`dialog-input frequency-input${selected === "custom" && !isCustomValid ? " input-error" : ""}`}
                                            value={customCron} 
                                            onChange={(e) => { setCustomCron(e.target.value); setSelected("custom"); }}
                                            placeholder="0 * * * *"/>
                                        <a href="https://crontab.guru/" target="_blank" rel="noreferrer" className="frequency-help">
                                            <FontAwesomeIcon icon={faQuestionCircle}/>
                                        </a>
                                    </div>
                                    {nextRun && <p className="frequency-next-run">{t("update.cron_next_test")} {nextRun}</p>}
                                </div>
                            )}
                            
                            <div className="frequency-option" onClick={() => setScheduleOffset(!scheduleOffset)}>
                                <div className={`frequency-toggle${scheduleOffset ? " frequency-toggle-active" : ""}`}>
                                    <div className="frequency-toggle-knob"/>
                                </div>
                                <div className="frequency-option-text">
                                    <h3>{t("update.schedule_offset")}</h3>
                                    <p>{t("update.schedule_offset_desc")}</p>
                                </div>
                            </div>
                        </div>
                    </DialogBody>
                    <DialogFooter>
                        <button className="dialog-btn" onClick={() => handleSave(close)} disabled={saving || !isCustomValid}>
                            {saving ? t("dialog.saving") : t("dialog.save")}
                        </button>
                    </DialogFooter>
                </>
            )}
        </Dialog>
    );
};