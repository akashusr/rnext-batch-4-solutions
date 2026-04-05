/**
 * Generate a URL-friendly slug from a title
 * @param {string} title - The video title
 * @returns {string} - URL-friendly slug
 */
export function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim();
}

/**
 * Get all videos from the JSON file
 * @returns {Array} - Array of video objects
 */
export function getAllVideos() {
  const videos = require("../data/videos.json");
  return videos;
}

/**
 * Get a video by its slug
 * @param {string} slug - The video slug
 * @returns {Object|null} - Video object or null if not found
 */
export function getVideoBySlug(slug) {
  const videos = getAllVideos();
  return (
    videos.find((video) => generateSlug(video.videoTitle) === slug) || null
  );
}

/**
 * Get similar videos based on categories
 * @param {Object} currentVideo - The current video object
 * @param {number} limit - Maximum number of similar videos to return
 * @returns {Array} - Array of similar video objects
 */
export function getSimilarVideos(currentVideo, limit = 10) {
  if (!currentVideo || !currentVideo.categories) return [];

  const allVideos = getAllVideos();
  const currentCategories = currentVideo.categories;

  // Filter out current video and calculate similarity score
  const similarVideos = allVideos
    .filter((video) => video.videoTitle !== currentVideo.videoTitle)
    .map((video) => {
      const matchCount = video.categories.filter((cat) =>
        currentCategories.includes(cat)
      ).length;
      return { ...video, matchCount };
    })
    .filter((video) => video.matchCount > 0) // Only videos with at least one matching category
    .sort((a, b) => b.matchCount - a.matchCount) // Sort by match count
    .slice(0, limit);

  return similarVideos;
}

/**
 * Format number to K/M format
 * @param {number} num - The number to format
 * @returns {string} - Formatted string
 */
export function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}
