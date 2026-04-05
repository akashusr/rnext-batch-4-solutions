import {
  Building,
  Building2,
  Facebook,
  Github,
  Globe,
  Heart,
  Instagram,
  Lightbulb,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Share2,
  Target,
  Twitter,
  Users,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useCompanyBySlug } from "../hooks/company/useCompanyBySlug";

const CompanyPublicProfile = () => {
  const { slug } = useParams();

  const { data, isLoading, isError, error } = useCompanyBySlug(slug);

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-100">
          <p className="text-lg">Loading company profile...</p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="card p-6 text-center">
          <p className="text-red-600">Error loading profile: {error.message}</p>
        </div>
      </main>
    );
  }

  const company = data?.data;

  if (!company) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="card p-6 text-center">
          <p>No company profile found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Company Header */}
      <div className="card p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Company Logo */}
          <div className="shrink-0">
            {company.logoUrl ? (
              <img
                src={`${import.meta.env.VITE_BASE_URL}${company.logoUrl}`}
                alt={`${company.name} logo`}
                className="h-16 w-20 rounded-xl object-fit"
              />
            ) : (
              <div className="h-32 w-32 rounded-xl bg-[hsl(var(--color-secondary))] flex items-center justify-center">
                <Building2 className="h-16 w-16 text-[hsl(var(--color-primary))]" />
              </div>
            )}
          </div>

          {/* Company Info */}
          <div className="flex-1 h-full items-center">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{company.name}</h1>
                <div className="flex flex-wrap items-center gap-3 text-[hsl(var(--color-muted-foreground))]">
                  {company.industry && (
                    <>
                      <span className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        {company.industry}
                      </span>
                      <span>•</span>
                    </>
                  )}
                  {company.location && (
                    <>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {company.location}
                      </span>
                      <span>•</span>
                    </>
                  )}
                  {company.employeeCount && (
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {company.employeeCount} employees
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="btn btn-outline cursor-pointer"
                  onClick={async () => {
                    try {
                      const shareLink = `${
                        import.meta.env.VITE_FRONT_URL
                      }/company-profile/${company.slug}`;

                      await navigator.clipboard.writeText(shareLink);

                      alert("Link copied to clipboard!");
                    } catch (err) {
                      console.error("Failed to copy:", err);
                      alert("Copy failed. Please try again.");
                    }
                  }}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Company */}
          {company.description && (
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">About Company</h2>
              <div className="space-y-4 text-[hsl(var(--color-foreground))]">
                <p className="whitespace-pre-wrap">{company.description}</p>
                {company.foundedYear && (
                  <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
                    Founded in {company.foundedYear}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Company Culture & Values */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-lg bg-[hsl(var(--color-secondary))] flex items-center justify-center">
                    <Lightbulb className="h-5 w-5 text-[hsl(var(--color-primary))]" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Innovation</h3>
                  <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
                    We encourage creative thinking and embrace new ideas to
                    solve problems.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-lg bg-[hsl(var(--color-secondary))] flex items-center justify-center">
                    <Users className="h-5 w-5 text-[hsl(var(--color-primary))]" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Collaboration</h3>
                  <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
                    Teamwork and open communication are at the heart of
                    everything we do.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-lg bg-[hsl(var(--color-secondary))] flex items-center justify-center">
                    <Target className="h-5 w-5 text-[hsl(var(--color-primary))]" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Excellence</h3>
                  <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
                    We strive for the highest quality in our products and
                    services.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-lg bg-[hsl(var(--color-secondary))] flex items-center justify-center">
                    <Heart className="h-5 w-5 text-[hsl(var(--color-primary))]" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Integrity</h3>
                  <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
                    Honesty and transparency guide our decisions and actions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Open Positions --> */}
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Contact Information */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3">
              {company?.websiteUrl && (
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-[hsl(var(--color-muted-foreground))] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-[hsl(var(--color-muted-foreground))] mb-1">
                      Website
                    </p>
                    <a
                      href={company.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-[hsl(var(--color-primary))] hover:underline"
                    >
                      {company.websiteUrl}
                    </a>
                  </div>
                </div>
              )}
              {company.email && (
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-[hsl(var(--color-muted-foreground))] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-[hsl(var(--color-muted-foreground))] mb-1">
                      Email
                    </p>
                    <a
                      href={`mailto:${company.email}`}
                      className="text-sm font-medium text-[hsl(var(--color-primary))] hover:underline"
                    >
                      {company.email}
                    </a>
                  </div>
                </div>
              )}
              {company.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-[hsl(var(--color-muted-foreground))] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-[hsl(var(--color-muted-foreground))] mb-1">
                      Phone
                    </p>
                    <a
                      href={`tel:${company.phone}`}
                      className="text-sm font-medium"
                    >
                      {company.phone}
                    </a>
                  </div>
                </div>
              )}
              {company.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[hsl(var(--color-muted-foreground))] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-[hsl(var(--color-muted-foreground))] mb-1">
                      Headquarters
                    </p>
                    <p className="text-sm font-medium whitespace-pre-wrap">
                      {company.address}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Social Media */}
          {company?.socialLinks &&
            Object.values(company.socialLinks).some((link) => link) && (
              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                <div className="space-y-2">
                  {company.socialLinks.linkedin && (
                    <a
                      href={company.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-[hsl(var(--color-accent))] transition-colors"
                    >
                      <Linkedin className="h-5 w-5 text-[hsl(var(--color-muted-foreground))]" />
                      <span className="text-sm font-medium">LinkedIn</span>
                    </a>
                  )}
                  {company.socialLinks.twitter && (
                    <a
                      href={company.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-[hsl(var(--color-accent))] transition-colors"
                    >
                      <Twitter className="h-5 w-5 text-[hsl(var(--color-muted-foreground))]" />
                      <span className="text-sm font-medium">Twitter</span>
                    </a>
                  )}
                  {company.socialLinks.facebook && (
                    <a
                      href={company.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-[hsl(var(--color-accent))] transition-colors"
                    >
                      <Facebook className="h-5 w-5 text-[hsl(var(--color-muted-foreground))]" />
                      <span className="text-sm font-medium">Facebook</span>
                    </a>
                  )}
                  {company.socialLinks.instagram && (
                    <a
                      href={company.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-[hsl(var(--color-accent))] transition-colors"
                    >
                      <Instagram className="h-5 w-5 text-[hsl(var(--color-muted-foreground))]" />
                      <span className="text-sm font-medium">Instagram</span>
                    </a>
                  )}
                  {company.socialLinks.github && (
                    <a
                      href={company.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-[hsl(var(--color-accent))] transition-colors"
                    >
                      <Github className="h-5 w-5 text-[hsl(var(--color-muted-foreground))]" />
                      <span className="text-sm font-medium">GitHub</span>
                    </a>
                  )}
                </div>
              </div>
            )}
        </div>
      </div>
    </main>
  );
};

export default CompanyPublicProfile;
