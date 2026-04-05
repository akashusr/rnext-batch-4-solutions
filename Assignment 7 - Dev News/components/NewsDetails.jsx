import Link from "next/link";
import { formatCount, formatDate } from "@/lib/utils";
import { getDictionary } from "@/app/[lang]/dictionaries";
import { notFound } from "next/navigation";
import BackButton from "./BackButton";

async function getNewsData() {
  const newsData = await import("@/public/data.json"); //dynamic import
  return newsData.default;
}

const NewsDetails = async ({ slug, lang }) => {
  const dictionary = await getDictionary(lang);
  const allNews = await getNewsData();
  const news = allNews.find((item) => item.slug === slug);

  if (!news) {
    notFound();
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <BackButton dictionary={dictionary} />
      </div>{" "}
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <article className="rounded-2xl bg-gradient-to-br from-white/15 via-white/5 to-transparent p-[1px] reveal">
          <div className="rounded-2xl border border-white/10 bg-[var(--surface)] p-6 shadow-[0_24px_50px_rgba(5,8,16,0.55)]">
            <h3 className="text-3xl font-semibold text-white">{news.title}</h3>
            <p className="mt-3 text-base text-zinc-300">
              {news.description.length > 200
                ? `${news.description.substring(0, 200)}...`
                : news.description}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <img
                  src={`/images/${news.author_avatar}`}
                  alt={news.author_name}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-white">
                  {news.author_name}
                </span>
              </div>
              <span className="text-xs text-zinc-500">•</span>
              <span>
                {dictionary.publishedOn} {formatDate(news.published_date)}
              </span>
            </div>
            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
              <img
                src={`/images/${news.thumbnail}`}
                alt={news.title}
                className="h-full w-full object-cover"
              />
            </div>
            {news.description.length > 200 && (
              <div className="mt-6 space-y-4 text-sm leading-7 text-zinc-300">
                <p>{news.description.substring(200)}</p>
              </div>
            )}
          </div>
        </article>

        <aside className="space-y-6">
          <div
            className="rounded-2xl bg-gradient-to-br from-white/15 via-white/5 to-transparent p-[1px] reveal"
            style={{ animationDelay: "120ms" }}
          >
            <div className="rounded-2xl border border-white/10 bg-[var(--surface)] p-5 shadow-[0_24px_50px_rgba(5,8,16,0.55)]">
              <h4 className="text-sm font-semibold text-white">
                {dictionary.engagement}
              </h4>
              <div className="mt-4 space-y-3 text-sm text-zinc-300">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
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
                    {dictionary.upvotes}
                  </span>
                  <span className="text-white">
                    {formatCount(news.upvotes)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
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
                    {dictionary.downvotes}
                  </span>
                  <span className="text-white">
                    {formatCount(news.downvotes)}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-zinc-400">
                <span className="flex items-center gap-2">
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
                  {dictionary.views}
                </span>
                <span className="text-white">{formatCount(news.views)}</span>
              </div>
            </div>
          </div>

          <div
            className="rounded-2xl bg-gradient-to-br from-white/15 via-white/5 to-transparent p-[1px] reveal"
            style={{ animationDelay: "200ms" }}
          >
            <div className="rounded-2xl border border-white/10 bg-[var(--surface)] p-5 shadow-[0_24px_50px_rgba(5,8,16,0.55)]">
              <h4 className="text-sm font-semibold text-white">
                {dictionary.tags}
              </h4>
              <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-cyan-200/80">
                {news.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div
            className="rounded-2xl bg-gradient-to-br from-white/15 via-white/5 to-transparent p-[1px] reveal"
            style={{ animationDelay: "280ms" }}
          >
            <div className="rounded-2xl border border-white/10 bg-[var(--surface)] p-5 shadow-[0_24px_50px_rgba(5,8,16,0.55)]">
              <h4 className="text-sm font-semibold text-white">
                {dictionary.author}
              </h4>
              <div className="mt-4 flex items-center gap-3">
                <div className="rounded-full bg-white/10 p-[2px]">
                  <img
                    src={`/images/${news.author_avatar}`}
                    alt={news.author_name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {news.author_name}
                  </p>
                  <p className="text-xs text-zinc-400">Developer</p>
                </div>
              </div>
              <p className="mt-4 text-xs text-zinc-400">
                {dictionary.publishedOn}{" "}
                <time dateTime={news.published_date}>
                  {formatDate(news.published_date)}
                </time>
              </p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default NewsDetails;
