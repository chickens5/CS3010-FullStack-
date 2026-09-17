import { Link } from "react-router-dom";


function HomeContent() {
    return (
            <div className="app-container">
                
                <h2 style ={{background: 'black', padding: '10px', borderRadius: '20px'}}>"Welcome to "Return to Eden"</h2>
                
                <section className='content-container'>
                    <h3>I made this website to make connecting with nature & Earth more acessible. 
                        Utilize the Plant Tool for native plant recommendations, and register an account to connect with others!</h3>
                    <Link to="/register" className="nav-link-header">*SIGN UP HERE*</Link>
                </section>
            </div>
    );
}

export default HomeContent;
