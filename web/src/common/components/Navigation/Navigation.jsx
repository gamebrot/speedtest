import "./styles.sass";
import Logo from "@/common/assets/logo192.png";
import {faXmark, faBars, faArrowUpRightFromSquare} from "@fortawesome/free-solid-svg-icons";
import {faGithub} from "@fortawesome/free-brands-svg-icons";
import {Link, useLocation} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useState, useEffect, useRef, useLayoutEffect} from "react";
import {DOCUMENTATION_BASE} from "@/common/utils/constants";

export const GITHUB_LINK = "https://github.com/gnmyt/myspeed";

const NAV_ITEMS = [
    {path: "/", label: "Home", isExternal: false},
    {path: "/install", label: "Install", isExternal: false},
    {path: "/tutorials", label: "Tutorials", isExternal: false},
    {path: DOCUMENTATION_BASE, label: "Docs", isExternal: true},
];

export const Navigation = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navCenterRef = useRef(null);
    const linkRefs = useRef([]);
    const [indicatorStyle, setIndicatorStyle] = useState({left: 0, width: 0});

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
    }, [location]);

    const isActive = (path) => location.pathname === path;

    const getActiveIndex = () => {
        return NAV_ITEMS.findIndex(item => !item.isExternal && isActive(item.path));
    };

    useLayoutEffect(() => {
        const updateIndicator = () => {
            const activeIndex = getActiveIndex();
            if (activeIndex !== -1 && linkRefs.current[activeIndex] && navCenterRef.current) {
                const linkEl = linkRefs.current[activeIndex];
                const navEl = navCenterRef.current;
                const linkRect = linkEl.getBoundingClientRect();
                const navRect = navEl.getBoundingClientRect();
                setIndicatorStyle({
                    left: linkRect.left - navRect.left,
                    width: linkRect.width,
                });
            } else {
                setIndicatorStyle({left: 0, width: 0});
            }
        };

        updateIndicator();
        window.addEventListener("resize", updateIndicator);
        return () => window.removeEventListener("resize", updateIndicator);
    }, [location.pathname]);

    return (
        <>
            <nav className={scrolled ? "nav-scrolled" : ""}>
                <Link className="logo-area" to="/">
                    <img src={Logo} alt="MySpeed Logo"/>
                    <span>MySpeed</span>
                </Link>

                <div className="nav-center" ref={navCenterRef}>
                    {NAV_ITEMS.map((item, index) => (
                        item.isExternal ? (
                            <a
                                key={item.path}
                                href={item.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                ref={el => linkRefs.current[index] = el}
                                className="external-link"
                            >
                                {item.label}
                                <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="external-icon" />
                            </a>
                        ) : (
                            <Link
                                key={item.path}
                                to={item.path}
                                ref={el => linkRefs.current[index] = el}
                            >
                                {item.label}
                            </Link>
                        )
                    ))}
                    <div
                        className="nav-indicator"
                        style={{
                            left: indicatorStyle.left,
                            width: indicatorStyle.width,
                            opacity: indicatorStyle.width > 0 ? 1 : 0,
                        }}
                    />
                </div>

                <a href={GITHUB_LINK} target="_blank" rel="noopener noreferrer" className="github-link">
                    <FontAwesomeIcon icon={faGithub}/>
                </a>

                <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
                    <FontAwesomeIcon icon={mobileOpen ? faXmark : faBars}/>
                </button>
            </nav>

            <div className={`mobile-nav ${mobileOpen ? "mobile-open" : ""}`}>
                <div className="mobile-header">
                    <Link to="/" className="mobile-logo">
                        <img src={Logo} alt="MySpeed Logo"/>
                        <span>MySpeed</span>
                    </Link>
                    <button className="mobile-close" onClick={() => setMobileOpen(false)}>
                        <FontAwesomeIcon icon={faXmark}/>
                    </button>
                </div>
                
                <div className="mobile-links">
                    <Link to="/" className={isActive("/") ? "active" : ""}>Home</Link>
                    <Link to="/install" className={isActive("/install") ? "active" : ""}>Install</Link>
                    <Link to="/tutorials" className={isActive("/tutorials") ? "active" : ""}>Tutorials</Link>
                    <a href={DOCUMENTATION_BASE} target="_blank" rel="noopener noreferrer">
                        Docs
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="external-icon" />
                    </a>
                    <a href={GITHUB_LINK} target="_blank" rel="noopener noreferrer">GitHub</a>
                </div>
            </div>

            {mobileOpen && <div className="mobile-overlay" onClick={() => setMobileOpen(false)}/>}
        </>
    );
}