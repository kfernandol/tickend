import { useForm } from "react-hook-form";
import { UserFormModel } from "../../models/forms/user.form";

export default function useUserForm() {


    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
        watch,
        setError,
        getValues,
        setValue,
    } = useForm<UserFormModel>({
        defaultValues: {
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            rolId: -1,
        },
    });

    const getFormErrorMessage = (name: string) => {
        return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>;
    };

    return {
        control,
        handleSubmit,
        reset,
        watch,
        setError,
        errors,
        getFormErrorMessage,
        getValues,
        setValue
    };
}
