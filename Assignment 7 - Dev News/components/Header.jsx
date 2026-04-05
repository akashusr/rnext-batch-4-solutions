const Header = ({ dictionary }) => {
  return (
    <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <div className="rounded-2xl bg-gradient-to-br from-cyan-300 via-emerald-300 to-sky-400 p-[1px] shadow-[0_0_30px_rgba(94,234,212,0.25)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-[15px] bg-[#0b0d12] text-lg font-semibold text-white">
            DN
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-white">
            {dictionary.title}
          </h1>
          <p className="mt-1 text-sm text-zinc-400">{dictionary.subtitle}</p>
        </div>
      </div>

      <div className="flex w-full items-center md:max-w-md">
        <div className="relative w-full">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <circle
                cx="11"
                cy="11"
                r="7"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M20 20L17 17"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <input
            type="search"
            placeholder={dictionary.searchPlaceholder}
            className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-sm text-white placeholder:text-zinc-500 shadow-[0_10px_30px_rgba(10,10,20,0.35)] outline-none ring-1 ring-transparent transition focus:border-cyan-300/40 focus:ring-cyan-300/20"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="rounded-full bg-white/10 p-[2px]">
          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&w=96&h=96&q=80"
            alt="User avatar"
            className="h-12 w-12 rounded-full object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-medium text-white">
            {dictionary.userName}
          </p>
          <p className="text-xs text-zinc-400">{dictionary.userRole}</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
