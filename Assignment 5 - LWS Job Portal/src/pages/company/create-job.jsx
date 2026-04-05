import { ChevronRight, Plus, Send, X } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useCreateJob } from "../../hooks/company/useCreateJob";

const CreateJob = () => {
  const [skillInput, setSkillInput] = useState("");
  const navigate = useNavigate();

  const { mutate: createJob } = useCreateJob();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      type: "", 
      workMode: "",
      category: "",
      experienceLevel: "",
      location: "",
      salaryMin: "",
      salaryMax: "",
      salaryPeriod: "Monthly",
      description: "",
      requirements: "",
      benefits: "",
      vacancies: 1,
      skills: [],
      deadline: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  });

  const addSkill = () => {
    if (!skillInput.trim()) return;
    append({ value: skillInput.trim() });
    setSkillInput("");
  };

  const onSubmit = (data) => {
    const payload = {
      title: data.title,
      type: data.type,
      workMode: data.workMode,
      category: data.category,
      experienceLevel: data.experienceLevel,
      location: data.location,
      salaryPeriod: data.salaryPeriod,
      description: data.description,
      requirements: data.requirements,
      benefits: data.benefits,
      
      salaryMin: data.salaryMin ? Number(data.salaryMin) : undefined,
      salaryMax: data.salaryMax ? Number(data.salaryMax) : undefined,
      vacancies: data.vacancies ? Number(data.vacancies) : 1,

      skills: data.skills.map((s) => s.value),

      deadline: data.deadline ? new Date(data.deadline).toISOString() : undefined,
    };


    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

    console.log("Submitting Payload:", payload);


    createJob(payload, {
      onSuccess: () => {
        // Redirect to dashboard on success
        navigate("/company-dashboard");
      },
    });
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      {/* */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-[hsl(var(--color-muted-foreground))] mb-2">
          <Link
            to="/company-dashboard"
            className="hover:text-[hsl(var(--color-primary))]"
          >
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-[hsl(var(--color-foreground))]">
            Create Job
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Post a New Job</h1>
            <p className="text-[hsl(var(--color-muted-foreground))]">
              Fill in the details to create a new job posting
            </p>
          </div>
          <Link to="/company-dashboard" className="btn btn-outline">
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Link>
        </div>
      </div>

      {/* */}
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {/* */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
          <div className="space-y-6">
            <div>
              <label htmlFor="jobTitle" className="label block mb-2">
                Job Title *
              </label>
              <input
                type="text"
                id="jobTitle"
                className="input"
                placeholder="e.g. Senior Full Stack Developer"
                {...register("title", { required: "Job title is required" })}
              />
              {errors.title && (
                <span className="text-red-500 text-sm">
                  {errors.title.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="jobType" className="label block mb-2">
                  Job Type *
                </label>
                <select
                  id="jobType"
                  className="select"
                  {...register("jobType", { required: "Job type is required" })}
                >
                  <option value="">Select job type</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="freelance">Freelance</option>
                  <option value="internship">Internship</option>
                </select>
                {errors.jobType && (
                  <span className="text-red-500 text-sm">
                    {errors.jobType.message}
                  </span>
                )}
              </div>

              <div>
                <label htmlFor="workMode" className="label block mb-2">
                  Work Mode *
                </label>
                <select
                  id="workMode"
                  className="select"
                  {...register("workMode", {
                    required: "Work mode is required",
                  })}
                >
                  <option value="">Select work mode</option>
                  <option value="on-site">On-site</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                </select>
                {errors.workMode && (
                  <span className="text-red-500 text-sm">
                    {errors.workMode.message}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="label block mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  className="select"
                  {...register("category", {
                    required: "Category is required",
                  })}
                >
                  <option value="">Select category</option>
                  <option value="engineering">Engineering</option>
                  <option value="design">Design</option>
                  <option value="product">Product</option>
                  <option value="marketing">Marketing</option>
                  <option value="sales">Sales</option>
                  <option value="hr">Human Resources</option>
                  <option value="finance">Finance</option>
                  <option value="other">Other</option>
                </select>
                {errors.category && (
                  <span className="text-red-500 text-sm">
                    {errors.category.message}
                  </span>
                )}
              </div>

              <div>
                <label htmlFor="experience" className="label block mb-2">
                  Experience Level *
                </label>
                <select
                  id="experience"
                  className="select"
                  {...register("experienceLevel", {
                    required: "Experience level is required",
                  })}
                >
                  <option value="">Select experience level</option>
                  <option value="entry">Entry Level (0-2 years)</option>
                  <option value="mid">Mid Level (2-5 years)</option>
                  <option value="senior">Senior Level (5-10 years)</option>
                  <option value="lead">Lead (10+ years)</option>
                </select>
                {errors.experienceLevel && (
                  <span className="text-red-500 text-sm">
                    {errors.experienceLevel.message}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-6">
            Location & Compensation
          </h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="city" className="label block mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  id="city"
                  className="input"
                  placeholder="e.g. San Francisco"
                  {...register("location", {
                    required: "Location is required",
                  })}
                />
                {errors.location && (
                  <span className="text-red-500 text-sm">
                    {errors.location.message}
                  </span>
                )}
              </div>

              <div>
                <label htmlFor="salaryMin" className="label block mb-2">
                  Minimum Salary ($)
                </label>
                <input
                  type="number"
                  id="salaryMin"
                  className="input"
                  placeholder="e.g. 100000"
                  {...register("salaryMin")}
                />
              </div>

              <div>
                <label htmlFor="salaryMax" className="label block mb-2">
                  Maximum Salary ($)
                </label>
                <input
                  type="number"
                  id="salaryMax"
                  className="input"
                  placeholder="e.g. 150000"
                  {...register("salaryMax")}
                />
              </div>

              <div>
                <label htmlFor="salaryPeriod" className="label block mb-2">
                  Salary Period
                </label>
                <select
                  id="salaryPeriod"
                  className="select"
                  {...register("salaryPeriod")}
                >
                  <option value="yearly">Yearly</option>
                  <option value="monthly">Monthly</option>
                  <option value="hourly">Hourly</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-6">Job Description</h2>
          <div className="space-y-6">
            <div>
              <label htmlFor="description" className="label block mb-2">
                Job Description *
              </label>
              <textarea
                id="description"
                className="textarea"
                rows="8"
                placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                {...register("description", {
                  required: "Description is required",
                })}
              ></textarea>
              <p className="text-xs text-[hsl(var(--color-muted-foreground))] mt-2">
                Provide a detailed description of the role and responsibilities
              </p>
              {errors.description && (
                <span className="text-red-500 text-sm">
                  {errors.description.message}
                </span>
              )}
            </div>

            <div>
              <label htmlFor="requirements" className="label block mb-2">
                Requirements & Qualifications
              </label>
              <textarea
                id="requirements"
                className="textarea"
                rows="6"
                placeholder="List the required skills, qualifications, and experience..."
                {...register("requirements")}
              ></textarea>
            </div>

            <div>
              <label htmlFor="benefits" className="label block mb-2">
                Benefits & Perks
              </label>
              <textarea
                id="benefits"
                className="textarea"
                rows="5"
                placeholder="Describe the benefits, perks, and what makes your company a great place to work..."
                {...register("benefits")}
              ></textarea>
            </div>
          </div>
        </div>

        {/* */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-6">Required Skills</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="skillInput" className="label block mb-2">
                Add Skills
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="skillInput"
                  className="input flex-1"
                  placeholder="Type a skill and press Add"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addSkill())
                  }
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={addSkill}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </button>
              </div>
              <p className="text-xs text-[hsl(var(--color-muted-foreground))] mt-2">
                Add technical and soft skills required for this position
              </p>
            </div>

            {/* Dynamic Skills List */}
            <div>
              <label className="label block mb-3">Added Skills</label>
              <div className="flex flex-wrap gap-2">
                {fields.length === 0 && (
                  <span className="text-sm text-gray-400">
                    No skills added yet.
                  </span>
                )}

                {fields.map((field, index) => (
                  <span
                    key={field.id}
                    className="badge badge-secondary inline-flex items-center gap-1"
                  >
                    {field.value}
                    <button
                      type="button"
                      className="hover:text-red-600"
                      onClick={() => remove(index)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-6">Application Settings</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="vacancies" className="label block mb-2">
                  Number of Vacancies
                </label>
                <input
                  type="number"
                  id="vacancies"
                  className="input"
                  placeholder="e.g. 2"
                  min="1"
                  {...register("vacancies")}
                />
              </div>

              <div>
                <label htmlFor="deadline" className="label block mb-2">
                  Application Deadline *
                </label>
                <input
                  type="date"
                  id="deadline"
                  className="input"
                  {...register("deadline")}
                />
                {errors.deadline && (
                  <span className="text-red-500 text-sm">
                    {errors.deadline.message}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* */}
        <div className="card p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1"></div>
            <Link
              to="/company-dashboard"
              className="btn btn-outline text-center"
            >
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              <Send className="h-4 w-4 mr-2" />
              Publish Job
            </button>
          </div>
        </div>
      </form>
    </main>
  );
};

export default CreateJob;
