import React from "react";
import { getDomain, getShortName, getWebsiteName } from "../utils";

export default function PasswordCard({ vault }) {
    const [isRevealed, setIsRevealed] = React.useState(false);
    const { url, color, category, username, password } = vault || {};
    return (
        <article className="rounded-3xl border border-neutral-800 bg-neutral-900/70 p-6 shadow-2xl shadow-black/30 transition hover:-translate-y-1 hover:border-blue-500/60 hover:shadow-blue-500/20">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div
                        className="flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-800"
                        style={{ backgroundColor: `${color}70` }}
                    >
                        {getShortName(url)}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">
                            {getWebsiteName(url)}
                        </h3>
                        <p className="text-xs uppercase tracking-wide text-neutral-500">
                            {category?.toUpperCase()}
                        </p>
                    </div>
                </div>
            </div>
            <p className="mt-4 text-sm text-neutral-400">{getDomain(url)}</p>
            <dl className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900/60 px-4 py-3">
                    <dt className="text-xs uppercase tracking-wide text-neutral-500">
                        Username
                    </dt>
                    <dd className="text-neutral-50">{username}</dd>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900/60 px-4 py-3">
                    <dt className="text-xs uppercase tracking-wide text-neutral-500">
                        Password
                    </dt>
                    <dd className="flex items-center gap-2 text-neutral-50">
                        {isRevealed ? (
                            <span>{password}</span>
                        ) : (
                            <span>••••••••</span>
                        )}
                        {isRevealed ? (
                            <button
                                onClick={() => setIsRevealed(!isRevealed)}
                                className="text-xs font-semibold text-red-400 cursor-pointer"
                            >
                                Hide
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsRevealed(!isRevealed)}
                                className="text-xs font-semibold text-blue-400 cursor-pointer"
                            >
                                Reveal
                            </button>
                        )}
                    </dd>
                </div>
            </dl>
        </article>
    );
}
