// import React and hooks
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
// import styles
import './Layout.css'
// import models
import { BreadCrumbModel } from "../../../models/breadcrumb/breadcrumb.model";
// import components
import Sidebar from "./Sidebar/Sidebar";
import _Header from "./Header/Header";
import Footer from "./Footer/Footer";
import BackgroundAnimated from "../../../components/backgroundAnimated/backgroundAnimated";
import { BreadCrumb } from "primereact/breadcrumb";

function Layout() {
    const [breadcrumbItems, setBreadcrumbItems] = useState<BreadCrumbModel[]>();
    const location = useLocation();
    const home = { icon: 'pi pi-home', url: '/' };

    // load element to BreadCrumb
    useEffect(() => {
        const paths = location.pathname.split('/').filter((path) => path !== '');

        const breadcrumbItems = paths.map((segment, index) => {
            const routePath = `/${paths.slice(0, index + 1).join('/')}`;

            const item: BreadCrumbModel = {
                label: segment,
                template: () => <Link to={routePath} className="no-underline text-white"><span>{segment}</span></Link>
            }
            return item;
        });

        setBreadcrumbItems(breadcrumbItems)
    }, [location])

    return (
        <>
            <BackgroundAnimated />
            <div className="container">
                <div className="Sidebar">
                    <Sidebar />
                </div>
                <header className="Header">
                    <_Header />
                </header>
                <main className="Main px-5 mt-1 mb-3">
                    <BreadCrumb className="mb-3" home={home} model={breadcrumbItems} style={{ backgroundColor: "#17212f5D" }} />
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
