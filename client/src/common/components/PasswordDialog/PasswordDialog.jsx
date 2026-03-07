import {Dialog, DialogHeader, DialogBody, DialogFooter} from "@/common/contexts/Dialog";
import {t} from "i18next";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCheck,
    faExclamationTriangle,
    faEye,
    faEyeSlash,
    faKey,
    faShieldHalved,
    faLock,
    faBookOpen,
    faLockOpen
} from "@fortawesome/free-solid-svg-icons";
import "./styles.sass";
import React, {useContext, useState} from "react";
import {baseRequest, patchRequest} from "@/common/utils/RequestUtil";
import {ConfigContext} from "@/common/contexts/Config";
import {ToastNotificationContext} from "@/common/contexts/ToastNotification";
import {NodeContext} from "@/common/contexts/Node";

export const PasswordDialog = ({open, onClose}) => {
    const [config, reloadConfig] = useContext(ConfigContext);
    const updateToast = useContext(ToastNotificationContext);
    const findNode = useContext(NodeContext)[4];
    const updateNodes = useContext(NodeContext)[1];
    const currentNode = useContext(NodeContext)[2];

    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [accessLevel, setAccessLevel] = useState(config.passwordLevel || "none");

    const resetState = () => {
        setPassword("");
        setShowPassword(false);
        setAccessLevel(config.passwordLevel || "none");
    };

    const handleClose = (close) => {
        resetState();
        close();
    };

    const save = async (close) => {
        try {
            if (password) {
                await patchRequest("/config/password", {value: password});
                if (currentNode !== 0) {
                    await baseRequest("/nodes/" + currentNode + "/password", "PATCH", {password});
                    updateNodes();
                } else {
                    localStorage.setItem("password", password);
                }
            }

            if (accessLevel !== config.passwordLevel) {
                await patchRequest("/config/passwordLevel", {value: accessLevel});
            }

            reloadConfig();
            updateToast(t("dropdown.changes_applied"), "green", faCheck);
            handleClose(close);
        } catch (e) {
            updateToast(t("dropdown.changes_unsaved"), "red", faExclamationTriangle);
        }
    };

    const removePassword = async (close) => {
        try {
            await patchRequest("/config/password", {value: "none"});
            if (currentNode !== 0) {
                await baseRequest("/nodes/" + currentNode + "/password", "PATCH", {password: "none"});
                updateNodes();
            } else {
                localStorage.removeItem("password");
            }

            reloadConfig();
            updateToast(t("update.password_removed"), "green", faCheck);
            handleClose(close);
        } catch (e) {
            updateToast(t("dropdown.changes_unsaved"), "red", faExclamationTriangle);
        }
    };

    const isPasswordSet = currentNode !== 0 
        ? findNode(currentNode)?.password 
        : localStorage.getItem("password") != null;

    return (
        <Dialog open={open} onClose={onClose} className="password-dialog">
            {({close}) => (
                <>
                    <DialogHeader onClose={() => handleClose(close)}>{t("dropdown.password")}</DialogHeader>
                    <DialogBody>
                        <div className="password-content">
                            <div className="password-section">
                                <div className="password-label">
                                    <FontAwesomeIcon icon={faKey}/>
                                    <h3>{t("update.new_password")}</h3>
                                </div>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="dialog-input"
                                        placeholder={t("update.password_placeholder")}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye}/>
                                    </button>
                                </div>
                            </div>

                            <div className="access-section">
                                <div className="access-label">
                                    <FontAwesomeIcon icon={faShieldHalved}/>
                                    <h3>{t("update.level_title")}</h3>
                                </div>
                                <div className="access-options">
                                    <button
                                        className={`access-option${accessLevel === "none" ? " access-active" : ""}`}
                                        onClick={() => setAccessLevel("none")}
                                    >
                                        <FontAwesomeIcon icon={faLock}/>
                                        <div className="access-text">
                                            <span className="access-title">{t("options.level.no_access")}</span>
                                            <span className="access-desc">{t("password.no_access_desc")}</span>
                                        </div>
                                    </button>
                                    <button
                                        className={`access-option${accessLevel === "read" ? " access-active" : ""}`}
                                        onClick={() => setAccessLevel("read")}
                                    >
                                        <FontAwesomeIcon icon={faBookOpen}/>
                                        <div className="access-text">
                                            <span className="access-title">{t("options.level.read_access")}</span>
                                            <span className="access-desc">{t("password.read_access_desc")}</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </DialogBody>
                    <DialogFooter>
                        {isPasswordSet && (
                            <button className="dialog-btn dialog-btn-danger" onClick={() => removePassword(close)}>
                                <FontAwesomeIcon icon={faLockOpen}/>
                                {t("dialog.password.unlock")}
                            </button>
                        )}
                        <button className="dialog-btn" onClick={() => save(close)}>{t("dialog.update")}</button>
                    </DialogFooter>
                </>
            )}
        </Dialog>
    );
};
