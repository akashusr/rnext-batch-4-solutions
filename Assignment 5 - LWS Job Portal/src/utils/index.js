import axios from "axios";

export const getDayFromISO = (isoString) => {
  const date = new Date(isoString);
  return date.getDate();
};

export const formatNumber = (num) => {
  return Intl.NumberFormat("en", { notation: "compact" }).format(num);
};

export const formatDate = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(date);
};

export const formatTextList = (text) => {
  if (!text) return [];

  const normalized = text.replace(/\\n/g, "\n");

  return normalized
    .split("\n")
    .map((item) => item.replace("-", "").trim())
    .filter((item) => item.length > 0);
};

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

export const getStatusColor = (status) => {
  switch (status) {
    case "New":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Shortlisted":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Interviewed":
      return "bg-green-100 text-green-800 border-green-200";
    case "Rejected":
      return "bg-red-100 text-red-800 border-red-200";
    case "Hired":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-blue-100 text-blue-800 border-blue-200";
  }
};

export const getProfileImage = async (filename) => {
  try {
    const response = await axios.get(
      `http://localhost:9000/uploads/profiles/${filename}`,
      {
        responseType: "blob",
      }
    );
    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error("Error fetching profile image:", error);
    throw error;
  }
};

export const normalizeUrl = (url) => {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
};

export const getCompanyLogoUrl = (logoUrl) => {
  if (!logoUrl) return null;

  if (logoUrl.startsWith("http")) {
    return logoUrl;
  }

  return `${import.meta.env.VITE_BASE_URL}${logoUrl}`;
};
