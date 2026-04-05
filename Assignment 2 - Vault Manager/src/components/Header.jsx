import { getCurrentTime, getGreetingMessage } from "../utils";
import Container from "./Container";

export default function Header() {
    return (
        <header className="border-b border-neutral-800 bg-linear-to-b from-neutral-950 via-neutral-900/80 to-transparent">
            <Container className="px-6 py-12 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-400">
                        Vault overview
                    </p>
                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                        <h1 className="text-4xl font-semibold tracking-tight">
                            Good {getGreetingMessage()}, World!
                        </h1>
                        <span className="inline-flex items-center gap-2 rounded-full border border-neutral-800/80 bg-neutral-900/70 px-4 py-1 text-xs font-medium text-neutral-300">
                            <span className="h-2 w-2 rounded-full bg-emerald-400" />
                            {getCurrentTime()}
                        </span>
                    </div>
                    <p className="text-sm text-neutral-400 max-w-2xl">
                        Keep your most-used credentials organised and in sync
                        with every device. Review the snapshot below before
                        adding a new bookmark.
                    </p>
                </div>
            </Container>
        </header>
    );
}
