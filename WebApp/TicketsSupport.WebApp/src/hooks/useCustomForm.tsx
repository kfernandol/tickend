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
        return error ? (
            <small className="p-error">{`${error.message}`}</small>
        ) : (
            <small className="p-error"></small>
        );
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
