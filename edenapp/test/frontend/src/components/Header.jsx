import { Link } from "react-router-dom";

function Header({ isAuthenticated, handleLogout }) {
    return (
        <header>
            <div className='title-container'>
                
                <Link className ="nav-link" to="/">Return to Eden</Link>
            
            </div>

            <div className="nav-links">
        
                 <Link className='nav-link-header' to="/nativeplantrecommender">Find plants for your Eden Space!</Link>

                    {!isAuthenticated && (
                        <>
                            <Link to="/login" className="nav-link-header">Login</Link>
                            <Link to="/register" className="nav-link-header">Register</Link>
                        </>
                    )}

                    <Link className='nav-link-header' to="/garden_app"> App</Link>

                    {isAuthenticated && (
                        <>
                        <Link className='nav-link-header' to="/account">Account</Link>
                        <nav-link onClick={handleLogout} className="nav-link-header">Logout</nav-link>
                        </>
                        
                    )}
              
                </div>
        </header>
    );
}

export default Header;
