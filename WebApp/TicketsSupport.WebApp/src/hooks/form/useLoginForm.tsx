import React from "react";
import { useForm } from "react-hook-form";
import { LoginFormModel } from "../../models/forms/login.form";

export default function useLoginForm() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setError
  } = useForm<LoginFormModel>({
    defaultValues: {
      username: "",
      password: "",
      keepLogin: false,
    },
  });

  const getFormErrorMessage = (name) => {
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
  };
}
