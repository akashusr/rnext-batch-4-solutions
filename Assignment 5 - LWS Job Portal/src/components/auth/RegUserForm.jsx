import { Calendar, Eye, Lock, Mail, Phone, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useRegister } from "../../hooks/useRegister";
import Field from "./Field";

const RegUserForm = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const { mutateAsync } = useRegister();

  const [togglePas, setTogglePas] = useState(true);
  const [toggleConfirm, setToggleConfirm] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm();

  const submitForm = async (formData) => {
    try {
      const res = await mutateAsync({
        role: "USER",
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        experience: formData.experience,
        password: formData.password,
      });

      navigate("/login");
    } catch (err) {
      setError("email", {
        message: err?.response?.data?.message || "Registration failed",
      });
    }
  };

  return (
    <div className="card p-8 md:p-10">
      <form className="space-y-5" onSubmit={handleSubmit(submitForm)}>
        {/* Name */}
        <Field label="Name" htmlFor="name" error={errors.name}>
          <span className="text-red-500">*</span>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              {...register("name", { required: "Name is required" })}
              type="text"
              id="name"
              className="input pl-10"
              placeholder="John"
            />
          </div>
        </Field>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Email Address" htmlFor="email" error={errors.email}>
            <span className="text-red-500">*</span>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                {...register("email", { required: "Email is required" })}
                type="email"
                id="email"
                className="input pl-10"
                placeholder="example@gmail.com"
              />
            </div>
          </Field>

          <Field label="Phone Number" htmlFor="phone" error={errors.phone}>
            <span className="text-red-500">*</span>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                {...register("phone", { required: "Phone is required" })}
                type="tel"
                id="phone"
                className="input pl-10"
                placeholder="+ 1(555) 000-0000"
              />
            </div>
          </Field>
        </div>

        {/* Experience */}
        <Field
          label="Years of Experience"
          htmlFor="experience"
          error={errors.experience}
        >
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <select
              {...register("experience", {
                required: "Experience is required",
              })}
              id="experience"
              className="input pl-10"
            >
              <option value="">Select experience level</option>
              <option value="entry">Entry Level (0-2 years)</option>
              <option value="mid">Mid Level (3-5 years)</option>
              <option value="senior">Senior (6-10 years)</option>
              <option value="expert">Expert (10+ years)</option>
            </select>
          </div>
        </Field>

        {/* Passwords */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Password" htmlFor="password" error={errors.password}>
            <span className="text-red-500">*</span>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                {...register("password", {
                  required: "Password required",
                  minLength: { value: 8, message: "Minimum 8 characters" },
                })}
                type={togglePas ? "password" : "text"}
                id="password"
                className="input pl-10 pr-10"
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => setTogglePas(!togglePas)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </Field>

          <Field
            label="Password"
            htmlFor="confirmPassword"
            error={errors.confirmPassword}
          >
            <span className="text-red-500">*</span>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                {...register("confirmPassword", {
                  validate: (v) =>
                    v === watch("password") || "Passwords do not match",
                })}
                type={toggleConfirm ? "password" : "text"}
                id="confirmPassword"
                className="input pl-10 pr-10"
                placeholder="Re-enter your password"
              />
              <button
                type="button"
                onClick={() => setToggleConfirm(!toggleConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </Field>
        </div>

        <button className="btn btn-primary w-full text-base h-11 mt-2">
          Create Account
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="text-primary hover:underline font-medium">
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default RegUserForm;
