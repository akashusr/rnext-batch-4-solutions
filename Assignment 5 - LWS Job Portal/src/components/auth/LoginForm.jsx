import axios from "axios";
import { Eye, Lock, LogIn, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Field from "./Field";

const LoginForm = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [togglePas, setTogglePas] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const submitForm = async (formData) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/login`,
        formData
      );

      if (res.status === 200) {
        const user = res.data;
        const authToken = res.token;
        const refreshToken = null;

        setAuth({ user, authToken, refreshToken });

        localStorage.setItem(
          "auth",
          JSON.stringify({ user, authToken, refreshToken })
        );

        navigate("/");
      }
    } catch (error) {
      console.log(error);
      setError("root.random", {
        type: "random",
        message: `Invalid Email or Password or Role`,
      });
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(submitForm)}>
      <div className="space-y-2">
        <Field label="Email Address" htmlFor="email" error={errors.email}>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              {...register("email", { required: "Email is Required" })}
              className={`input pl-10 ${
                errors.email ? "border-red-500" : "border-gray-200"
              }`}
              name="email"
              type="email"
              id="email"
              placeholder="you@example.com"
            />
          </div>
        </Field>
      </div>
      <div className="space-y-2">
        <div className="relative">
          <Field label="Password" htmlFor="password" error={errors.password}>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                className={`input pl-10 pr-10 ${
                  errors.password ? "border-red-500" : "border-gray-200"
                }`}
                name="password"
                type={togglePas ? "password" : "text"}
                placeholder="Enter your password"
                id="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password should be at least 6 character long",
                  },
                })}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setTogglePas((p) => !p)}
              >
                <Eye className="h-4 w-4 cursor-pointer"></Eye>
              </button>
            </div>
          </Field>
        </div>
      </div>

      <Field label="Role" htmlFor="role" error={errors.role}>
        <select
          id="role"
          {...register("role", { required: "Role is required" })}
          className={`input w-1/3 ${
            errors.role ? "border-red-500" : "border-gray-200"
          }`}
        >
          <option value="USER">User</option>
          <option value="COMPANY">Company</option>
        </select>
      </Field>

      <p className="text-red-500 p-2 text-sm">
        {errors?.root?.random?.message}
      </p>
      <button className="btn btn-primary w-full text-base h-11">
        <LogIn className="mx-3 w-5 h-5" /> Login
      </button>
    </form>
  );
};

export default LoginForm;
