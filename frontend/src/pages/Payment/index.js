import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const PaymentRedirectHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    const sendToken = async () => {
      try {
        const res = await api.post("/api/alchemy-redirect", { token });

        // Optionally redirect based on response
        if (res.data.redirectTo) {
          console.log(res.data.redirectTo);
          window.location.href = res.data.redirectTo; // hard redirect
        } else {
          navigate("/login"); // soft redirect
        }
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };

    sendToken();
  }, [searchParams, navigate]);

  return <p>Redirecting...</p>;
};

export default PaymentRedirectHandler;
