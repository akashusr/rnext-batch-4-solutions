import {
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Plus,
  TextAlignCenter,
  User,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useUpdateProfile } from "../../hooks/useProfile";
import { useUploadResume } from "../../hooks/useResume";
import Field from "../auth/Field";

const EditProfileForm = ({ user }) => {
  const [skillInput, setSkillInput] = useState("");
  const { mutateAsync: uploadResume } = useUploadResume();
  const { mutateAsync: updateProfile } = useUpdateProfile();
  const navigate = useNavigate();

  const {
    bio,
    city,
    country,
    email,
    title,
    githubUrl,
    linkedinUrl,
    name,
    portfolioUrl,
    skills,
    state,
    phone,
    zipCode,
    resumeUrl,
    experience,
    education,
  } = user;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: name,
      email: email,
      city: city,
      phone,
      title: title,
      state: state,
      country: country,
      zipCode: zipCode,
      about: bio,
      skills: skills?.map((skill) => ({ value: skill })) || [],
      experience:
        experience?.length > 0
          ? experience
          : [
              {
                companyName: "",
                title: "",
                employmentType: "Full-Time",
                startDate: "",
                endDate: "",
                location: "",
                description: "",
              },
            ],
      education:
        education?.length > 0
          ? education
          : [
              {
                institution: "",
                degree: "",
                startYear: "",
                endYear: "",
              },
            ],
      website: portfolioUrl,
      linkedin: linkedinUrl,
      githubUrl: githubUrl,
      resume: resumeUrl,
    },
  });

  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control,
    name: "skills",
  });

  const {
    fields: expFields,
    append: addExp,
    remove: removeExp,
  } = useFieldArray({
    control,
    name: "experience",
  });

  const {
    fields: eduFields,
    append: addEdu,
    remove: removeEdu,
  } = useFieldArray({
    control,
    name: "education",
  });

  const submitForm = async (data) => {
    try {
      const hasNewFile =
        data.resume &&
        data.resume.length > 0 &&
        typeof data.resume !== "string";
      if (hasNewFile) {
        await uploadResume(data.resume[0]);
      }

      const formattedSkills = data.skills.map((s) => s.value);

      const experienceArray = Array.isArray(data.experience)
        ? data.experience
        : [];

      const formattedExperience = experienceArray
        .filter(
          (exp) =>
            exp.companyName ||
            exp.title ||
            exp.startDate ||
            exp.endDate ||
            exp.description
        )
        .map((exp) => ({
          companyName: exp.companyName,
          title: exp.title,
          location: exp.location || "Remote",
          employmentType: exp.employmentType || "Full-Time",
          startDate: exp.startDate,
          endDate: exp.endDate || undefined,
          description: exp.description,
        }));

      const educationArray = Array.isArray(data.education)
        ? data.education
        : [];

      const formattedEducation = educationArray
        .filter((edu) => edu.institution || edu.degree)
        .map((edu) => ({
          institution: edu.institution,
          degree: edu.degree,
          startYear: edu.startYear ? String(edu.startYear) : undefined,
          endYear: edu.endYear ? String(edu.endYear) : undefined,
        }));

      const profilePayload = {
        name: data.name,
        email: data.email,
        title: data.title,
        bio: data.about,
        city: data.city,
        state: data.state,
        country: data.country,
        zipCode: data.zipCode,
        phone: data.phone,
        portfolioUrl: data.website,
        linkedinUrl: data.linkedin,
        githubUrl: data.githubUrl,
        skills: formattedSkills,
        experience: formattedExperience,
        education: formattedEducation,
      };

      // Clean undefined values
      Object.keys(profilePayload).forEach(
        (key) => profilePayload[key] === undefined && delete profilePayload[key]
      );

      await updateProfile(profilePayload);
    } catch (error) {
      console.error("Submission error", error);
    }
    navigate("/profile");
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;
    appendSkill({ value: skillInput.trim() });
    setSkillInput("");
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit(submitForm)}>
      {/* BASIC INFO */}
      <div className="card p-6 space-y-4">
        <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

        <Field label="Full Name" htmlFor="name" error={errors.name}>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              id="name"
              className="input pl-10"
              required
              placeholder="Your full name"
              {...register("name", { required: "Name is required" })}
            />
          </div>
        </Field>

        <Field label="Email Address" htmlFor="email" error={errors.email}>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              required
              id="email"
              className="input pl-10"
              placeholder="you@example.com"
              type="email"
              {...register("email", { required: "Email is required" })}
            />
          </div>
        </Field>

        <Field label="Professional Title" htmlFor="title" error={errors.email}>
          <div className="relative">
            <TextAlignCenter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              required
              id="title"
              className="input pl-10"
              placeholder="Frontend Developer"
              type="text"
              {...register("title", { required: "title is required" })}
            />
          </div>
        </Field>

        <Field label="Phone Number" htmlFor="text" error={errors.email}>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              required
              id="phone"
              className="input pl-10"
              placeholder="+018..."
              type="text"
              {...register("phone", { required: "Phone is required" })}
            />
          </div>
        </Field>
      </div>

      {/* LOCATION */}
      <div className="card p-6 space-y-3">
        <h2 className="text-lg font-semibold mb-4">Location</h2>

        <Field label="City" htmlFor="city" error={errors.city}>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              required
              id="city"
              className="input pl-10"
              placeholder="Dhaka, Bangladesh"
              {...register("city", { required: "City is required" })}
            />
          </div>
        </Field>

        <Field label="State" htmlFor="state" error={errors.state}>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              required
              id="state"
              className="input pl-10"
              placeholder="Dhaka, Bangladesh"
              {...register("state", { required: "State is required" })}
            />
          </div>
        </Field>

        <Field label="Country" htmlFor="country" error={errors.country}>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              required
              id="country"
              className="input pl-10"
              placeholder="Dhaka, Bangladesh"
              {...register("country", { required: "Country is required" })}
            />
          </div>
        </Field>

        <Field label="Zip Code" htmlFor="zipCode" error={errors.zipCode}>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              required
              id="zipCode"
              className="input pl-10"
              placeholder="Dhaka, Bangladesh"
              {...register("zipCode", { required: "Zip Code is required" })}
            />
          </div>
        </Field>
      </div>

      {/* ABOUT */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">About</h2>

        <Field label="About You" htmlFor="about" error={errors.about}>
          <textarea
            id="about"
            required
            className="input h-32"
            placeholder="Write something about yourself..."
            {...register("about")}
          />
        </Field>
      </div>

      {/* SKILLS */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">Skills</h2>

        {/* SKILL TAGS */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Skills</h2>
          <div className="flex items-center gap-3">
            <input
              className="input flex-1"
              placeholder="Add a skill..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addSkill())
              }
            />
            <button
              type="button"
              className="btn btn-primary h-10"
              onClick={addSkill}
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
          <div className="flex flex-wrap mt-4 gap-2">
            {skillFields.map((field, index) => (
              <span
                key={field.id}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2"
              >
                {field.value}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeSkill(index)}
                />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* EXPERIENCE */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">Experience</h2>

        {expFields.map((exp, index) => (
          <div key={exp.id} className="border rounded p-4 mb-4 space-y-3">
            <Field label="Company" htmlFor={`company-${index}`}>
              <input
                id={`company-${index}`}
                {...register(`experience.${index}.companyName`)}
                className="input"
                placeholder="Company name"
              />
            </Field>

            <Field label="Role" htmlFor={`role-${index}`}>
              <input
                id={`role-${index}`}
                {...register(`experience.${index}.title`)}
                className="input"
                placeholder="Job role"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Start Date">
                <input
                  type="date"
                  className="input"
                  {...register(`experience.${index}.startDate`)}
                />
              </Field>

              <Field label="End Date">
                <input
                  type="date"
                  className="input"
                  {...register(`experience.${index}.endDate`)}
                />
              </Field>
            </div>

            <Field label="Description">
              <textarea
                className="input h-24"
                placeholder="What did you do?"
                {...register(`experience.${index}.description`)}
              />
            </Field>

            <button
              type="button"
              className="btn btn-ghost text-red-500"
              onClick={() => removeExp(index)}
            >
              Remove Experience
            </button>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-primary h-10"
          onClick={() => addExp({})}
        >
          <Plus className="h-4 w-4" /> Add Experience
        </button>
      </div>

      {/* EDUCATION */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">Education</h2>

        {eduFields.map((edu, index) => (
          <div key={edu.id} className="border rounded p-4 mb-4 space-y-3">
            <Field label="Institution">
              <input
                className="input"
                placeholder="Institution name"
                {...register(`education.${index}.institution`)}
              />
            </Field>

            <Field label="Degree">
              <input
                className="input"
                placeholder="Degree or subject"
                {...register(`education.${index}.degree`)}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Start Year">
                <input
                  className="input"
                  type="number"
                  {...register(`education.${index}.startYear`)}
                />
              </Field>

              <Field label="End Year">
                <input
                  className="input"
                  type="number"
                  {...register(`education.${index}.endYear`)}
                />
              </Field>
            </div>

            <button
              type="button"
              className="btn btn-ghost text-red-500"
              onClick={() => removeEdu(index)}
            >
              Remove Education
            </button>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-primary h-10"
          onClick={() => addEdu({})}
        >
          <Plus className="h-4 w-4" /> Add Education
        </button>
      </div>

      {/* SOCIAL LINKS */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">Social Links</h2>

        <Field label="Website" htmlFor="website">
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              id="website"
              className="input pl-10"
              placeholder="https://your-website.com"
              {...register("website")}
            />
          </div>
        </Field>

        <Field label="LinkedIn" htmlFor="linkedin">
          <div className="relative">
            <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              id="linkedin"
              className="input pl-10"
              placeholder="https://linkedin.com/in/username"
              {...register("linkedin")}
            />
          </div>
        </Field>

        <Field label="GitHub" htmlFor="github">
          <div className="relative">
            <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              id="github"
              className="input pl-10"
              placeholder="https://linkedin.com/in/username"
              {...register("githubUrl")}
            />
          </div>
        </Field>
      </div>

      {/* RESUME UPLOAD */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">Resume Upload</h2>

        <Field label="Resume (PDF)">
          <input
            className="input"
            type="file"
            accept="application/pdf"
            {...register("resume")}
          />
        </Field>

        {/* Helper text showing current status */}
        <label className="label">
          <span className="label-text-alt text-gray-500">
            {user?.resumeUrl ? (
              <span className="text-green-600">✓ Current resume on file</span>
            ) : (
              "No resume uploaded yet"
            )}
          </span>
        </label>

        {errors.resume && (
          <span className="text-red-500 text-sm mt-1">
            {errors.resume.message}
          </span>
        )}
      </div>

      {/* SAVE */}
      <button className="btn btn-primary w-full h-12 text-base">
        Save Profile
      </button>
    </form>
  );
};

export default EditProfileForm;
