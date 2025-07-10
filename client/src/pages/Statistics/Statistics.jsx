import {
    ArcElement, BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    RadialLinearScale,
    Title,
    Tooltip
} from "chart.js";
import {useEffect, useState} from "react";
import Failed from "@/pages/Statistics/charts/FailedChart";
import {jsonRequest} from "@/common/utils/RequestUtil";
import SpeedChart from "@/pages/Statistics/charts/SpeedChart";
import LatestTestChart from "@/pages/Statistics/charts/LatestTestChart";
import PingChart from "@/pages/Statistics/charts/PingChart";
import DurationChart from "@/pages/Statistics/charts/DurationChart";
import OverviewChart from "@/pages/Statistics/charts/OverviewChart";
import ManualChart from "@/pages/Statistics/charts/ManualChart";
import AverageChart from "@/pages/Statistics/charts/AverageChart";
import i18n, {t} from "i18next";
import "./styles.sass";

ChartJS.register(ArcElement, Tooltip, CategoryScale, LinearScale, PointElement, LineElement, Title, Legend, BarElement, RadialLinearScale);
ChartJS.defaults.color = "#B0B0B0";
ChartJS.defaults.font.color = "#B0B0B0";
ChartJS.defaults.font.family = "Inter, sans-serif";


export const Statistics = () => {
    const [statistics, setStatistics] = useState(null);
    const [latestTest, setLatestTest] = useState(null);
    const [loading, setLoading] = useState(true);

    const updateStats = () => {
        setLoading(true);
        return Promise.all([
            jsonRequest("/speedtests/statistics/?days=7"),
            jsonRequest("/speedtests?limit=1")
        ])
        .then(([stats, tests]) => {
            setStatistics(stats);
            setLatestTest(tests.length > 0 ? tests[0] : null);
            setLoading(false);
        })
        .catch(error => {
            console.error("Failed to load statistics:", error);
            setLoading(false);
        });
    };

    useEffect(() => {
        updateStats();
    }, []);

    useEffect(() => {
        const callback = () => updateStats();
        i18n.on("languageChanged", callback);
        return () => i18n.off("languageChanged", callback);
    }, []);

    if (loading) return <></>;
    if (!statistics) return <></>;
    if (!statistics.tests || statistics.tests.length === 0) return <h2 className="error-text">{t("test.not_available")}</h2>;

    return (
        <div className="statistic-area">
            <OverviewChart tests={statistics.tests} time={statistics.time}/>
            <LatestTestChart test={latestTest}/>
            <Failed tests={statistics.tests}/>

            <SpeedChart labels={statistics.labels} data={statistics.data}/>

            <ManualChart tests={statistics.tests}/>

            <DurationChart time={statistics.data?.time}/>
            <PingChart labels={statistics.labels} data={statistics.data}/>

            <AverageChart title={t("statistics.values.down")} data={statistics.download}/>
            <AverageChart title={t("statistics.values.up")} data={statistics.upload}/>
        </div>
    );
}