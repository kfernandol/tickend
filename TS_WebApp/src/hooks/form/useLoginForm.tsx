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

  return {
    control,
    handleSubmit,
    reset,
    watch,
    setError,
    errors,
  };
}
