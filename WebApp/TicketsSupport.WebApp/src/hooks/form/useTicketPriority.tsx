import React from "react";
import { useForm } from "react-hook-form";
import { TicketPriorityFormModel } from "../../models/forms/ticketPriority.form";

export default function useTicketPriorityForm() {


    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
        watch,
        setError,
        getValues,
        setValue,
    } = useForm<TicketPriorityFormModel>({
        defaultValues: {
            name: "",
            color: ""
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
