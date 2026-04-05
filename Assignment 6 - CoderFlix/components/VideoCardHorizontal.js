import Link from "next/link";
import Image from "next/image";
import { generateSlug } from "@/lib/utils";

export default function VideoCardHorizontal({ video }) {
  const slug = generateSlug(video.videoTitle);

  return (
    <Link
      href={`/video/${slug}`}
      className="group flex gap-3 rounded-xl hover:bg-white/5 transition-colors p-2 -m-2"
    >
      <div className="relative w-40 sm:w-44 aspect-video flex-shrink-0 rounded-xl overflow-hidden bg-[#262626] ring-1 ring-white/5">
        <Image
          src={video.thumbnailURL}
          alt={video.videoTitle}
          fill
          className="object-cover group-hover:opacity-90 transition-opacity"
          sizes="(max-width: 640px) 160px, 176px"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
        <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs font-medium px-1.5 py-0.5 rounded">
          {video.duration}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm leading-tight mb-1 line-clamp-2 group-hover:text-[#e50914] transition-colors">
          {video.videoTitle}
        </h3>
        <p className="text-xs text-gray-400 mb-1">{video.channelName}</p>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <span>{video.views}</span>
          <span>•</span>
          <span>{video.publishedDate}</span>
        </div>
      </div>
    </Link>
  );
}
