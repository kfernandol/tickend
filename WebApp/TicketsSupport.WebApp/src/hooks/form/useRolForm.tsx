import React from "react";
import { useForm } from "react-hook-form";
import { RolFormModel } from "../../models/forms/rol.form";

export default function useRolForm() {


    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
        watch,
        setError,
        getValues,
        setValue,
    } = useForm<RolFormModel>({
        defaultValues: {
            name: '',
            permissionLevel: 0,
            menus: []
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
