import {Dialog, DialogHeader, DialogBody, DialogFooter} from "@/common/contexts/Dialog";
import {t, changeLanguage} from "i18next";
import {faGlobe} from "@fortawesome/free-solid-svg-icons";
import "./styles.sass";
import {languages} from "@/i18n";
import {useContext, useState} from "react";
import {ToastNotificationContext} from "@/common/contexts/ToastNotification";

export const LanguageDialog = ({open, onClose}) => {
    const updateToast = useContext(ToastNotificationContext);
    const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem("language") || "en");

    const updateLanguage = (close) => {
        changeLanguage(selectedLanguage);
        updateToast(t('dropdown.language_changed'), "green", faGlobe);
        close();
    };

    return (
        <Dialog open={open} onClose={onClose} className="language-dialog">
            {({close}) => (
                <>
                    <DialogHeader onClose={close}>{t("update.language")}</DialogHeader>
                    <DialogBody>
                        <div className="language-content">
                            <div className="language-list">
                                {languages.map((language) => (
                                    <div 
                                        key={language.code}
                                        className={`language-item${selectedLanguage === language.code ? " language-item-active" : ""}`}
                                        onClick={() => setSelectedLanguage(language.code)}
                                    >
                                        <img src={language.flag} alt={language.name} className="language-flag"/>
                                        <span className="language-name">{language.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </DialogBody>
                    <DialogFooter>
                        <button className="dialog-btn" onClick={() => updateLanguage(close)}>{t("dialog.update")}</button>
                    </DialogFooter>
                </>
            )}
        </Dialog>
    );
}