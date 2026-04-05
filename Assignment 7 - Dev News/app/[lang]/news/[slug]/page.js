import NewsDetails from "@/components/NewsDetails";
import Header from "@/components/Header";
import { getDictionary } from "../../dictionaries";

const NewsDetailsPage = async ({ params: { slug, lang } }) => {
  const dictionary = await getDictionary(lang);

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -left-32 top-10 h-80 w-80 rounded-full"
          style={{
            background:
              "radial-gradient(circle, var(--glow-strong), transparent 70%)",
          }}
        ></div>
        <div
          className="absolute right-0 top-52 h-72 w-72 rounded-full"
          style={{
            background: "radial-gradient(circle, var(--glow), transparent 70%)",
          }}
        ></div>
        <div className="noise absolute inset-0"></div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Header dictionary={dictionary} />
        <main className="mt-12">
          <NewsDetails slug={slug} lang={lang} />
        </main>
      </div>
    </div>
  );
};

export default NewsDetailsPage;
