import {t} from "i18next";

export const levelOptions = () => ({
    "none": t("options.level.no_access"),
    "read": t("options.level.read_access")
});

export const selectOptions = () => ({
    "* * * * *": t("options.cron.continuous"),
    "0,30 * * * *": t("options.cron.frequent"),
    "0 * * * *": t("options.cron.default"),
    "0 0,3,6,9,12,15,18,21 * * *": t("options.cron.rare"),
    "0 0,6,12,18 * * *": t("options.cron.really_rare")
});