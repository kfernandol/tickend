import { useState } from "react";
import { PostAsync } from "../../../services/api_services";
import { AuthRequest } from "../../../models/requests/auth/auth.request";

export default function useAuthPost() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const requestAuth = async (data: AuthRequest) => {
    setLoading(true);

    try {
      const response = await PostAsync("/api/v1/auth/token", data);
      setUser(response.data);
    } catch (error) {
      // manejar error
    }

    setLoading(false);
  };

  return {
    user,
    loading,
    requestAuth,
  };
}
