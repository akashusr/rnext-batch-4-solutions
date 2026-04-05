export default function NotFoundMessage({ children }) {
    return (
        <div className="col-span-1 md:col-span-2 xl:col-span-3 flex justify-center items-center w-full h-[258px] text-base text-neutral-500 rounded-3xl border border-neutral-800 bg-neutral-900/70 p-6 shadow-2xl shadow-black/30 transition hover:-translate-y-1 hover:border-neutral-500/60 hover:shadow-neutral-500/20">
            {children}
        </div>
    );
}
