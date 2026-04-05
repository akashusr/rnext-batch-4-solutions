import React from "react";
import { validateForm } from "../utils/validation";
import Container from "./Container";
import FormElement from "./FormElement";
import Message from "./Message";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Select from "./ui/Select";

const initialBookmark = {
    id: null,
    url: "",
    color: "",
    category: "",
    username: "",
    password: "",
    createdAt: null,
};

const initialError = {
    url: "",
    color: "",
    category: "",
    username: "",
    password: "",
};

const categoryOptions = [
    { label: "Social", value: "social" },
    { label: "Video", value: "video" },
    { label: "Design", value: "design" },
    { label: "Streaming", value: "streaming" },
    {
        label: "Productivity",
        value: "productivity",
    },
    {
        label: "Entertainment",
        value: "entertainment",
    },
    { label: "Shopping", value: "shopping" },
    { label: "Music", value: "music" },
];

export default function Form({ setVaults }) {
    const [bookmark, setBookmark] = React.useState({ ...initialBookmark });
    const [error, setError] = React.useState({ ...initialError });

    function handleChange(e) {
        const { name, value } = e.target;
        setBookmark({
            ...bookmark,
            [name]: value,
        });
        setError({
            ...error,
            [name]: "",
        });
        // live update url and password validations
        if (
            name === "url" &&
            !/^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})?(\/[^\s]*)?$/.test(
                value
            )
        ) {
            setError({
                ...error,
                url: "Please enter a valid URL.",
            });
        }
        if (name === "password" && value.length < 6) {
            setError({
                ...error,
                password: "Password must be at least 6 characters long.",
            });
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        const hasError = validateForm(bookmark, setError);
        if (hasError) return;
        const newBookmark = {
            ...bookmark,
            id: crypto.randomUUID().slice(0, 5),
            createdAt: new Date().toISOString(),
        };
        setVaults((prevVaults) => [...prevVaults, newBookmark]);
        setBookmark({ ...initialBookmark });
    }

    function handleClean() {
        setBookmark({ ...initialBookmark });
        setError({ ...initialError });
    }

    return (
        <Container className="mt-8 px-4">
            <form
                onSubmit={handleSubmit}
                className="mb-10 rounded-2xl border border-neutral-800 bg-linear-to-br from-neutral-900/70 to-neutral-800/40 p-8 shadow-2xl shadow-black/40 backdrop-blur"
            >
                <div className="mb-8 flex flex-col gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-400">
                        New bookmark
                    </p>
                    <h2 className="text-2xl font-semibold">
                        Store website credentials safely
                    </h2>
                    <p className="text-sm text-neutral-400">
                        Fill the details below. Your brand color helps us render
                        a matching favicon.
                    </p>
                </div>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Website URL Input */}
                        <FormElement
                            hasError={!!error.url}
                            label={"Website URL"}
                        >
                            <Input
                                type={"text"}
                                placeholder={"https://example.com"}
                                name={"url"}
                                value={bookmark.url}
                                onInputChange={handleChange}
                            />
                            {error.url ? (
                                <Message
                                    message={error.url}
                                    hasError={true}
                                />
                            ) : (
                                <Message
                                    message={
                                        "Include https:// for best results."
                                    }
                                />
                            )}
                        </FormElement>
                        {/* Color Picker */}
                        <div
                            className={`rounded-2xl border ${
                                error.color
                                    ? "border-red-500 focus-within:border-red-500 focus-within:shadow-red-500/10"
                                    : "border-neutral-800 focus-within:border-blue-500 focus-within:shadow-blue-500/10"
                            } bg-neutral-900/60 p-5 text-sm transition  focus-within:bg-neutral-900 focus-within:shadow-lg`}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                                        Favicon color
                                    </p>
                                    <p className="text-xs text-neutral-500">
                                        Select the accent color we should
                                        render.
                                    </p>
                                </div>
                                <input
                                    type="color"
                                    name="color"
                                    value={bookmark.color}
                                    onChange={handleChange}
                                    className={`h-12 w-12 cursor-pointer rounded-full border border-neutral-700 ${
                                        error.color
                                            ? "bg-red-500/50 animate-pulse"
                                            : "bg-neutral-800"
                                    } p-1 shadow-inner shadow-black/50`}
                                />
                            </div>
                            <div className="mt-5 flex items-center gap-3 text-xs text-neutral-500">
                                <span
                                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full border ${
                                        error.color
                                            ? "border-red-500 text-red-500"
                                            : "border-neutral-700 text-neutral-400"
                                    } bg-neutral-800/80 text-[10px] font-semibold uppercase`}
                                >
                                    Hex
                                </span>
                                {error.color ? (
                                    <span className="text-red-500">
                                        {error.color}
                                    </span>
                                ) : (
                                    <span>
                                        Matches any brand primary color.
                                    </span>
                                )}
                            </div>
                        </div>
                        {/* Category Select */}
                        <FormElement
                            hasError={!!error.category}
                            label={"CATEGORY"}
                        >
                            <Select
                                name="category"
                                value={bookmark.category}
                                onSelectChange={handleChange}
                                placeholder={"Select Category"}
                                options={categoryOptions}
                            />
                            {error.category ? (
                                <Message
                                    message={error.category}
                                    hasError={true}
                                />
                            ) : (
                                <Message
                                    message={"Helps you filter quicker later."}
                                />
                            )}
                        </FormElement>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Username Input */}
                        <FormElement
                            hasError={!!error.username}
                            label={"USERNAME"}
                        >
                            <Input
                                type={"text"}
                                name={"username"}
                                placeholder={"Enter username"}
                                value={bookmark.username}
                                onInputChange={handleChange}
                            />
                            {error.username ? (
                                <Message
                                    message={error.username}
                                    hasError={true}
                                />
                            ) : (
                                <Message
                                    message={
                                        "Use workspace or personal handle."
                                    }
                                />
                            )}
                        </FormElement>
                        {/* Password Input */}
                        <FormElement
                            hasError={!!error.password}
                            label={"PASSWORD"}
                        >
                            <Input
                                type={"password"}
                                name={"password"}
                                placeholder={"Enter password"}
                                value={bookmark.password}
                                onInputChange={handleChange}
                            />
                            {error.password ? (
                                <Message
                                    message={error.password}
                                    hasError={true}
                                />
                            ) : (
                                <Message
                                    message={"Choose at least 6 characters."}
                                />
                            )}
                        </FormElement>
                    </div>
                </div>
                <div className="mt-10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="text-xs text-neutral-500">
                        By submitting you confirm the entry is safe to store.
                    </div>
                    <div className="flex flex-1 justify-end gap-3">
                        <Button
                            type="reset"
                            style="primary"
                            onBtnClick={handleClean}
                        >
                            Clear
                        </Button>
                        <Button
                            type="submit"
                            style="secondary"
                        >
                            Add Bookmark
                        </Button>
                    </div>
                </div>
            </form>
        </Container>
    );
}
