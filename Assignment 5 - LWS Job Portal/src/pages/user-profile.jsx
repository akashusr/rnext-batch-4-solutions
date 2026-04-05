import {
  Calendar,
  Download,
  Github,
  Globe,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import { Link, useParams } from "react-router-dom";
import { useMyApplications } from "../hooks/useMyApplications";
import { usePublicProfile } from "../hooks/usePublicProfile";
import { formatDate } from "../utils";

const PublicUserProfile = () => {
  const { userId } = useParams();
  const { data: user, isLoading, isError } = usePublicProfile(userId);
  const { data: applications } = useMyApplications(); 

  if (isLoading) return <p>Loading...</p>;
  if (isError || !user) return <p>Error loading profile.</p>;

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
    experience,
    resumeOriginalName,
    resumeUploadDate,
    resumeUrl,
  } = user;

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="card p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Image */}
          <div className="relative shrink-0">
            <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center">
              <img
                src={`${import.meta.env.VITE_BASE_URL}${profilePictureUrl}`}
                className="h-28 w-28 rounded-full object-cover"
              />
            </div>
          </div>

          {/* Basic Information */}
          <div className="flex-1">
            <div className="flex flex-col gap-4 mb-3">
              <div>
                <h1 className="text-3xl font-bold mb-2">{name}</h1>
                <p className="text-lg text-gray-600 mb-2">{title}</p>

                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                  {location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {location}
                    </span>
                  )}

                  <span>•</span>

                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Member since {formatDate(createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Public Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <p className="text-2xl font-bold text-primary">
                  {applications?.length || 0}
                </p>
                <p className="text-sm text-gray-600">Applications</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <p>{bio}</p>
          </div>

          {/* Contact */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Contact</h2>

            <div className="space-y-4">
              {email && (
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{email}</p>
                  </div>
                </div>
              )}

              {phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{phone}</p>
                  </div>
                </div>
              )}

              {location && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{location}</p>
                  </div>
                </div>
              )}

              {linkedinUrl && (
                <div className="flex items-start gap-3">
                  <Linkedin className="h-5 w-5" />
                  <Link className="text-primary" to={linkedinUrl}>
                    {linkedinUrl}
                  </Link>
                </div>
              )}

              {githubUrl && (
                <div className="flex items-start gap-3">
                  <Github className="h-5 w-5" />
                  <Link className="text-primary" to={githubUrl}>
                    {githubUrl}
                  </Link>
                </div>
              )}

              {portfolioUrl && (
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5" />
                  <Link className="text-primary" to={portfolioUrl}>
                    {portfolioUrl}
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Skills</h2>

            <div className="flex flex-wrap gap-2">
              {skills?.map((skill, i) => (
                <span key={i} className="badge badge-secondary">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Experience</h2>

            <div className="space-y-6">
              {experience?.map((item, i) => (
                <div key={i} className="relative pl-6 border-l">
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-600">
                      {item.companyName} • {item.employmentType}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(item.startDate)} –{" "}
                      {item.endDate ? formatDate(item.endDate) : "Present"}
                    </p>
                    <p className="text-sm mt-2">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Education</h2>
            {education?.map((edu, i) => (
              <div key={i} className="space-y-2">
                <div className="flex gap-3">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">{edu.degree}</h3>
                    <p className="text-sm text-gray-600">{edu.schoolName}</p>
                    <p className="text-xs text-gray-500">
                      {edu.startYear} – {edu.endYear ?? "Present"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Resume (Download Only) */}
          {resumeUrl && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Resume</h3>
              <div className="p-4 bg-gray-100 rounded">
                <p className="font-medium text-sm">{resumeOriginalName}</p>
                <p className="text-xs text-gray-500">
                  Updated {formatDate(resumeUploadDate)}
                </p>
                <a
                  href={`${import.meta.env.VITE_BASE_URL}${resumeUrl}`}
                  className="btn btn-outline w-full mt-3"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Resume
                </a>
              </div>
            </div>
          )}

          {/* Social Links (Short) */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Social Profiles</h3>
            <div className="space-y-2">
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  className="flex items-center gap-3 p-2 hover:bg-accent"
                >
                  <Linkedin className="h-5 w-5" />
                  <span>LinkedIn</span>
                </a>
              )}

              {githubUrl && (
                <a
                  href={githubUrl}
                  className="flex items-center gap-3 p-2 hover:bg-accent"
                >
                  <Github className="h-5 w-5" />
                  <span>GitHub</span>
                </a>
              )}

              {portfolioUrl && (
                <a
                  href={portfolioUrl}
                  className="flex items-center gap-3 p-2 hover:bg-accent"
                >
                  <Globe className="h-5 w-5" />
                  <span>Portfolio</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PublicUserProfile;
