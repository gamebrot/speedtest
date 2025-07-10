import {CronExpressionParser} from "cron-parser";
import {t} from "i18next";

// Parses cron as a locale string
export const parseCron = (cron) => {
    try {
        return CronExpressionParser.parse(cron).next().toDate().toLocaleString();
    } catch (e) {
        console.log(e)
        return <span className="icon-orange">{t("dropdown.invalid")}</span>;
    }
}

// Fixes the cron provided by the user
export const stringifyCron = (cron) => {
    try {
        return CronExpressionParser.parse(cron).stringify();
    } catch (e) {
        return null;
    }
}