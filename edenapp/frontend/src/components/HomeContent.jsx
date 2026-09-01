import { Link } from "react-router-dom";


function HomeContent() {
    return (
        <div className="page-container">
            <section className="app-container">
                <section className='title-container'>
                    <h2 className= 'outline'>Welcome to Team Eden!</h2>
                </section>
                <section className='content-container'>
                    <h2 className = 'outline'>Check our app, EDEN, to streamline your food, water, waste, energy, and clothing management.</h2>
                        <h3>Or, socialize and collaborate with a community passionate about sustainable living.</h3>
                    <p>Want to save your gardens or chat with others? <Link to="/register" className="nav-button">*SIGN UP HERE*</Link></p>
                </section>


                <section className='title-container'>
                    <h2>Our Blog, Eden Rebirth!</h2>
                </section>

                <section className='content-container'>
                    <h4>Check out EdenRebirth to learn about the Earth, and sign up for the newsletter to post your own thoughts!</h4>
                </section>
                
            </section>
        </div>
    );
}

export default HomeContent;
