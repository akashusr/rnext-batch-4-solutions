import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";
import { getAllVideos } from "@/lib/utils";

export default function Home() {
  const videos = getAllVideos();

  return (
    <>
      <Header />
      <main className="px-4 py-6 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {videos.map((video, index) => (
            <VideoCard key={index} video={video} />
          ))}
        </div>
      </main>
    </>
  );
}
