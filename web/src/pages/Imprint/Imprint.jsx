import "./styles.sass";

export const Imprint = () => {
    return (
        <div className="legal-page">
            <div className="legal-container">
                <h1>Imprint</h1>
                
                <section className="legal-section">
                    <h2>Information in accordance with § 5 DDG</h2>
                    <address>
                        Mathias Wagner<br/>
                        c/o COCENTER<br/>
                        Koppoldstr. 1<br/>
                        86551 Aichach
                    </address>
                </section>

                <section className="legal-section">
                    <h2>Contact</h2>
                    <p>Email: <a href="mailto:mathias@gnm.dev">mathias@gnm.dev</a></p>
                </section>
            </div>
        </div>
    )
}