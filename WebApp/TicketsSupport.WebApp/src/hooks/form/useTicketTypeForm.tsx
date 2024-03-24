import React from "react";
import { useForm } from "react-hook-form";
import { TicketTypeFormModel } from "../../models/forms/ticketType.form";

export default function useTicketTypeForm() {


    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
        watch,
        setError,
        getValues,
        setValue,
    } = useForm<TicketTypeFormModel>({
        defaultValues: {
            name: "",
            icon: "",
            iconColor: ""
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
