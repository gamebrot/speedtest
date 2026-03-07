import "./styles.sass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlay, faBookOpen, faPlus} from "@fortawesome/free-solid-svg-icons";

import Videos from "./sources/videos.jsx";
import BlogPosts from "./sources/blog_posts.jsx";
import {useNavigate} from "react-router-dom";

export const Tutorials = () => {
    const navigate = useNavigate();

    return (
        <div className="tutorials-page">
            <div className="tutorials-header">
                <h1>Tutorials</h1>
                <p>Learn how to use MySpeed with these community-created guides</p>
            </div>

            <section className="tutorials-section">
                <h2>Video Tutorials</h2>

                <div className="tutorials-grid">
                    {Videos.map((video, index) => (
                        <article 
                            key={index} 
                            className="tutorial-card"
                            onClick={() => window.open(video.link, "_blank")}
                        >
                            <img src={video.thumb} alt={video.title} className="card-thumbnail"/>
                            <img src={video.creator} alt="Creator" className="creator-avatar"/>
                            <div className="card-overlay">
                                <FontAwesomeIcon icon={faPlay}/>
                            </div>
                        </article>
                    ))}
                    
                    <article 
                        className="tutorial-card add-card"
                        onClick={() => navigate("/tutorials/submit?type=video")}
                    >
                        <FontAwesomeIcon icon={faPlus}/>
                        <span>Submit video</span>
                    </article>
                </div>
            </section>

            <section className="tutorials-section">
                <h2>Blog Posts</h2>

                <div className="tutorials-grid">
                    {BlogPosts.map((post, index) => (
                        <article 
                            key={index} 
                            className="tutorial-card"
                            onClick={() => window.open(post.link, "_blank")}
                        >
                            <img src={post.thumb} alt={post.title} className="card-thumbnail"/>
                            <img src={post.creator} alt="Creator" className="creator-avatar"/>
                            <div className="card-overlay">
                                <FontAwesomeIcon icon={faBookOpen}/>
                            </div>
                        </article>
                    ))}
                    
                    <article 
                        className="tutorial-card add-card"
                        onClick={() => navigate("/tutorials/submit?type=blog")}
                    >
                        <FontAwesomeIcon icon={faPlus}/>
                        <span>Submit post</span>
                    </article>
                </div>
            </section>
        </div>
    );
}