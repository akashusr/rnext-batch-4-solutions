import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useUpdateJob } from "../../hooks/company/useUpdateJob";

const UpdateJobModal = ({ open, onClose, job }) => {
  const { mutate, isPending } = useUpdateJob();

  const [form, setForm] = useState({
    title: "",
    type: "",
    workMode: "",
    category: "",
    experienceLevel: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    salaryPeriod: "",
    vacancies: "",
    deadline: "",
    description: "",
    requirements: "",
    benefits: "",
    skills: "",
  });

  useEffect(() => {
    if (job) {
      setForm({
        title: job.title || "",
        type: job.type || "",
        workMode: job.workMode || "",
        category: job.category || "",
        experienceLevel: job.experienceLevel || "",
        location: job.location || "",
        salaryMin: job.salaryMin || "",
        salaryMax: job.salaryMax || "",
        salaryPeriod: job.salaryPeriod || "",
        vacancies: job.vacancies || "",
        deadline: job.deadline?.split("T")[0] || "",
        description: job.description || "",
        requirements: job.requirements || "",
        benefits: job.benefits || "",
        skills: job.skills?.join(", ") || "",
      });
    }
  }, [job]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    mutate({
      jobId: job.id,
      payload: {
        ...form,
        salaryMin: Number(form.salaryMin),
        salaryMax: Number(form.salaryMax),
        vacancies: Number(form.vacancies),
        skills: form.skills.split(",").map((s) => s.trim()),
      },
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl p-6 relative overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-3 right-3">
          <X />
        </button>

        <h2 className="text-xl font-semibold mb-6">Edit Job</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 🔹 Title */}
          <div>
            <label className="label">Job Title</label> {/* ADDED */}
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="input w-full"
            />
          </div>

          {/* 🔹 Type & Work Mode */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Employment Type</label> {/* ADDED */}
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select</option>
                <option>Full-Time</option>
                <option>Part-Time</option>
                <option>Contract</option>
              </select>
            </div>

            <div>
              <label className="label">Work Mode</label> {/* ADDED */}
              <select
                name="workMode"
                value={form.workMode}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select</option>
                <option>Remote</option>
                <option>On-site</option>
                <option>Hybrid</option>
              </select>
            </div>
          </div>

          {/* 🔹 Category & Experience */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Category</label> {/* ADDED */}
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="label">Experience Level</label> {/* ADDED */}
              <input
                name="experienceLevel"
                value={form.experienceLevel}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          {/* 🔹 Location */}
          <div>
            <label className="label">Location</label> {/* ADDED */}
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="input w-full"
            />
          </div>

          {/* 🔹 Salary */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">Minimum Salary</label> {/* ADDED */}
              <input
                type="number"
                name="salaryMin"
                value={form.salaryMin}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="label">Maximum Salary</label> {/* ADDED */}
              <input
                type="number"
                name="salaryMax"
                value={form.salaryMax}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="label">Salary Period</label> {/* ADDED */}
              <select
                name="salaryPeriod"
                value={form.salaryPeriod}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select</option>
                <option>Monthly</option>
                <option>Yearly</option>
                <option>Hourly</option>
              </select>
            </div>
          </div>

          {/* 🔹 Vacancies & Deadline */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Vacancies</label> {/* ADDED */}
              <input
                type="number"
                name="vacancies"
                value={form.vacancies}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="label">Application Deadline</label> {/* ADDED */}
              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          {/* 🔹 Description */}
          <div>
            <label className="label">Job Description</label> {/* ADDED */}
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="input h-28"
            />
          </div>

          {/* 🔹 Requirements */}
          <div>
            <label className="label">Requirements</label> {/* ADDED */}
            <textarea
              name="requirements"
              value={form.requirements}
              onChange={handleChange}
              className="input h-24"
            />
          </div>

          {/* 🔹 Benefits */}
          <div>
            <label className="label">Benefits</label> {/* ADDED */}
            <textarea
              name="benefits"
              value={form.benefits}
              onChange={handleChange}
              className="input h-24"
            />
          </div>

          {/* 🔹 Skills */}
          <div>
            <label className="label">Skills (comma separated)</label> {/* ADDED */}
            <input
              name="skills"
              value={form.skills}
              onChange={handleChange}
              className="input w-full"
            />
          </div>

          <button disabled={isPending} className="btn btn-primary w-full h-11">
            Update Job
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateJobModal;
