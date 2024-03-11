import React from "react";
import './_header.css'
//Models
import { AuthToken } from "../../../models/tokens/token.model";
import { RootState } from "../../../redux/store";
//componente
import { Menubar } from "primereact/menubar";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
//hooks
import { useSelector } from "react-redux";
import useTokenData from "../../../hooks/utils/useTokenData";

function _Header() {
  const authenticated = useSelector((state: RootState) => state.auth);
  const getTokenData = useTokenData<AuthToken>(authenticated?.token);

  const showMenu = () => {
    const menubar = document.querySelector("#app-sidebar-2");
    menubar?.classList.remove("hidden");
  }

  const start = (
    <>
      <Button id="btnMenu" icon="pi pi-bars" severity="info" aria-label="Bookmark" onClick={showMenu} />
    </>
  );

  const end = (
    <div className="flex align-items-center gap-2 m-1">
      <span className="text-xl">{getTokenData != null ? getTokenData.name : ""}</span>
      <Avatar className="p-1" size="large" image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" shape="circle" />
    </div>
  );

  return (
    <div>
      <div className="card">
        <Menubar start={start} end={end} style={{ backgroundColor: "#17212f2D", borderLeft: "none", borderTop: "none", borderRight: "none" }} />
      </div>
    </div>
  );
}

export default _Header;
