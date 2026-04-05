import Link from "next/link";
import Image from "next/image";
import { generateSlug } from "@/lib/utils";

export default function VideoCard({ video }) {
  const slug = generateSlug(video.videoTitle);

  return (
    <Link
      href={`/video/${slug}`}
      className="group block transition-transform hover:scale-[1.01]"
    >
      <div className="relative aspect-video rounded-xl overflow-hidden bg-[#262626] mb-3 ring-1 ring-white/5">
        <Image
          src={video.thumbnailURL}
          alt={video.videoTitle}
          fill
          className="object-cover group-hover:opacity-90 transition-opacity"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs font-medium px-1.5 py-0.5 rounded">
          {video.duration}
        </div>
      </div>
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <Image
            src={video.channelAvatar}
            alt={`${video.channelName} avatar`}
            width={36}
            height={36}
            className="w-9 h-9 rounded-full object-cover bg-[#262626] ring-1 ring-white/10"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm leading-tight mb-1 line-clamp-2 group-hover:text-[#e50914] transition-colors">
            {video.videoTitle}
          </h3>
          <p className="text-xs text-gray-400 mb-0.5">{video.channelName}</p>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <span>{video.views}</span>
            <span>•</span>
            <span>{video.publishedDate}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
