import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./Index.jsx";

import Register from "./components/register.jsx";
import Login from "./components/Login.jsx";
import Logout from "./components/Logout.jsx";
import Account from "./components/Account.jsx";

import Header from "./components/Header.jsx";
import Footer from "./components/footer.jsx";

import GardenDashboard from "./components/GardenDashBoard.jsx";
import GardenEditor from "./components/GardenEditor.jsx";
import Plants from "./components/Plants.jsx";
import NativePlantRecommender from "./components/NativeRec.jsx"


function ProtectedRoute({ isAuthenticated, isGuest, setIsGuest }) {
    const [promptShown, setPromptShown] = useState(false);

    if (!isAuthenticated && !isGuest && !promptShown) {
        return (
            <div className="page-container">
                <section className="title-container">
                    <h1 className="outline">Restricted Access</h1>
                </section>
                <section className="app-container">
                    <section className="content-container">
                        <h2>You must log in to access this page. Or, continue as a guest:</h2>
                        <button className="button" onClick={() => {
                            setIsGuest(true);
                            setPromptShown(true);
                        }}>
                            Continue as Guest
                        </button>
                        <button className="button" onClick={() => window.location.href = "/login"}>
                            Go to Login
                        </button>
                    </section>
                </section>
            </div>
        );
    }
    return <GardenDashboard />;
}

function AppRouter() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
    const [isGuest, setIsGuest] = useState(false);
    const [selectedGarden, setSelectedGarden] = useState(null); // Track selected garden

    useEffect(() => {
        const checkAuth = () => {
            setIsAuthenticated(!!localStorage.getItem("token"));
        };
        window.addEventListener("storage", checkAuth);
        return () => window.removeEventListener("storage", checkAuth);
    }, []);

    const handleLogout = () => {
        console.log("Logging out...");
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setIsGuest(false);
        window.location.href = "/";
    };


    return (
        <Router>
            <div className="page-container">
                                 <Header isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
                                 <Routes>
                                     <Route path="/" element={<Index />}  />
                                     <Route path="/nativeplantrecommender" element={<NativePlantRecommender />}  />
                                     <Route path="/login"  element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                                     <Route path="/register" element={<Register />} />
                                     <Route path="/logout" element={<Logout setIsAuthenticated={setIsAuthenticated} />} />
                                     <Route path="/account" element={<Account />} />
                                     <Route path="/gardens" element={<GardenEditor setSelectedGarden={setSelectedGarden} />} />
                                     <Route path="/plants/:id" element={<Plants />} />

                                     <Route
                                     path="/garden_app"
                                     element={
                                         <ProtectedRoute
                                             isAuthenticated={isAuthenticated}
                                             isGuest={isGuest}
                                             setIsGuest={setIsGuest}
                                         />
                                     }
                                 />
                                 <Route path="*" element={<Navigate to="/" />} />
                             </Routes>
                             <Footer />
                         </div>
        </Router>
    );
}

export default AppRouter;

