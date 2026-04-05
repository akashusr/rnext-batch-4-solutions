import {
  Building2,
  Camera,
  ChevronRight,
  CreditCard,
  Phone,
  Save,
  Settings,
  Share2,
  Shield,
  Upload,
} from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Field from "../../components/auth/Field";
import SideStats from "../../components/company/SideStats";
import { useCompanyProfile } from "../../hooks/company/useCompanyProfile";
import { useUpdateCompanyProfile } from "../../hooks/company/useUpdateCompanyProfile";
import { useUploadCompanyLogo } from "../../hooks/company/useUploadCompanyLogo";
import { normalizeUrl } from "../../utils";

const CompanySettings = () => {
  const navigate = useNavigate();
  const { mutateAsync: updateCompany } = useUpdateCompanyProfile();
  const { data, isLoading } = useCompanyProfile();
  const { mutate: uploadLogo } = useUploadCompanyLogo();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!data?.data) return;

    const company = data.data;

    reset({
      name: company.name,
      industry: company.industry,
      employeeCount: company.employeeCount,
      websiteUrl: company.websiteUrl,
      foundedYear: company.foundedYear,
      description: company.description,
      city: company.city,
      state: company.state,
      country: company.country,
      phone: company.phone,
      hrEmail: company.hrEmail,
      infoEmail: company.infoEmail,
      linkedin: company.socialLinks?.linkedin,
      twitter: company.socialLinks?.twitter,
      facebook: company.socialLinks?.facebook,
      instagram: company.socialLinks?.instagram,
    });
  }, [data, reset]);

  // 🔹 Submit handler
  const onSubmit = async (formData) => {
    try {
      const payload = {
        name: formData.name,
        industry: formData.industry,
        description: formData.description,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        location: `${formData.city}, ${formData.state}, ${formData.country}`,
        phone: formData.phone,
        websiteUrl: normalizeUrl(formData.websiteUrl),
        employeeCount: formData.employeeCount,
        foundedYear: Number(formData.foundedYear),

        hrEmail: formData.hrEmail,
        infoEmail: formData.infoEmail,

        socialLinks: {
          linkedin: normalizeUrl(formData.linkedin),
          twitter: normalizeUrl(formData.twitter),
          facebook: normalizeUrl(formData.facebook),
          instagram: normalizeUrl(formData.instagram),
        },
      };

      // 🧹 remove empty fields (API expects partial updates)
      Object.keys(payload).forEach(
        (key) => payload[key] === "" && delete payload[key]
      );

      Object.keys(payload.socialLinks).forEach(
        (key) =>
          payload.socialLinks[key] === "" && delete payload.socialLinks[key]
      );

      if (Object.keys(payload.socialLinks).length === 0) {
        delete payload.socialLinks;
      }

      await updateCompany(payload);
      navigate("/company-profile");
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadLogo(file);
  };

  if (isLoading)
    return <h1 className="text-center text-8xl font-bold">Loading...</h1>;

  return (
    <main className="container mx-auto px-4 py-8">
      {/* <!-- Page Header --> */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-[hsl(var(--color-muted-foreground))] mb-2">
          <Link
            to="/company-dashboard"
            className="hover:text-[hsl(var(--color-primary))]"
          >
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4"></ChevronRight>
          <span className="text-[hsl(var(--color-foreground))]">
            Company Settings
          </span>
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">Company Settings</h1>
          <p className="text-[hsl(var(--color-muted-foreground))]">
            Manage your company profile and preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* <!-- Settings Navigation --> */}
        <aside className="lg:col-span-1">
          <div className="card p-4">
            <nav className="space-y-1">
              <a
                href="#company-info"
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium bg-[hsl(var(--color-accent))] rounded-md"
              >
                <Building2 className="h-4 w-4"></Building2>
                Company Info
              </a>
              <a
                href="#contact"
                className="flex items-center gap-3 px-3 py-2 text-sm text-[hsl(var(--color-muted-foreground))] hover:bg-[hsl(var(--color-accent))] hover:text-[hsl(var(--color-foreground))] rounded-md transition-colors"
              >
                <Phone className="h-4 w-4"></Phone>
                Contact Details
              </a>
              <a
                href="#social"
                className="flex items-center gap-3 px-3 py-2 text-sm text-[hsl(var(--color-muted-foreground))] hover:bg-[hsl(var(--color-accent))] hover:text-[hsl(var(--color-foreground))] rounded-md transition-colors"
              >
                <Share2 className="h-4 w-4"></Share2>
                Social Media
              </a>
              <a
                href="#preferences"
                className="flex items-center gap-3 px-3 py-2 text-sm text-[hsl(var(--color-muted-foreground))] hover:bg-[hsl(var(--color-accent))] hover:text-[hsl(var(--color-foreground))] rounded-md transition-colors"
              >
                <Settings className="h-4 w-4"></Settings>
                Preferences
              </a>
              <a
                href="#billing"
                className="flex items-center gap-3 px-3 py-2 text-sm text-[hsl(var(--color-muted-foreground))] hover:bg-[hsl(var(--color-accent))] hover:text-[hsl(var(--color-foreground))] rounded-md transition-colors"
              >
                <CreditCard className="h-4 w-4"></CreditCard>
                Billing
              </a>
              <a
                href="#account"
                className="flex items-center gap-3 px-3 py-2 text-sm text-[hsl(var(--color-muted-foreground))] hover:bg-[hsl(var(--color-accent))] hover:text-[hsl(var(--color-foreground))] rounded-md transition-colors"
              >
                <Shield className="h-4 w-4"></Shield>
                Account Security
              </a>
            </nav>
          </div>

          {/* <!-- Quick Info Card --> */}
          <SideStats date={data?.data?.createdAt} />
        </aside>

        {/* <!-- Settings Content --> */}
        <form
          className="lg:col-span-3 space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Company Information */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-6">Company Information</h2>

            {/* Logo (NOT IMPLEMENTED as requested) */}
            <div className="mb-6">
              <label className="label mb-2">Company Logo</label>
              <div className="flex items-start gap-6">
                <div className="relative">
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}${data?.data.logoUrl}`}
                    alt={`${data?.data.name} logo`}
                    className="h-16 w-20 rounded-xl object-fit"
                  />
                  <button className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-[hsl(var(--color-primary))] text-[hsl(var(--color-primary-foreground))] flex items-center justify-center shadow-lg hover:bg-[hsl(var(--color-primary))]/90">
                    <Camera className="h-4 w-4"></Camera>
                  </button>
                </div>
                <div className="flex-1">
                  <input
                    required
                    type="file"
                    id="logoUpload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                  <label
                    htmlFor="logoUpload"
                    className="btn btn-outline cursor-pointer"
                  >
                    <Upload className="h-4 w-4 mr-2"></Upload>
                    Upload Logo
                  </label>
                  <p className="text-xs text-[hsl(var(--color-muted-foreground))] mt-2">
                    Recommended size: 200x200px. Max file size: 2MB. Supported
                    formats: JPG, PNG, SVG
                  </p>
                </div>
              </div>
            </div>

            {/* Name + Industry */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Field label="Company Name" error={errors.name}>
                <input
                  required
                  className="input"
                  {...register("name", {
                    required: "Company name is required",
                  })}
                />
              </Field>

              <Field label="Industry" error={errors.industry}>
                <input
                  required
                  className="input"
                  {...register("industry", {
                    required: "Industry is required",
                  })}
                />
              </Field>
            </div>

            {/* Company Size */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Field label="Company Size">
                <select className="input" {...register("employeeCount")}>
                  <option value="">Select company size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
              </Field>
            </div>

            {/* Website + Founded */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Field label="Website" error={errors.websiteUrl}>
                <input
                  required
                  className="input"
                  {...register("websiteUrl", {
                    required: "Website Url is Required",
                  })}
                />
              </Field>

              <Field label="Founded Year">
                <input
                  required
                  type="number"
                  className="input"
                  {...register("foundedYear")}
                />
              </Field>
            </div>

            {/* About */}
            <Field label="About Company" error={errors.description}>
              <textarea
                rows="6"
                className="textarea"
                {...register("description", {
                  required: "Description is Required",
                })}
              />
            </Field>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="City">
                <input required className="input" {...register("city")} />
              </Field>
              <Field label="State">
                <input required className="input" {...register("state")} />
              </Field>
              <Field label="Country">
                <input required className="input" {...register("country")} />
              </Field>
            </div>
          </div>

          {/* Contact */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-6">Contact Information</h2>

            <Field label="Phone Number" error={errors.phone}>
              <input
                required
                className="input"
                {...register("phone", { required: "Phone Number is Required" })}
              />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="HR Email">
                <input required className="input" {...register("hrEmail")} />
              </Field>
              <Field label="Info Email">
                <input required className="input" {...register("infoEmail")} />
              </Field>
            </div>
          </div>

          {/* Social Links */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-6">Social Media Links</h2>

            <Field label="LinkedIn">
              <input required className="input" {...register("linkedin")} />
            </Field>
            <Field label="Twitter / X">
              <input required className="input" {...register("twitter")} />
            </Field>
            <Field label="Facebook">
              <input required className="input" {...register("facebook")} />
            </Field>
            <Field label="Instagram">
              <input required className="input" {...register("instagram")} />
            </Field>
          </div>

          {/* Save */}
          <button className="btn btn-primary cursor-pointer">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </button>
        </form>
      </div>
    </main>
  );
};

export default CompanySettings;
