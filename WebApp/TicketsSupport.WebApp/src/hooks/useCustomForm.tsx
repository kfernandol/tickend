import React from "react";
import { DefaultValues, FieldValues, useForm } from "react-hook-form";

export default function useCustomForm<T extends FieldValues>(defaultValues: DefaultValues<T>) {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
        watch,
        setError,
        getValues,
        setValue
    } = useForm<T>({ defaultValues });

    const ErrorMessageHtml = (name: keyof T) => {
        const error = errors[name];
        return error ? <small className="p-error">{error.message?.toString()}</small> : <small className="p-error">&nbsp;</small>;
    };

    return {
        control,
        handleSubmit,
        reset,
        watch,
        setError,
        getValues,
        setValue,
        errors,
        ErrorMessageHtml,
    };
}