//Test Version:
//import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import Register from "./components/register.jsx";
// import Login from "./components/Login.jsx";
// import Header from "./components/Header.jsx";
// import Footer from "./components/footer.jsx";
// import Index from "@/Index.jsx";
// import GardenDashboard from "@/components/GardenDashBoard.jsx";
// import "./styles/global.css";
// import "./styles/components.css";
// import Logout from "@/components/Logout.jsx";
// import Account from "@/components/Account.jsx";
//
// import GardenEditor from "@/components/GardenEditor.jsx";
// import Plants from "@/components/Plants.jsx";
// import TaskManager from "@/components/TaskManager.jsx";
// import Notes from "@/components/Notes.jsx";
//
//
//
// function ProtectedRoute({ isAuthenticated, isGuest, setIsGuest }) {
//     const [promptShown, setPromptShown] = useState(false);
//
//     if (!isAuthenticated && !isGuest && !promptShown) {
//         return (
//             <div className="page-container">
//                 <section className="title-container">
//                     <h1 className="outline">Restricted Access</h1>
//                 </section>
//                 <section className="app-container">
//                 <section className="content-container">
//                     <h2>You must log in to access this page. Or, continue as a guest:</h2>
//                     <button className="button" onClick={() => {
//                         setIsGuest(true);
//                         setPromptShown(true);
//                     }}>
//                         Continue as Guest
//                     </button>
//                     <button className="button" onClick={() => window.location.href = "/login"}>
//                         Go to Login
//                     </button>
//                 </section>
//                 </section>
//             </div>
//         );
//     }
//     return <GardenDashboard />;
// }
//
// function AppRouter() {
//     const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
//     const [isGuest, setIsGuest] = useState(false);
//     const [selectedGarden, setSelectedGarden] = useState(null); // ✅ Track selected garden
//
//     useEffect(() => {
//         const checkAuth = () => {
//             setIsAuthenticated(!!localStorage.getItem("token"));
//         };
//         window.addEventListener("storage", checkAuth);
//         return () => window.removeEventListener("storage", checkAuth);
//     }, []);
//
//     const handleLogout = () => {
//         console.log("Logging out...");
//         localStorage.removeItem("token");
//         setIsAuthenticated(false);
//         setIsGuest(false);
//         window.location.href = "/";
//     };
//
//     return (
//         <Router>
//             <div className="page-container">
//                 <Header isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
//                 <Routes>
//                     <Route path="/" element={<Index />}  />
//                     <Route path="/login"  element={<Login setIsAuthenticated={setIsAuthenticated} />} />
//                     <Route path="/register" element={<Register />} />
//                     <Route path="/logout" element={<Logout setIsAuthenticated={setIsAuthenticated} />} />
//                     <Route path="/account" element={<Account />} />
//                     <Route path="/gardens" element={<GardenEditor setSelectedGarden={setSelectedGarden} />} />
//                     <Route path="/taskmanager" element={<TaskManager />} />
//                     <Route path="/notes" element={<Notes />} />
//                     <Route path="/plants/:id" element={<Plants />} />
//
//                     <Route
//                         path="/garden_app"
//                         element={
//                             <ProtectedRoute
//                                 isAuthenticated={isAuthenticated}
//                                 isGuest={isGuest}
//                                 setIsGuest={setIsGuest}
//                             />
//                         }
//                     />
//                     <Route path="*" element={<Navigate to="/" />} />
//                 </Routes>
//                 <Footer />
//             </div>
//         </Router>
//     );
// }
//
// export default AppRouter;


//<Router>
//             <div className="page-container">
//                 <Header isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
//                 <Routes>
//                     <Route path="/" element={<Index />} />
//                     <Route
//                         path="/login"
//                         element={
//                             isAuthenticated ?
//                                 <Navigate to="/" /> :
//                                 <Login setIsAuthenticated={setIsAuthenticated} />
//                         }
//                     />
//                     <Route
//                         path="/register"
//                         element={
//                             isAuthenticated ?
//                                 <Navigate to="/" /> :
//                                 <Register setIsAuthenticated={setIsAuthenticated} />
//                         }
//                     />
//                     <Route
//                         path="/account"
//                         element={
//                             isAuthenticated ?
//                                 <Account isAuthenticated={isAuthenticated} /> :
//                                 <Navigate to="/login" />
//                         }
//
//                     />
//                     <Route
//                         path="/garden_app"
//                         element={
//                             isAuthenticated ?
//                                 <GardenDashboard /> :
//                                 <Navigate to="/login" />
//                         }
//                     />
//                     <Route
//                         path="/plants/:id"
//                         element={
//                             isAuthenticated ?
//                                 <Plants /> :
//                                 <Navigate to="/login" />
//                         }
//                     />
//                     <Route path="*" element={<Navigate to="/" />} />
//                 </Routes>
//                 <Footer />
//             </div>
//         </Router>