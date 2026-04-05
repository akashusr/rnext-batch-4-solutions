"use client";

import { useRouter } from "next/navigation";

const BackButton = ({ dictionary }) => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white transition hover:border-cyan-300/40 hover:text-cyan-200"
    >
      {dictionary.backToHome}
    </button>
  );
};

export default BackButton;
