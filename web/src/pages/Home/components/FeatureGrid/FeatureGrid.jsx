import "./styles.sass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGlobe, faLayerGroup, faBell, faClock, faShieldHalved, faChartLine} from "@fortawesome/free-solid-svg-icons";

const features = [
    {
        icon: faGlobe,
        title: "Multilingual",
        description: "Available in multiple languages with community translations from around the world.",
        color: "blue"
    },
    {
        icon: faLayerGroup,
        title: "Multiple Views",
        description: "Choose from list, graph, or compact views to visualize your speed data.",
        color: "purple"
    },
    {
        icon: faBell,
        title: "Integrations",
        description: "Get notified via Discord, Telegram, Pushover, webhooks and more.",
        color: "orange"
    },
    {
        icon: faClock,
        title: "Flexible Scheduling",
        description: "Run tests at any interval - from every 5 minutes to every 5 hours.",
        color: "green"
    },
    {
        icon: faShieldHalved,
        title: "Privacy First",
        description: "Self-hosted solution. Your data stays on your server, always.",
        color: "red"
    },
    {
        icon: faChartLine,
        title: "Detailed Analytics",
        description: "Track trends over time and export your data whenever you need.",
        color: "cyan"
    }
];

export const FeatureGrid = () => {
    return (
        <section className="feature-grid-section">
            <div className="feature-grid-header">
                <span className="feature-grid-label">Why MySpeed?</span>
                <h2>Everything you need to monitor your connection</h2>
                <p>Powerful features packed into a lightweight, self-hosted application.</p>
            </div>
            <div className="feature-grid">
                {features.map((feature, index) => (
                    <div key={index} className={`feature-card feature-card--${feature.color}`}>
                        <div className="feature-icon">
                            <FontAwesomeIcon icon={feature.icon}/>
                        </div>
                        <div className="feature-text">
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}