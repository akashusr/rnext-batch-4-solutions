import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#141414] border-b border-[#262626]">
      <div className="flex items-center justify-between px-4 py-2 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors md:hidden">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <Link href="/" className="flex items-center gap-1">
            <Image
              src="/Logo.svg"
              alt="CoderFlix"
              width={48}
              height={48}
              className="h-12 w-auto"
            />
            <span className="text-xl font-medium hidden sm:inline">
              CoderFlix
            </span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-4 hidden md:flex">
          <div className="flex w-full">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search"
                className="w-full px-4 py-2 border border-[#303030] bg-[#1f1f1f] text-[#e5e5e5] placeholder:text-gray-500 rounded-l-full focus:border-[#e50914] focus:ring-2 focus:ring-[#e50914]/40 focus:outline-none"
              />
            </div>
            <button className="px-6 py-2 bg-[#1f1f1f] border border-l-0 border-[#303030] rounded-r-full hover:bg-[#262626] transition-colors">
              <svg
                className="w-5 h-5 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
          <button className="ml-2 p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg
              className="w-6 h-6 text-gray-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </button>
        </div>

        {/* Search Icon (Mobile) */}
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors md:hidden">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors hidden sm:block">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors hidden sm:block">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>
          <button className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-900 text-white font-medium flex items-center justify-center hover:opacity-90 transition-opacity">
            <span className="text-sm">JD</span>
          </button>
        </div>
      </div>
    </header>
  );
}
