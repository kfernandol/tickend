import React from "react";
import { useForm } from "react-hook-form";
import { MenuFormModel } from "../../models/forms/menu.form";

export default function useMenuForm() {


    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
        watch,
        setError,
        getValues,
        setValue,
    } = useForm<MenuFormModel>({
        defaultValues: {
            name: "",
            url: "",
            icon: "",
            parentId: 0,
            position: 0,
            show: false,
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
