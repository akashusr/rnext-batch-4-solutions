import NewsCard from "./NewsCard";

const NewsList = ({ news, dictionary, lang }) => {
  return (
    <main className="mt-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">
            {dictionary.trendingTitle}
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            {dictionary.trendingSubtitle}
          </p>
        </div>
      </div>

      <section className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {news.map((item, index) => (
          <NewsCard key={item.id} news={item} lang={lang} index={index} />
        ))}
      </section>
    </main>
  );
};

export default NewsList;
