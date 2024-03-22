import React, { useEffect } from "react";
import { Button } from "primereact/button";
import { useGet } from "../../services/api_services";

export default function Home() {
  const { SendGetRequest, authResponse, error, httpCode, loading } = useGet();

  useEffect(() => {
    SendGetRequest("v1/users");
  }, [])

  console.log(authResponse)
  return (
    <div>
      <Button label="Submit" />
    </div>
  );
}
