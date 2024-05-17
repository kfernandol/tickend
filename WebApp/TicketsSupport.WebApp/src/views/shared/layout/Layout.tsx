// import React and hooks
import { Outlet } from "react-router-dom";
// import styles
import './Layout.css'
// import components
import Sidebar from "./Sidebar/Sidebar";
import _Header from "./Header/Header";
import Footer from "./Footer/Footer";

function Layout() {
    return (
        <>
            <div className="container layout-container layout-light layout-colorscheme-menu layout-static p-ripple-disabled">
                <div className="Sidebar">
                    <Sidebar />
                </div>
                <header className="Header">
                    <_Header />
                </header>
                <main className="Main px-5">
                    <Outlet />
                </main>
                <footer className="Footer">
                    <Footer />
                </footer>
            </div>
        </>
    );
}

export default Layout;
