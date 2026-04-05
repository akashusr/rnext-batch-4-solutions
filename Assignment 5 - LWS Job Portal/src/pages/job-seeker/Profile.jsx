import {
  Bookmark,
  Calendar,
  Camera,
  Download,
  Edit,
  FileText,
  Github,
  Globe,
  GraduationCap,
  LayoutDashboard,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Upload,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useMe } from "../../hooks/useMe";
import { useMyApplications } from "../../hooks/useMyApplications";
import { formatDate } from "../../utils";

const Profile = () => {
  const { data: applications } = useMyApplications();
  const { data: user, isLoading, isError } = useMe();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading profile</p>;

  const {
    bio,
    education,
    email,
    githubUrl,
    linkedinUrl,
    location,
    name,
    phone,
    portfolioUrl,
    profilePictureUrl,
    skills,
    title,
    createdAt,
    resumeOriginalName,
    resumeUploadDate,
    resumeUrl,
  } = user || {};

  const safeExperience = Array.isArray(user?.experience) ? user.experience : [];

  return (
    <main className="container mx-auto px-4 py-8">
      {/* <!-- Profile Header --> */}
      <div className="card p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* <!-- Profile Photo --> */}
          <div className="relative shrink-0">
            <div className="h-32 w-32 rounded-full bg-[hsl(var(--color-secondary))] flex items-center justify-center">
              <img
                src={`${import.meta.env.VITE_BASE_URL}${profilePictureUrl}`}
                className="h-28 w-28 text-[hsl(var(--color-primary))] rounded-full"
              ></img>
            </div>
            <div className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-[hsl(var(--color-primary))] flex items-center justify-center border-4 border-white">
              <Camera className="h-5 w-5 text-white"></Camera>
            </div>
          </div>

          {/* <!-- Profile Info --> */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-3">
              <div>
                <h1 className="text-3xl font-bold mb-2">{name}</h1>
                <p className="text-lg text-[hsl(var(--color-muted-foreground))] mb-2">
                  {title}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-sm text-[hsl(var(--color-muted-foreground))]">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4"></MapPin>
                    {location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4"></Calendar>
                    Member since {formatDate(createdAt)}
                  </span>
                </div>
              </div>
              <Link to="/edit-user-profile" className="btn btn-primary">
                <Edit className="h-4 w-4 mr-2"></Edit>
                Edit Profile
              </Link>
            </div>

            {/* <!-- Quick Stats --> */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[hsl(var(--color-border))]">
              <div>
                <p className="text-2xl font-bold text-[hsl(var(--color-primary))]">
                  {applications?.length}
                </p>
                <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
                  Applications
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* <!-- Main Content Column --> */}
        <div className="lg:col-span-2 space-y-6">
          {/* <!-- About --> */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <p className="text-[hsl(var(--color-foreground))] leading-relaxed">
              {bio}
            </p>
          </div>

          {/* <!-- Contact Information --> */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-[hsl(var(--color-secondary))] flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-[hsl(var(--color-primary))]"></Mail>
                </div>
                <div>
                  <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
                    Email
                  </p>
                  <p className="font-medium">{email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-[hsl(var(--color-secondary))] flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-[hsl(var(--color-primary))]"></Phone>
                </div>
                <div>
                  <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
                    Phone
                  </p>
                  <p className="font-medium">{phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-[hsl(var(--color-secondary))] flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-[hsl(var(--color-primary))]"></MapPin>
                </div>
                <div>
                  <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
                    Location
                  </p>
                  <p className="font-medium">{location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-[hsl(var(--color-secondary))] flex items-center justify-center shrink-0">
                  <Linkedin className="h-5 w-5 text-[hsl(var(--color-primary))]"></Linkedin>
                </div>
                <div>
                  <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
                    LinkedIn
                  </p>
                  <Link
                    href="#"
                    className="font-medium text-[hsl(var(--color-primary))] hover:underline"
                  >
                    {linkedinUrl}
                  </Link>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-[hsl(var(--color-secondary))] flex items-center justify-center shrink-0">
                  <Github className="h-5 w-5 text-[hsl(var(--color-primary))]"></Github>
                </div>
                <div>
                  <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
                    LinkedIn
                  </p>
                  <Link
                    href="#"
                    className="font-medium text-[hsl(var(--color-primary))] hover:underline"
                  >
                    {githubUrl}
                  </Link>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-[hsl(var(--color-secondary))] flex items-center justify-center shrink-0">
                  <Globe className="h-5 w-5 text-[hsl(var(--color-primary))]" />
                </div>
                <div>
                  <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
                    Portfolio
                  </p>
                  <Link
                    href="#"
                    className="font-medium text-[hsl(var(--color-primary))] hover:underline"
                  >
                    {portfolioUrl}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Skills --> */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill} className="badge badge-secondary">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* <!-- Experience --> */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Work Experience</h2>
            <div className="space-y-6">
              {safeExperience?.map((experience, i) => (
                <div
                  key={i}
                  className="relative pl-8 pb-6 border-l-2 border-[hsl(var(--color-border))] last:pb-0"
                >
                  <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-[hsl(var(--color-primary))] border-2 border-white"></div>
                  <div>
                    <h3 className="font-semibold mb-1">{experience.title}</h3>
                    <p className="text-sm text-[hsl(var(--color-muted-foreground))] mb-2">
                      {experience.companyName} • {experience.employmentType}
                    </p>
                    <p className="text-xs text-[hsl(var(--color-muted-foreground))] mb-3">
                      {formatDate(experience.startDate)} -{" "}
                      {experience.endDate
                        ? formatDate(experience.endDate)
                        : "Continue"}
                    </p>
                    <p className="text-sm text-[hsl(var(--color-foreground))]">
                      {experience.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* <!-- Education --> */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Education</h2>
            {education?.map((edu, i) => (
              <div key={i} className="space-y-4">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-lg bg-[hsl(var(--color-secondary))] flex items-center justify-center shrink-0">
                    <GraduationCap className="h-6 w-6 text-[hsl(var(--color-primary))]"></GraduationCap>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{edu.degree}</h3>
                    <p className="text-sm text-[hsl(var(--color-muted-foreground))] mb-1">
                      {edu.schoolName}
                    </p>
                    <p className="text-xs text-[hsl(var(--color-muted-foreground))]">
                      {edu.startYear} — {edu.endYear ? edu.endYear : "Present"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* <!-- Sidebar Column --> */}
        <div className="lg:col-span-1 space-y-6">
          {/* <!-- Resume --> */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Resume</h3>
            <div className="space-y-4">
              <div className="p-4 bg-[hsl(var(--color-secondary))] rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center shrink-0">
                    <FileText className="h-6 w-6 text-[hsl(var(--color-primary))]"></FileText>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {resumeOriginalName}
                    </p>
                    <p className="text-xs text-[hsl(var(--color-muted-foreground))]">
                      Updated {formatDate(resumeUploadDate)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {resumeUrl && (
                    <a
                      href={`${import.meta.env.VITE_BASE_URL}${resumeUrl}`}
                      className="btn btn-outline w-full text-xs h-9"
                    >
                      <Download className="h-3 w-3 mr-2"></Download>
                      Download
                    </a>
                  )}
                </div>
              </div>
              <Link to="/edit-user-profile" className="btn btn-outline w-full">
                <Upload className="h-4 w-4 mr-2"></Upload>
                Update Resume
              </Link>
            </div>
          </div>

          {/* <!-- Social Links --> */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Social Profiles</h3>
            <div className="space-y-2">
              <a
                href="#"
                className="flex items-center gap-3 p-2 rounded-md hover:bg-[hsl(var(--color-accent))] transition-colors"
              >
                <Linkedin className="h-5 w-5 text-[hsl(var(--color-muted-foreground))]"></Linkedin>
                <span className="text-sm font-medium">LinkedIn</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 p-2 rounded-md hover:bg-[hsl(var(--color-accent))] transition-colors"
              >
                <Github className="h-5 w-5 text-[hsl(var(--color-muted-foreground))]"></Github>
                <span className="text-sm font-medium">GitHub</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 p-2 rounded-md hover:bg-[hsl(var(--color-accent))] transition-colors"
              >
                <Globe className="h-5 w-5 text-[hsl(var(--color-muted-foreground))]"></Globe>
                <span className="text-sm font-medium">Portfolio</span>
              </a>
            </div>
          </div>

          {/* <!-- Quick Actions --> */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                to="/user-dashboard"
                className="btn btn-outline w-full justify-start"
              >
                <LayoutDashboard className="h-4 w-4 mr-2"></LayoutDashboard>
                View Dashboard
              </Link>
              <Link
                to="/applied-jobs"
                className="btn btn-outline w-full justify-start"
              >
                <FileText className="h-4 w-4 mr-2"></FileText>
                My Applications
              </Link>
              <a href="#" className="btn btn-outline w-full justify-start">
                <Bookmark className="h-4 w-4 mr-2"></Bookmark>
                Saved Jobs
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
