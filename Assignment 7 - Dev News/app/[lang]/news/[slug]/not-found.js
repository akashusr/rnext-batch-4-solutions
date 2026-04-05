"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NotFound() {
  const pathname = usePathname();

  // Extract slug from pathname
  const slug = pathname ? pathname.split("/").pop() : "unknown";

  return (
    <div className="relative overflow-hidden min-h-screen flex items-center justify-center">
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

      <div className="relative text-center px-4">
        <div className="rounded-2xl bg-gradient-to-br from-white/15 via-white/5 to-transparent p-[1px]">
          <div className="rounded-2xl border border-white/10 bg-[var(--surface)] p-8 shadow-[0_24px_50px_rgba(5,8,16,0.55)]">
            <div className="flex justify-center mb-6">
              <div className="rounded-2xl bg-gradient-to-br from-cyan-300 via-emerald-300 to-sky-400 p-[1px] shadow-[0_0_30px_rgba(94,234,212,0.25)]">
                <div className="flex h-16 w-16 items-center justify-center rounded-[15px] bg-[#0b0d12] text-2xl font-semibold text-white">
                  404
                </div>
              </div>
            </div>

            <h1 className="text-3xl font-semibold text-white mb-4">
              News Not Found
            </h1>
            <p className="text-zinc-400 mb-6 max-w-md">
              This News with{" "}
              <span className="text-cyan-300 font-medium">{slug}</span> id was
              not found!
            </p>

            <Link
              href="/en"
              className="inline-block rounded-full border border-cyan-300/40 bg-cyan-300/10 px-6 py-3 text-sm font-medium text-cyan-200 transition hover:bg-cyan-300/20"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
