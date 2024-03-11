import React, { Suspense } from "react";
import { useSelector } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { RootState } from "../../redux/store";
import { routesAuthorized, routesUnauthorized } from "../../routes/routes";
import { ProgressSpinner } from "primereact/progressspinner";

export default function RoutesGuard() {
  const authenticated = useSelector((state: RootState) => state.auth);

  function Loading() {
    return (
      <>
        <div className="absolute top-50 bottom-50 left-50 right-50">
          <ProgressSpinner />
        </div>
      </>
    )
  }

  return (
    <>
      <Suspense fallback={<Loading />}>
        <RouterProvider router={authenticated.token !== null && authenticated.token !== "" ? routesAuthorized() : routesUnauthorized()}></RouterProvider>
      </Suspense>
    </>);
}
