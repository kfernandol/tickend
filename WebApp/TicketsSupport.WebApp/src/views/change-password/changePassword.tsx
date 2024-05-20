import { useEffect, useRef, useState } from 'react'
//componets
import LaguageSelect from "../../components/lenguajeSelect/languageSelect";
import ButtonSubmitLogin from '../../components/buttonSubmitLogin/buttonSubmitLogin';
import { Controller } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Link, useParams } from 'react-router-dom';
import { paths } from '../../routes/paths';
import { Toast } from 'primereact/toast';
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
//hooks
import useCustomForm from '../../hooks/useCustomForm';
import { useTranslation } from 'react-i18next';
import { usePut } from '../../services/api_services';
//models
import { BasicResponse } from '../../models/responses/basic.response';
import { ChangePasswordForm } from '../../models/forms/changePassword.form';
import { ChangePasswordRequest } from '../../models/requests/changePasswork.request';
import { Card } from 'primereact/card';

export default function ChangePassword() {
    const toast = useRef<Toast>(null);
    const { hash } = useParams();
    const [SendRequest, setSendRequest] = useState(false);
    //hooks
    const { ErrorMessageHtml, control, errors, handleSubmit, getValues } = useCustomForm<ChangePasswordForm>({ password: '', confirmPassword: '' });
    const { SendPutRequest, httpCodePut, loadingPut, putResponse } = usePut<BasicResponse>();

    //Translate
    const { t } = useTranslation();
    const ErrorRequired = t('errors.required');
    const ErrorMaxCaracter = t('errors.maxLength');
    const ErrorMinCaracter = t('errors.minLength');
    const ErrorNoMatch = t("errors.noMatch");
    const Title = t("changePassword.title");
    const Submit = t("changePassword.labels.submit");
    const Password = t("changePassword.labels.password");
    const ConfirmPassword = t("changePassword.labels.confirmPassword");
    const ErrorChangePassword = t("changePassword.errors.changePassword");
    //request sending
    const TitleSend = t("changePasswordSend.title");
    const SubTitleSend = t("changePasswordSend.subTitle");
    const ReturnHome = t("changePasswordSend.labels.return");
    //Links
    const returnPage = paths.home;

    const onSubmitResetPassword = (formData: ChangePasswordForm) => {
        if (hash) {
            const request: ChangePasswordRequest = {
                hash: hash,
                password: formData.password
            }
            SendPutRequest("v1/auth/change-password", request);
        }
    }

    useEffect(() => {
        if (httpCodePut === 200) {
            const response = putResponse as BasicResponse;

            if (response.success === false)
                toast?.current?.show({ severity: 'error', summary: Title, detail: <ul id='errors-toast' className='pl-0'>{ErrorChangePassword}</ul>, life: 50000 });
            else
                setSendRequest(true);
        }
    }, [httpCodePut, putResponse])

    return (
        <>
            <Toast ref={toast} />
            <LaguageSelect className="absolute right-0" />
            <div className="grid h-screen w-screen flex justify-content-center align-items-center">
                <Card className="col-3">
                    {SendRequest === false ?
                        <>
                            <Link to={returnPage} className='absolute'>
                                <i className='pi pi-chevron-left' style={{ color: '#fff' }}></i>
                            </Link>
                            <div className='flex justify-content-center align-items-center w-full mt-2 mb-6'>
                                <img src="data:image/png;base64,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"></img>
                            </div>
                            {/* Header Restore password */}
                            <h6 className="text-gray-900 text-3xl text-center font-normal p-0 m-2 my-2">{Title}</h6>
                            {/* Form Restore password */}
                            <div className="flex justify-content-center">
                                <form onSubmit={handleSubmit(onSubmitResetPassword)} className="w-11 flex flex-column gap-1 align-items-center mt-1">
                                    {/* Password Input */}
                                    <div className='col-12 p-0 mt-3'>
                                        <Controller
                                            name="password"
                                            control={control}
                                            rules={
                                                {
                                                    required: ErrorRequired,
                                                    maxLength: {
                                                        value: 50,
                                                        message: ErrorMaxCaracter.replace("{{0}}", "50")
                                                    },
                                                    minLength: {
                                                        value: 5,
                                                        message: ErrorMinCaracter.replace("{{0}}", "5")
                                                    }

                                                }}
                                            render={({ field, fieldState }) => (
                                                <>
                                                    <label className="align-self-start block mb-1">{Password}</label>
                                                    <IconField iconPosition="left" className="w-full">
                                                        <InputIcon className="pi pi-key"> </InputIcon>
                                                        <InputText id={field.name}
                                                            value={field.value}
                                                            type='password'
                                                            className={classNames({ 'p-invalid': fieldState.error }) + " w-full p-inputtext-lg"}
                                                            onChange={(e) => field.onChange(e.target.value)} />
                                                    </IconField>
                                                    {ErrorMessageHtml(field.name)}
                                                </>
                                            )}
                                        />
                                    </div>

                                    {/* Password Input */}
                                    <div className='col-12 p-0 mb-2'>
                                        <Controller
                                            name="confirmPassword"
                                            control={control}
                                            rules={
                                                {
                                                    required: ErrorRequired,
                                                    maxLength: {
                                                        value: 50,
                                                        message: ErrorMaxCaracter.replace("{{0}}", "50")
                                                    },
                                                    minLength: {
                                                        value: 5,
                                                        message: ErrorMinCaracter.replace("{{0}}", "5")
                                                    },
                                                    validate: (value) => {
                                                        const { password } = getValues();
                                                        return password === value || ErrorNoMatch.replace("{{0}}", Password);
                                                    }
                                                }}
                                            render={({ field, fieldState }) => (
                                                <>
                                                    <label className="align-self-start block mb-1">{ConfirmPassword}</label>
                                                    <IconField iconPosition="left" className="w-full">
                                                        <InputIcon className="pi pi-key"> </InputIcon>
                                                        <InputText id={field.name}
                                                            value={field.value}
                                                            type='password' className={classNames({ 'p-invalid': fieldState.error }) + " w-full p-inputtext-lg"}
                                                            onChange={(e) => field.onChange(e.target.value)} />
                                                    </IconField>
                                                    {ErrorMessageHtml(field.name)}
                                                </>
                                            )}
                                        />
                                    </div>


                                    <ButtonSubmitLogin label={Submit} loading={loadingPut} />
                                </form>

                            </div>
                        </>
                        :
                        <>
                            <div className='flex justify-content-center align-items-center w-full mt-2 mb-6'>
                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAARVUlEQVR4nO2dd1wUV9fHDyJiwa4o2EDFLuzYYok9xhY1JuoMKmo09hiTaNRURI0xRp9ojC0WAsqMvcQaC0GN+rEQFQvYsFFEFHCe90ny5lXP8zmTXZwts8wuIBff/X0+vz+ABc4937n3ztw2AC655JJLLrnkkqLQIevKzAqJ4EKHhxu+HRpZ6p/vuvTCFTY8vN3MkIhDM4dFPAsbFonkmcMinoSFRPwaGhLRy4XkBWpmSMRXYSGRT00gLD1lwGKc2PerX0LHrCzpApP/MKZogVB7Or8U+7Z+5wQADAGAEi4w+aDQkaLvzJDIv82SPzwS187ehxsW/YrzJ2y0AvNO79DXAOBbAKjrgpLHmjksMlSd7HljJbyTkIYm/fXH3xj+1X5LKN8DgAcAiADgasLyUmEhkUfUyT657zJaKjnxoRmQmcMifjb+eg8AmJKnAf1/U9PBUeWbD1nn02JwVO1AQeS+CIm8pU52yq2HVkCe/N8TpRkzfebzkMg/Jw1dd2d8cHhK5UoBf3UNjrplEMRUjpcyOUFCkw2CmEXfNwhiLMdLmzlemmvgpZ6BL+OttGHgpkaG4KgJHC8tMPDSMU4Q/61KxB8cL2WYWRD/aiVI2H+wiIOGROHwoetxeghd7eb9w/W4ZCsg1GxpdfTe5arj2N6zsEfnqejXagz6NB2I3vV7YQX/Dli2WnP0qlwfS1bwV+zl3QjLVW+JFWt3flqlYb947wa9vwAoWw4Ks7jB62txgniQE8Rn6qsxJ3cMlvATHXdS4sLDiM/MgRzffUnz880DOmFtn8aKfX2aYLkarc1ctnoLBUSJcrWwqKcXAoCZ3Yq4PyviXiIGAEYVuv6IE8RAAy+lqxPdpO9S9GszCet2/gwb9JiHTfotRwO/3grIpJB1OcIwecvSo0q/kZEm45HtF3D2O/p+l2pbmxwujMC31mC918LQNygYy/gEoZubuxpQCgAEQ2FQo4GbvDhBvJrdLA2KRN9AHmu2GouGQevsJqGZIGGoThi5dZ/Bou5aq1xQ/Zajb6BAteepCswSAHADlmUQxE+yYfBRWMGvPTboPk93wUNfEJCBg6McAvK85qzGUhUDUlRQFgGraj5mpQfHS2mm4Ks07It+bSc7VOBPHWiycuP+Q5wD8s+Ftv5ZUQ+vgyoobwOLaiaIXUxBN3pjMZaqVN/hws54QUBec7KGmNz0rVXLAeCmEUgyk0M0nCDONwVcsU4X9Gsz0aogbYdvwu+jYvHImVt49tK9bJ+PT8KrifdxZdiefIcxZ1QU7o25ijsOJ2DU7ku4aut5XCLG4qyVJ/G9r6NRmL4Xu4zeZr+WCOINAAhR1ZIxwJoMgnjon458HRb1LI2Bb60yK0TrYRuV5MuyrOmYnefyHcieyJN2YzA59vI95Kft1YTS6I15NQEg0wjkOLAm5SlYkLBup0+wRHk/qwLM+THnRDxKz8TFU7bmG4zVYXsw41GmLiDk20npSq22BSSIl14HgE1GIHT3VRoY69CfUqA+TQdg+VrtrAqwO+aariSk3E3DjUt+xW/GbcgzEPPGSbhfPOUQDJPHzTlku9kKjnoXAL5QNVudgRVxguhrCrRstRZYpVE/qwLsirnqcDKS76ThvVv3MTEhCW9cvqv4SmwiXjx9Q3Hs0QQ8GxOv+Pi+OMW/7bmAh7fG4tFd5/FM9BW8GncHMzOyHP7fJo+ZdVCrHwkFgAEqIJ8AK2o6cFN9U6DFy9bAaoahVgXYciDe6aTIBeiuY2x38AZBnEfXogpIJLAiw6ANQaZAaSyoevMRVgWgu5qCTq7shLX6EAMvfQcAASogvwArai6Ir5jusADcsGbL0VYF2HNEXx8iM+Y2w2wD4QRxGQBUVwE5D6woiJc6UZCN+/6gBFfrlfFWBfjltxsvFRADL60BgIoqIEnAijhB7EFB1u82RwnOr+0kqwIcPnmzwJMrO2F6ftIAsg4AvFVAMoAVNRPE/hRknQ7TlOD8231gVYCY04kvFRBOECMAwEcF5H+BFRkEMZiCpJrxTw1536oAx3+/XUiBbNK6y1pr0YeQ3YEFGQRxOAVJnbnSh7S2Hsc6deHuSwWE46VVxiVGaiCewIKCeGkEBVmNCzF26uOsChB7KanAkys74VdCNDv1FfQIZgGkJFNAaPEABWbrtpdGdF8mIBwvLQWAVyyAlGYKSJWGfZTAarQYaVWAS9dSCymQjVp9CE3hdrIAUhZYAlIpoJsSWPVmw60KQPMdLxMQjpcWAEBPCyD0XMIOkAr+HZXAbI1l3bidVuDJlZ1wq6GaNWQOALxlAaQysASkfM22SmC0QsOyALfvpedJgtLSk/DEhV248dA3uGzbJFy6dSIu3jQa1+2fiftOrMb4xDP4WH6c/0B4iYbeh1oAqQosiBPEkRQkrQKkwHyaDLAqQFLqo1wl5l7qDVy/PwxnrOiCU5e+atezf+qPW6IXYMKts7kG0nKIJpCpADCByRpCkzUUZOmqTZXAqjbqb1WA+w8cnxySZVm52vefDNcFwpZ/2DoBr94+l+dAOF56DwBmWAApDyyoGS+NoSBpjSwF5t2gj1UBHjoxW5eR+QhX75rmFAi1py/vpEB1BkiLIRvszRjOZfK2lxPEcRQkLVZWgNTvaVWArCzH2vWsrExcsePDXMNQm5qxvALCCSL1Hz9YAGFjOVAzQZxIQRYvU10JjG5/1cE3D97gcCK2RC/IUxgmHzgVkTdAgqPeNs4SqoHQBqGCFyeIkyjIYqW8lcAq1ulsFjy1w44k4eL1E/jxsg75AoSar2sO9CnNB2s2WbTjd4cFEDbW+jYTxA8oSI/i5ZTAKvh1MAueHq4c6cT/tWFkvsAw+fvNY/UDCbYNhFZqAkC0CsYTYEUcL31EQbp7lFSCo+cRdfA0Yqo3AXHXfstXGCZTLcwNEC44qg0AxKqA/AWsiO7JKUi3IkWV4MrVaGUWPC0U0Atk/f4wp5NMt8a7ji3Dg6fXYVh4P7ufjdz3pa54mgXb6tAlpK12AHBdBeR/gBVxvDSd48XstrRstWZmwbcbsVk3kLC1fZ2CMW15R4y9cij779y4G4czVnTW/PwXq3ri48dZTgNpHhzVAADSVECygKV9IUEDfsoGUqZqoFnw7d/ZogtGUmpijh2yre9/vLQ9Hju3zervLdr4rt2/l3jvco4x2b7lVZaS+gHAnyogD4EVcbz0WdP+P2YD8fJubBZ8x1Fbdd9dTdW4+n9PiFY6/NOX9uNnP75u9vNdv62w+lspaXfw05Xd7AI5e+Wg00Dq9phnOX17H1gRDbSZlgApQCqb7w3pPFofkDNXDthM3PpfZpl9jm5bTU3byp0fWTU99PWybe/n2MwdPWc/rsePtYF4B3StbQGE9omwIY6XZjbq/a/s4EpVCjALvutY6+ZEtuHY+MM2E7cleqHVZ++mXMfl2yfjg4cpVj/bd3KNrn7n2Hn7cWVkZmkCKeZVsYEFkNvAijhBDGvQ45vs4EpWqGMWfLdx23UBiU88YzNx1PToae/JV26e0uxrLK2+CbBlGn/TGFik7QdBFkBoRxUbosmaet1mq4D4mxWg+/gdupL54GGKZvIWbx6DGZn251RuJydg6Jo3dN+Z3UqyvwA8Ld02EIMg/gcAWlsAoVtgNkTHUQR0+SI7ONqAry5Ajwn6gMiyjPPWB2sm8PvN4zD9ke2p4PsP7uHX63jdMAhcThNZqWkZWgOLj4z7QdRArgFL+wvrdJyeHRxtSVAXoNd7+oFsi/nObiK/2zjKqt8gSAulEbphkKUDX+UYS1LqQ60akgoAvSyAXAVWZBDEhf6vfvgcSJlqZgXoPWmnbiCJ9y4rzxX2kjk/aigm3b+ZDcOZsS89A4x3ktO1gNw1bodWA4kHVsQJ4iLadWsKzrN0VbMC9J38s24gsizjml3Tc0woPYus2jlVma51FMaqn6fquzjuPrANhJdu2phPvwKsiNYo1Ww55jkQL2+zAvT7wDEgt5MTcMaKrg4nWo8JJM3P64mDVspo9CFXjVuh1UAuAyuizSu0a8oUXLGSlXIFRJZljD4j5TmMacs64KlL+3THcDVRAwgvXQKAyRZALgIr4njpx2qGwdnBeZSoYFaAPu87DkRWZg0X5hkMmvCKidU/6ky+ciNVC8g5Gwsc4oAV0W4i2g6dDaR4ObMCvPG+/k5dVpluS2mcKrezh5+v6q6MAjj6/y9dS9HqQ87QyYMWQC4AK+J46acqDftlB0cnOZjf9joHRDb6wrVjdp9PNGvF0vYYvuczTE5zbm/K+fhkLSB0DO18CyBUa9gQbe+qXK9ndnDuxUqZFaDnRP3PIbKGM7My8ETcLlyyZbzSF9gDQQOPtLJR73CLln+/nKR123vEeF6WGsjvwIoMgihVqtv1ORCPEk4/qcs6/OBhKp5L+BUPnV6P22MWK95zfBUev7ATb969qGviSY/pbBaNGnIYAFZbAKHpXDbECeImWthgCq6Iu6f5WFYeA5FfkE/F3dUAIu4HgCgLIGeBFRkEcWv5mq2zg3Mr4uHU4KLMmE+cu6PVZO0CgK0WQKijZ0OcIO4wLbRWgLi5OzX8LjPmY2dvaz0Y0nqsfRZATgEroiuGTu9UB+jMBJXMmGNO37IH5DCzQDhe2k3n3qoDpEMws4GMKZxAok8lanXqOwHgqAWQ08CKOF7aU6pSPXMgqmNh9c6py4z50MmbWkDoXPkTLPche0tWqG0GhJYFObrqRGbMdD6LnU79NLvPIbz0M80SqgOk06FNBegwUt+6LJkx7z16XWssa7fFMlK2TgMy8NIWmpRSB0jrtNSr32lJTUEnWHbQdAqeBpA9RgDMjvaKnl5VzYA0eXO5WSHoQMmCTrDsoHdGJ2g1WVuNo7tsTlBxghherFRlMyCN+y4xKwRV/4JOsOygtx1KsHc000Wm59RpllAdYMNe35oV4oP5MQWeYNlBh++I06ohK401Ql1mOlyZne0Ipu1sJtd7baZZIWgVOT1oFXSSZQc8ZeEReyeS0gly6jLTLCIb4oKj+pSsWMcMiH+7D60K0nHUFuWYcZmBZOdkOk7KzikOwcb9IGw+qQcN3FSN3lKjDtA3yPo0B1NNmTg3WjlhLv2hc3vX89PJ9x/h2u1x2HaE1uGXEvp3nEqv5DMrLwDQswk7qujf8ZE6QFunW1u65ZCNOOjjvTh+zmGcsfgofrnsOH659Dh+tCBG06PDDuLoWbZNZ7XnZPp/NINpMk0vm35GX2tt0FHd8mYULe7V0QYQOj+LHVUO6E5XyPNp3OJlaRAuRyhcobNIE1Mf2wDyEbAkL5+gdpZBBnQ179hfCg/a0AEAjtgAQouvmZJbEXfPf6uDpCH5Ak+gkHc2jmEF2oBB5S4GDGqRZbD0QrCXAgYvxRu3sVkOKpLpQEwmVQcA/lYHS7OHNVq+W6j7EwMvHfNt8GY9ADhgAwa5JTCshbaC9vJuiHU6zkDaPs0xkOQczUtPG7+57Eyl+r3oxB868FLWgLEXGJencbLGVvDoUbKCchRgjRajlE6/cZ/FyvsOc0pQ4NtrldfWNem3THnpWKPe32H91+cqrtv5c6zb+VOs3X4q+rebrLzEkmol2Tcw+IlP00F/VGnY90/vgJ5ypbrdssrXav+4fM226aWrGh6Vrtr0vlflhiklyvmlepb2TS7qWea+m7tHhvGkaszB6QBQCwqBKtkYns7Jz4q4e/zhRi5S9D9ubu56ElKQphrzKhQi0duWIxhIHOaDaWSXjtYolOps7AyfMZBIzKVpK9t0Zk6wzqXonPSvjf3LEwaSm5Np63OK8Qim2QBAb2UrCi+pSgMAnTdlOrcwHAC2AcBB43qnszZ8UOVtxlfWkX8CgJVG0wLoeUbPNV7NJo8z7noiDwGAgUZ3BwAaLKQn8OYAUN/41gM2TodzySWXXHLJJZdccsklKLT6LxCASUHYJPF1AAAAAElFTkSuQmCC" />
                            </div>
                            {/* Header Restore password */}
                            <h6 className="text-gray-900 text-3xl text-center font-normal p-0 m-2 my-2">{TitleSend}</h6>
                            <h6 className="text-gray-500 text-sm text-center font-light p-0 mt-2 mb-5 mx-2">{SubTitleSend}</h6>
                            <Link to={returnPage}>
                                <ButtonSubmitLogin label={ReturnHome} loading={loadingPut} />
                            </Link>
                        </>
                    }
                </Card>
            </div>
        </>
    )
}
