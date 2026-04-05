import Link from "next/link";
import Header from "@/components/Header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="px-4 py-6 md:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center py-16">
          <h1 className="text-6xl font-bold text-[#e50914] mb-4">404</h1>
          <h2 className="text-2xl font-medium mb-4">Video Not Found</h2>
          <p className="text-gray-400 mb-8">
            Sorry, we could not find the video you are looking for.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-[#e50914] text-white rounded-full hover:bg-[#f40612] transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </main>
    </>
  );
}
