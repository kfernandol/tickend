import { Button } from "primereact/button";
import React from "react";
import "./buttonSubmitLogin.css";

interface props {
  label: string;
  loading: boolean;
}

function ButtonSubmitLogin(props: props) {
  return (
    <>
      <Button className="btnSubmitLogin" label={props.label} type="submit" icon="pi pi-send" loading={props.loading} />
    </>
  );
}

export default ButtonSubmitLogin;
