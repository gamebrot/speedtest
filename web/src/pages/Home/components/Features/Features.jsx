import "./styles.sass";
import Screenshot1 from "@/common/assets/sc1.png";
import Screenshot2 from "@/common/assets/sc2.png";

export const Features = () => {
    return (
        <section className="features-section">
            <div className="feature-block">
                <div className="feature-content">
                    <span className="feature-label">Automated Testing</span>
                    <h3>Set it and forget it</h3>
                    <p>
                        Configure your test schedule once and let MySpeed handle the rest. 
                        Tests run automatically in the background with support for multiple providers.
                    </p>
                </div>
                <div className="feature-image">
                    <img src={Screenshot1} alt="Automated speed testing interface"/>
                </div>
            </div>

            <div className="feature-block feature-reverse">
                <div className="feature-content">
                    <span className="feature-label">Analytics</span>
                    <h3>Track your performance</h3>
                    <p>
                        View your speed history with clear visualizations. Identify patterns, 
                        detect issues, and keep your ISP accountable.
                    </p>
                </div>
                <div className="feature-image">
                    <img src={Screenshot2} alt="Speed test analytics dashboard"/>
                </div>
            </div>
        </section>
    )
}