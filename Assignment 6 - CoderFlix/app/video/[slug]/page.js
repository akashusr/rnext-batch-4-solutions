import { notFound } from "next/navigation";
import Header from "@/components/Header";
import VideoCardHorizontal from "@/components/VideoCardHorizontal";
import { getVideoBySlug, getSimilarVideos, formatNumber } from "@/lib/utils";
import Image from "next/image";

export default function VideoDetailsPage({ params }) {
  const { slug } = params;
  const video = getVideoBySlug(slug);

  if (!video) {
    notFound();
  }

  const similarVideos = getSimilarVideos(video, 10);

  // Extract video ID from YouTube URL
  const getYouTubeEmbedUrl = (url) => {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}?rel=0`;
  };

  return (
    <>
      <Header />
      <main className="px-4 py-6 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Primary Section */}
            <section className="lg:col-span-8">
              {/* Video Player */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black ring-1 ring-white/10">
                <iframe
                  className="w-full h-full"
                  title="Video player"
                  src={getYouTubeEmbedUrl(video.videoURL)}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              {/* Video Info */}
              <div className="mt-4">
                <h1 className="text-lg sm:text-xl font-medium leading-snug">
                  {video.videoTitle}
                </h1>

                <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="text-sm text-gray-400">
                    <span>{video.views}</span>
                    <span className="mx-1">•</span>
                    <span>{video.publishedDate}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="inline-flex items-center rounded-full border border-[#303030] overflow-hidden bg-[#1f1f1f]">
                      <button
                        className="px-4 py-2 flex items-center gap-2 hover:bg-[#262626] transition-colors"
                        type="button"
                        aria-label="Like"
                      >
                        <svg
                          className="w-5 h-5 text-gray-200"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9A2 2 0 0 0 19.68 9H14z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"
                          />
                        </svg>
                        <span className="text-sm font-medium text-[#e5e5e5]">
                          {formatNumber(video.likes)}
                        </span>
                      </button>
                      <div className="w-px h-8 bg-[#303030]" />
                      <button
                        className="px-4 py-2 flex items-center gap-2 hover:bg-[#262626] transition-colors"
                        type="button"
                        aria-label="Dislike"
                      >
                        <svg
                          className="w-5 h-5 text-gray-200"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7L2.34 12a2 2 0 0 0 1.98 3H10z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"
                          />
                        </svg>
                        <span className="text-sm font-medium text-[#e5e5e5]">
                          {formatNumber(video.dislikes)}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Channel Info */}
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Image
                      src={video.channelAvatar}
                      alt={`${video.channelName} avatar`}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover bg-[#262626] ring-1 ring-white/10 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-medium leading-tight truncate">
                        {video.channelName}
                      </p>
                      <p className="text-xs text-gray-400">Publisher</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-4">
                  <div className="bg-[#1f1f1f] border border-[#262626] rounded-xl p-4">
                    <p className="text-sm text-gray-200 whitespace-pre-line">
                      {video.description ||
                        `Categories: ${video.categories.join(" • ")}`}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Similar Videos Section */}
            <aside className="lg:col-span-4">
              <h2 className="text-base font-medium mb-4">Similar videos</h2>
              <div className="space-y-3">
                {similarVideos.length > 0 ? (
                  similarVideos.map((similarVideo, index) => (
                    <VideoCardHorizontal key={index} video={similarVideo} />
                  ))
                ) : (
                  <p className="text-sm text-gray-400">
                    No similar videos found
                  </p>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
