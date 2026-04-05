import {
  Briefcase,
  Building2,
  Calendar,
  Eye,
  Globe,
  Lock,
  Mail,
  MapPin,
  Shield,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterCompany } from "../../hooks/company/useRegisterCompany";
import Field from "./Field";

const RegCompanyForm = () => {
  const navigate = useNavigate();
  const { mutateAsync } = useRegisterCompany();

  const [togglePas, setTogglePas] = useState(true);
  const [toggleConfirm, setToggleConfirm] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const submitForm = async (formData) => {
    try {
      await mutateAsync({
        name: formData.companyName,
        websiteUrl: formData.website,
        industry: formData.industry,
        foundedYear: formData.foundedYear,
        employeeCount: formData.companySize,
        location: formData.location,
        description: formData.description,
        email: formData.email,
        password: formData.password,
      });

      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="card p-8 md:p-10">
      <form className="space-y-6" onSubmit={handleSubmit(submitForm)}>
        {/* Company Info */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <Building2 className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Company Information</h2>
          </div>

          {/* Company Name */}
          <Field
            label="Company Name"
            htmlFor="companyName"
            error={errors.companyName}
          >
            <span className="text-red-500">*</span>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                {...register("companyName", {
                  required: "Company name is required",
                })}
                id="companyName"
                className="input pl-10"
                placeholder="TechCorp Solutions"
              />
            </div>
          </Field>

          {/* Email */}
          <Field label="Email Address" htmlFor="email" error={errors.email}>
            <span className="text-red-500">*</span>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                {...register("email", { required: "Email is required" })}
                type="email"
                id="email"
                className="input pl-10"
                placeholder="company@email.com"
              />
            </div>
          </Field>

          {/* Website & Industry */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field
              label="Company Website"
              htmlFor="website"
              error={errors.website}
            >
              <span className="text-red-500">*</span>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  {...register("website", { required: "Website is required" })}
                  id="website"
                  className="input pl-10"
                  placeholder="https://example.com"
                />
              </div>
            </Field>

            <Field label="Industry" htmlFor="industry" error={errors.industry}>
              <span className="text-red-500">*</span>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select
                  {...register("industry", {
                    required: "Industry is required",
                  })}
                  id="industry"
                  className="input pl-10"
                >
                  <option value="">Select industry</option>
                  <option value="technology">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="retail">Retail</option>
                </select>
              </div>
            </Field>
          </div>

          {/* Size & Founded */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Company Size" htmlFor="companySize">
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select
                  {...register("companySize")}
                  id="companySize"
                  className="input pl-10"
                >
                  <option value="">Select size</option>
                  <option value="1-10">1–10</option>
                  <option value="11-50">11–50</option>
                  <option value="51-200">51–200</option>
                  <option value="200+">200+</option>
                </select>
              </div>
            </Field>

            <Field label="Founded Year" htmlFor="foundedYear">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  {...register("foundedYear")}
                  id="foundedYear"
                  className="input pl-10"
                  placeholder="2010"
                />
              </div>
            </Field>
          </div>

          {/* Location */}
          <Field
            label="Headquarters Location"
            htmlFor="location"
            error={errors.location}
          >
            <span className="text-red-500">*</span>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                {...register("location", { required: "Location is required" })}
                id="location"
                className="input pl-10"
                placeholder="City, Country"
              />
            </div>
          </Field>

          {/* Description */}
          <Field
            label="Company Description"
            htmlFor="description"
            error={errors.description}
          >
            <span className="text-red-500">*</span>
            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              id="description"
              className="textarea min-h-[120px]"
              placeholder="Tell us about your company..."
            />
          </Field>
        </div>

        {/* Security */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Account Security</h2>
          </div>

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
              label="Confirm Password"
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
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-ring"
              required
            />
            <label htmlFor="terms" className="text-sm text-muted-foreground">
              I agree to the
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>
              and
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </label>
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="verified"
              name="verified"
              className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-ring"
              required
            />
            <label htmlFor="verified" className="text-sm text-muted-foreground">
              I confirm that I am an authorized representative of this company
              and have the right to register on its behalf
            </label>
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="updates"
              name="updates"
              className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-ring"
            />
            <label htmlFor="updates" className="text-sm text-muted-foreground">
              Send me product updates, hiring tips, and promotional offers via
              email
            </label>
          </div>
        </div>

        <button className="btn btn-primary w-full text-base h-11 mt-2">
          <Building2 className="h-4 w-4 mr-2" />
          Register Company
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

export default RegCompanyForm;
