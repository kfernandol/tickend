import { paths } from "../../routes/paths";
//componets
import LaguageSelect from "../../components/lenguajeSelect/languageSelect";
import ButtonSubmitLogin from '../../components/buttonSubmitLogin/buttonSubmitLogin';
import { Card } from "primereact/card";
//hooks
import { useEffect } from "react";
import { usePut } from "../../services/api_services";
import { useTranslation } from "react-i18next";
import { Link, useParams } from 'react-router-dom';
//models
import { BasicResponse } from "../../models/responses/basic.response";

function InviteOrganization() {
    //hooks
    const { hash } = useParams();
    const { t } = useTranslation();
    const { SendPutRequest, loadingPut } = usePut<BasicResponse>();
    //transition
    const ReturnHome = t("changePasswordSend.labels.return");
    const invitationAcceptedTitle = t("organization.labels.invitationAcceptedTitle");
    const invitationAcceptedSubTitle = t("organization.labels.invitationAcceptedSubTitle");
    //links
    const returnPage = paths.home;

    useEffect(() => {
        if (hash) {
            const data = {
                hash: hash
            }
            SendPutRequest('v1/organizations/confirm-invitation', data)
        }
    }, [hash])

    return (
        <>
            <LaguageSelect className="absolute right-0" />
            <div className="grid h-screen w-screen flex justify-content-center align-items-center">
                <Card className="col-3">
                    <div className='flex justify-content-center align-items-center w-full mt-2 mb-6'>
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFhUlEQVR4nO1be0xbVRw+PMZjoNgplIKGODeFTUqIsgtM0IyALNuIfyxLNP5h4jtz7g8y42JiFqNb3MZrMrbEReYUpm2B8XSBUqClvZRXbxxBxwbJRGc0UOKK0zroz5zblpRCH/dyHzD6JV9CAz3n933nnO+ce8JFKABxEKsYiU74rn9fvJJ8NbFmeCtaL5AqSSKmuvPHkBKVDZ38HmieUkDU+R+mpbW6o+h+RZJqMFnytYYMPq20i/bAjefa7shqyffR/YLEmuGtmy52dS8acT+IZ4RMYXwFrVU83khKH77U0xZSyky4Ox/4sn1SpuwrQGsF0jp9nF143YqEuzLolAJiLrSPx6uMuWg1p/oj3+q+2VBeP8+V8CVGnFZAzFfq0UQlKUerBbKmwY124Vfm+BLuzuASFeBAjVcNJYmnvKsrNLZGVxp2pvE/oYS7M7S0zoaX26MKwybBhYefabKKJXyJEWX189iILW1jD/KqXVrb+0FEZctdsQV7YlhFwz28HLcpRsI4FR6v0O+PrGqdFVugv4yobP6HszNE7GX9MZy+3jqUVFTB260ElBsi4bwR8UrcxzutGSCtLPNaE645rqb3+IrEpzYM5mwo8b6fY/El+mjehbuzVB9F9+2tNnz6TFD2Z7M2ILlWO+pruuGRF1q8k2+2ZPpcDpJqzRBrAx462+xzi2M77duu74FZ668wa52E1p8LWS8HX/XRuxVbhJZ4f3LDZDt6s9bfwAmL9RbrdnzVR+cXW6QqDTwZEASLYePNgLjaXvYGFE9YoEh3EyLLG9acASGldbDl6igQlHllBhRPWODd0SnYfEmzZgyIudAB6cbfafGcGFDsYL56FILdcoFJ4PkLezDuZmwAvm16rGEYCNP0gnhODSiesIBcP4mvrRgZgAUxhcX6CyMDIs+2QKru1iLhvBhAUGbIGJqCBKWRvszkzwD/dgZn0OGalhPPiQGdM1aw2mygnrEuajhZcxNO6iQ+i8TTGY8ok9H352zwuU4CT6nHPArnzIA5m72wezZY0vjOwRtwUJ3HOLzcwfT7h9TPwc4Be8rzboArPHVS1HkcKsgI3g34ggyD/R1H/BIuqAEEZYZckoQPNdt5M+CjrifheYOWkXhBDSAwTX/Ayx1vQZUx2KsY10zwlfjn+oLgtfYDkDV8m7F44Q2g7MzT1sOnPTIvwVhIC7cHnuc9/4Q2FvK1lxmLftYwCelXr0Fa86A4BhCUGbKGxuGNjiLGAefkQfULkN1/nbH4Z7pvQFrjwAJFM4BwcK+mjNGlCX7M3dd5glVfeORdxa8KAwjKDDl9A3CkU+5T/FFNCuSSBtb90NOeawPmvJwDmDCTmqa3sEoydInwqr4QOjwJ6s8V9YHXPOcGqGes8O+8DTrcToJsuUvXBJ/0JC6I/0wrhTytipO23cVzYkCx27MAF8wamoSX1Mdo4p+5apdXAw6Pc2cAX+TVgNfH7qxvAwpHZtavAQd++kt0cYIbcHjcPu3XwsjzYgCxCgQFDKACMwACS4AKZACIEoI7TGaL2KHGhBnG20vEyxv6/mZvAGU2cl2k603NcqPFNVNV+hHWBmRS5kNcine/qRGCT9d0f8zagMIxCCeoaRNXIy+0eHmdYSypuiuCtQEYmaapRC5MWO6mhm/x2y+2PYG4wLYRCNthMr9HmMwk22AUYs3Lr/TfTVX1XsPTfsUjH0AAAQQQQACMEI4QkuCXSPA7UwihFIRQOkII/69uDkIIv++zCyGUhxB60cG9Djo/5zn+JtfxnWxHGymONmWOPnBfoiMaIYQPGgRCqMBFjFAscPSNa4gSWnwaQmiPCKI9Edci6ItU8vVuAHJMOzGXQL6YSwAtA08hmOUWgpieQtD5e2cI4u/yGoL/A3qX9p8m8KuZAAAAAElFTkSuQmCC" />
                    </div>
                    {/* Header Invitation Organization */}
                    <h6 className="text-gray-900 text-3xl text-center font-normal p-0 m-2 my-2">{invitationAcceptedTitle}</h6>
                    <h6 className="text-gray-500 text-sm text-center font-light p-0 mt-2 mb-5 mx-2">{invitationAcceptedSubTitle}</h6>
                    <Link to={returnPage}>
                        <ButtonSubmitLogin label={ReturnHome} loading={loadingPut} />
                    </Link>
                </Card>
            </div>
        </>
    );
}

export default InviteOrganization;