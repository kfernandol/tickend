import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
//css
import './_layout.css'
//BreadCrumb
import { BreadCrumb } from "primereact/breadcrumb";
const home = { icon: 'pi pi-home', url: '/' };
import { BreadCrumbModel } from "../../../models/breadcrumb/breadcrumb.model";
//Components
import Sidebar from "../sidebar/sidebar";
import _Header from "../header/_header";
import Footer from "../footer/footer";
import BackgroundAnimated from "../../../components/backgroundAnimated/backgroundAnimated";
//hook
import { useLocation } from "react-router-dom";

function _Layout() {
  const [breadcrumbTtems, setBreadcrumbItems] = useState<BreadCrumbModel[]>();
  const location = useLocation();

  //Load BeradcrumbItems
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
        <main className="Main px-5 mt-1">
          <BreadCrumb className="mb-3" home={home} model={breadcrumbTtems} style={{ backgroundColor: "#17212f5D" }} />
          <Outlet />
        </main>
        <footer className="Footer">
          <Footer />
        </footer>
      </div>
    </>
  );
}

export default _Layout;
