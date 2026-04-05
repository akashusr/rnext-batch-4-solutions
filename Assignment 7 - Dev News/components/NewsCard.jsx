"use client";

import Link from "next/link";
import { formatCount, getDaysAgo } from "@/lib/utils";

const NewsCard = ({ news, lang, index }) => {
  return (
    <div
      className="rounded-2xl bg-gradient-to-br from-white/15 via-white/5 to-transparent p-[1px] reveal"
      style={{ animationDelay: `${index * 120}ms` }}
    >
      <Link href={`/${lang}/news/${news.slug}`}>
        <article className="group h-full rounded-2xl border border-white/10 bg-[var(--surface)] p-5 shadow-[0_24px_50px_rgba(5,8,16,0.55)] transition hover:-translate-y-1 hover:border-cyan-300/40 cursor-pointer">
          <div className="aspect-video overflow-hidden rounded-xl">
            <img
              src={`/images/${news.thumbnail}`}
              alt={news.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <img
                src={`/images/${news.author_avatar}`}
                alt={news.author_name}
                className="h-7 w-7 rounded-full object-cover"
              />
              <span>{news.author_name}</span>
            </div>
            <span>{getDaysAgo(news.published_date)}</span>
          </div>
          <h3 className="mt-3 text-lg font-semibold text-white line-clamp-2">
            {news.title}
          </h3>
          <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-cyan-200/80">
            {news.tags.map((tag, idx) => (
              <span
                key={idx}
                className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2 py-1"
              >
                #{tag}
              </span>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4 text-emerald-300"
                >
                  <path
                    d="M12 4L5 11H9V20H15V11H19L12 4Z"
                    fill="currentColor"
                  />
                </svg>
                {formatCount(news.upvotes)}
              </span>
              <span className="flex items-center gap-1">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4 text-rose-300"
                >
                  <path
                    d="M12 20L19 13H15V4H9V13H5L12 20Z"
                    fill="currentColor"
                  />
                </svg>
                {formatCount(news.downvotes)}
              </span>
            </div>
            <span className="flex items-center gap-1">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4 text-zinc-500"
              >
                <path
                  d="M2 12C4.5 7 7.5 5 12 5C16.5 5 19.5 7 22 12C19.5 17 16.5 19 12 19C7.5 19 4.5 17 2 12Z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
              </svg>
              {formatCount(news.views)} views
            </span>
          </div>
        </article>
      </Link>
    </div>
  );
};

export default NewsCard;
