import { Link } from "react-router-dom";

function Header({ isAuthenticated, handleLogout }) {
    return (
        <header>
            <section className='title-container'>
                <h1 className="fancy"><Link to="/">Return to Eden</Link></h1>
            </section>
            <div className="nav-links">
                <nav>
                    <ul className='navbar'>
                        <Link to="//" className="nav-button">Home</Link>
                        <Link className='nav-button' to="/nativeplantrecommender">Build Your Garden!</Link>

                        {!isAuthenticated && (
                            <>
                                <Link to="/login" className="nav-button">Login</Link>
                                <Link to="/register" className="nav-button">Register</Link>
                            </>
                        )}

                        <Link className='nav-button' to="/garden_app">Garden App</Link>
                    </ul>

                    {isAuthenticated && (
                        <ul className='account-links'>
                            <Link className='nav-button' to="/account">Account</Link>
                            <button onClick={handleLogout} className="button logout-btn">Logout</button>
                        </ul>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header;
