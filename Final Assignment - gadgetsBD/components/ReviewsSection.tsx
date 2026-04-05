"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Star, Edit2, Trash2, X, Camera } from "lucide-react";
import { useToast } from "@/components/Toast";

interface ReviewUser {
    _id: string;
    name: string;
    email: string;
}

interface ReviewData {
    _id: string;
    userId: ReviewUser;
    rating: number;
    title?: string;
    comment: string;
    createdAt: string;
}

interface ReviewsSectionProps {
    productId: string;
    averageRating: number;
    totalReviews: number;
    productTitle?: string;
    productImage?: string;
}

export default function ReviewsSection({ productId, averageRating, totalReviews, productTitle, productImage }: ReviewsSectionProps) {
    const { data: session } = useSession();
    const toast = useToast();
    const [reviews, setReviews] = useState<ReviewData[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [canReview, setCanReview] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingReview, setEditingReview] = useState<ReviewData | null>(null);

    // Form state
    const [formRating, setFormRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [formTitle, setFormTitle] = useState("");
    const [formComment, setFormComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [formImages, setFormImages] = useState<File[]>([]);
    const [formImagePreviews, setFormImagePreviews] = useState<string[]>([]);

    const fetchReviews = useCallback(async (pageNum: number, append = false) => {
        try {
            const params = new URLSearchParams({
                productId,
                page: pageNum.toString(),
                limit: "5",
            });
            if (session?.user?.id) params.set("userId", session.user.id);

            const res = await fetch(`/api/reviews?${params.toString()}`);
            const data = await res.json();

            if (append) {
                setReviews((prev) => [...prev, ...data.reviews]);
            } else {
                setReviews(data.reviews);
            }
            setHasMore(data.pagination.hasMore);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [productId, session?.user?.id]);

    const checkEligibility = useCallback(async () => {
        if (!session?.user?.id) return;
        try {
            const res = await fetch(`/api/reviews/check-eligibility?productId=${productId}`);
            const data = await res.json();
            setCanReview(data.canReview);
        } catch (error) {
            console.error("Error checking eligibility:", error);
        }
    }, [productId, session?.user?.id]);

    useEffect(() => {
        fetchReviews(1);
        checkEligibility();
    }, [fetchReviews, checkEligibility]);

    const handleLoadMore = () => {
        setLoadingMore(true);
        const nextPage = page + 1;
        setPage(nextPage);
        fetchReviews(nextPage, true);
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formRating === 0) {
            toast.error("Please select a rating");
            return;
        }
        setSubmitting(true);
        try {
            // Upload images first if any
            let uploadedImageUrls: string[] = [];
            if (formImages.length > 0) {
                const formData = new FormData();
                formImages.forEach((file) => formData.append("files", file));
                try {
                    const uploadRes = await fetch("/api/upload/review", {
                        method: "POST",
                        body: formData,
                    });
                    if (uploadRes.ok) {
                        const uploadData = await uploadRes.json();
                        uploadedImageUrls = uploadData.images.map((img: any) => img.url);
                    } else {
                        const errData = await uploadRes.json().catch(() => ({}));
                        toast.error(errData.error || "Failed to upload images");
                        setSubmitting(false);
                        return;
                    }
                } catch (uploadErr) {
                    console.error("Image upload error:", uploadErr);
                    toast.error("Failed to upload images. Please try again.");
                    setSubmitting(false);
                    return;
                }
            }

            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, rating: formRating, title: formTitle, comment: formComment, images: uploadedImageUrls }),
            });

            if (res.ok) {
                setShowForm(false);
                setFormRating(0);
                setHoverRating(0);
                setFormTitle("");
                setFormComment("");
                setFormImages([]);
                setFormImagePreviews([]);
                setPage(1);
                await fetchReviews(1);
                setCanReview(false);
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to submit review");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingReview) return;
        if (formRating === 0) {
            toast.error("Please select a rating");
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch(`/api/reviews/${editingReview._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating: formRating, title: formTitle, comment: formComment }),
            });

            if (res.ok) {
                setEditingReview(null);
                setPage(1);
                await fetchReviews(1);
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to update review");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteReview = async (reviewId: string) => {
        if (!confirm("Are you sure you want to delete this review?")) return;
        try {
            const res = await fetch(`/api/reviews/${reviewId}`, { method: "DELETE" });
            if (res.ok) {
                setPage(1);
                await fetchReviews(1);
                setCanReview(true);
            } else {
                toast.error("Failed to delete review");
            }
        } catch {
            toast.error("Something went wrong");
        }
    };

    const startEdit = (review: ReviewData) => {
        setEditingReview(review);
        setFormRating(review.rating);
        setHoverRating(0);
        setFormTitle(review.title || "");
        setFormComment(review.comment);
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const getRatingLabel = (rating: number) => {
        const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
        return labels[rating] || "";
    };

    const renderStars = (rating: number, size = "w-4 h-4") => (
        <div className="flex text-amazon-secondary">
            {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className={`${size} ${i <= rating ? "fill-current" : ""}`} />
            ))}
        </div>
    );

    // Review form component — matching ReviewModal.html design
    const ReviewForm = ({ isEdit = false }: { isEdit?: boolean }) => {
        const activeRating = hoverRating || formRating;

        return (
            <div className="bg-white border border-gray-200 rounded-lg mb-8">
                {/* Header with close button */}
                <div className="flex justify-between items-center px-6 pt-6">
                    <h2 className="text-3xl font-normal">
                        {isEdit ? "Edit Review" : "Create Review"}
                    </h2>
                    <button
                        onClick={() => {
                            setShowForm(false);
                            setEditingReview(null);
                            setHoverRating(0);
                            setFormImages([]);
                            setFormImagePreviews([]);
                        }}
                        className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Product info strip */}
                {productTitle && (
                    <div className="flex items-center gap-4 border-b border-gray-200 px-6 py-6">
                        {productImage ? (
                            <img
                                src={productImage}
                                className="w-16 h-16 object-cover border border-gray-200 rounded"
                                alt={productTitle}
                            />
                        ) : (
                            <div className="w-16 h-16 bg-gray-100 border border-gray-200 rounded flex items-center justify-center text-2xl">
                                📦
                            </div>
                        )}
                        <h3 className="font-bold text-sm">{productTitle}</h3>
                    </div>
                )}

                <form onSubmit={isEdit ? handleEditReview : handleSubmitReview} className="px-6 pb-6">
                    <div className="space-y-10 pt-6">
                        {/* 1. Overall Rating */}
                        <section className="space-y-4">
                            <h3 className="text-xl font-bold">Overall rating</h3>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => setFormRating(i)}
                                            onMouseEnter={() => setHoverRating(i)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="transition-transform hover:scale-110 cursor-pointer"
                                        >
                                            <Star
                                                className={`w-8 h-8 fill-current ${i <= activeRating
                                                    ? "text-amazon-yellow"
                                                    : "text-gray-300"
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                {activeRating > 0 && (
                                    <span className="text-sm text-gray-600 font-medium">
                                        {getRatingLabel(activeRating)}
                                    </span>
                                )}
                            </div>
                        </section>

                        <hr className="border-gray-200" />

                        {/* 2. Add a photo or video */}
                        <section className="space-y-4">
                            <h3 className="text-xl font-bold">Add a photo or video</h3>
                            <p className="text-sm">
                                Shoppers find images and videos more helpful than text alone.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {formImagePreviews.map((src, idx) => (
                                    <div key={idx} className="relative w-24 h-24 group">
                                        <img
                                            src={src}
                                            className="w-full h-full object-cover rounded-lg border border-gray-200"
                                            alt={`Preview ${idx + 1}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFormImages((prev) => prev.filter((_, i) => i !== idx));
                                                setFormImagePreviews((prev) => prev.filter((_, i) => i !== idx));
                                            }}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                                {formImages.length < 5 && (
                                    <label className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-amazon-blue transition-colors gap-2">
                                        <Camera className="w-8 h-8 text-gray-400" />
                                        <span className="text-xs text-gray-500">Add media</span>
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            multiple
                                            className="hidden"
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files || []);
                                                const remaining = 5 - formImages.length;
                                                const newFiles = files.slice(0, remaining);
                                                setFormImages((prev) => [...prev, ...newFiles]);
                                                newFiles.forEach((file) => {
                                                    const reader = new FileReader();
                                                    reader.onload = (ev) => {
                                                        setFormImagePreviews((prev) => [...prev, ev.target?.result as string]);
                                                    };
                                                    reader.readAsDataURL(file);
                                                });
                                                e.target.value = "";
                                            }}
                                        />
                                    </label>
                                )}
                            </div>
                        </section>

                        <hr className="border-gray-200" />

                        {/* 3. Add a headline */}
                        <section className="space-y-4">
                            <h3 className="text-xl font-bold">Add a headline</h3>
                            <input
                                type="text"
                                value={formTitle}
                                onChange={(e) => setFormTitle(e.target.value)}
                                placeholder="What's most important to know?"
                                className="w-full border border-gray-300 rounded p-2 outline-none focus:ring-1 focus:ring-amazon-blue"
                            />
                        </section>

                        <hr className="border-gray-200" />

                        {/* 4. Add a written review */}
                        <section className="space-y-4">
                            <h3 className="text-xl font-bold">Add a written review</h3>
                            <textarea
                                rows={6}
                                value={formComment}
                                onChange={(e) => setFormComment(e.target.value)}
                                required
                                placeholder="What did you like or dislike? What did you use this product for?"
                                className="w-full border border-gray-300 rounded p-4 outline-none focus:ring-1 focus:ring-amazon-blue"
                            />
                        </section>

                        {/* Submit */}
                        <div className="border-t border-gray-200 pt-8 flex justify-end">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="bg-amazon-yellow hover:bg-amazon-yellow-hover px-8 py-2 rounded-md shadow-sm border border-amazon-secondary font-bold disabled:opacity-50 cursor-pointer"
                            >
                                {submitting
                                    ? "Submitting..."
                                    : isEdit
                                        ? "Update"
                                        : "Submit"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        );
    };

    return (
        <div>
            {/* Review Form (new) */}
            {showForm && <ReviewForm />}

            {/* Edit Form */}
            {editingReview && <ReviewForm isEdit />}

            {/* Header + Write Review button (only when form is NOT showing) */}
            {!showForm && !editingReview && (
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Customer Reviews</h2>
                    {canReview && (
                        <button
                            onClick={() => {
                                setShowForm(true);
                                setFormRating(0);
                                setHoverRating(0);
                                setFormTitle("");
                                setFormComment("");
                            }}
                            className="bg-amazon-yellow hover:bg-amazon-yellow-hover px-4 py-2 rounded-md text-sm font-medium border border-amazon-secondary cursor-pointer"
                        >
                            Write a Review
                        </button>
                    )}
                </div>
            )}

            {/* Rating Summary */}
            <div className="mb-6 flex items-center gap-4">
                <div className="flex items-center gap-2">
                    {renderStars(Math.round(averageRating), "w-5 h-5")}
                    <span className="text-lg font-bold">{averageRating} out of 5</span>
                </div>
                <span className="text-sm text-gray-600">{totalReviews} global ratings</span>
            </div>

            {/* Review List */}
            {loading ? (
                <p className="text-gray-500">Loading reviews...</p>
            ) : reviews.length === 0 ? (
                <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
            ) : (
                <div className="space-y-6">
                    {reviews.map((review) => {
                        const isOwn = session?.user?.id === review.userId?._id;
                        return (
                            <div key={review._id} className="border-b border-gray-200 pb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold">
                                            {getInitials(review.userId?.name || "U")}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">
                                                {review.userId?.name || "Anonymous"}
                                                {isOwn && (
                                                    <span className="text-amazon-blue text-xs ml-2">(You)</span>
                                                )}
                                            </p>
                                            {renderStars(review.rating, "w-3 h-3")}
                                        </div>
                                    </div>
                                    {isOwn && !editingReview && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => startEdit(review)}
                                                className="text-amazon-blue hover:underline text-xs flex items-center gap-1 cursor-pointer"
                                            >
                                                <Edit2 className="w-3 h-3" /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteReview(review._id)}
                                                className="text-red-600 hover:underline text-xs flex items-center gap-1 cursor-pointer"
                                            >
                                                <Trash2 className="w-3 h-3" /> Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {review.title && <h4 className="font-bold text-sm mb-1">{review.title}</h4>}
                                <p className="text-xs text-gray-500 mb-2">
                                    Reviewed on {new Date(review.createdAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                                <p className="text-sm">{review.comment}</p>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Load More */}
            {hasMore && (
                <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="mt-6 px-6 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                >
                    {loadingMore ? "Loading..." : "Load More Reviews"}
                </button>
            )}
        </div>
    );
}
