import { useState } from "react"
import { Star, Trash2, User } from "lucide-react"
import { useSession } from "@blitzjs/auth"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import createReview from "../../reviews/mutations/createReview"
import deleteReview from "../../reviews/mutations/deleteReview"
import getReviews from "../../reviews/queries/getReviews"

interface ReviewType {
  id: number
  userId: number
  user: {
    id: number
    name: string
  }
  rating: number
  comment: string
  createdAt: Date
}

interface ProductReviewsProps {
  productId: number
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const session = useSession()
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" })
  const [createReviewMutation] = useMutation(createReview)
  const [deleteReviewMutation] = useMutation(deleteReview)
  const [reviews, { refetch }] = useQuery(getReviews, { productId })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createReviewMutation({
        productId,
        rating: newReview.rating,
        comment: newReview.comment,
      })
      setNewReview({ rating: 0, comment: "" })
      await refetch()
    } catch (error) {
      console.error("Failed to create review:", error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteReviewMutation({ id })
      await refetch()
    } catch (error) {
      console.error("Failed to delete review:", error)
    }
  }

  const StarRating = ({
    rating,
    onRatingChange,
  }: {
    rating: number
    onRatingChange?: (rating: number) => void
  }) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 ${
            star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          } ${onRatingChange ? "cursor-pointer" : ""}`}
          onClick={() => onRatingChange && onRatingChange(star)}
        />
      ))}
    </div>
  )

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
      : 0

  const canDeleteReview = (review: ReviewType) => {
    return session.userId === review.userId || session.role === "ADMIN"
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Customer Reviews</CardTitle>
          <CardDescription>
            {reviews.length > 0 ? (
              <div className="flex items-center space-x-2">
                <span className="text-3xl font-bold">{averageRating}</span>
                <StarRating rating={Math.round(Number(averageRating))} />
                <span className="text-sm text-gray-500">({reviews.length} reviews)</span>
              </div>
            ) : (
              <span>No reviews yet. Be the first to review this product!</span>
            )}
          </CardDescription>
        </CardHeader>
        {session.userId ? (
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Your Rating</Label>
                <StarRating
                  rating={newReview.rating}
                  onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="comment">Your Review</Label>
                <Textarea
                  id="comment"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  required
                  placeholder="What did you think about this product?"
                  rows={4}
                />
              </div>
              <Button type="submit" className="w-full">
                Submit Review
              </Button>
            </form>
          </CardContent>
        ) : (
          <CardContent>
            <p className="text-center py-4 text-gray-500">
              Please{" "}
              <a href="/login" className="text-blue-600 hover:underline">
                sign in
              </a>{" "}
              to leave a review.
            </p>
          </CardContent>
        )}
      </Card>

      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-6 h-6" />
                    <span className="font-semibold">{review.user.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                    {canDeleteReview(review) && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your
                              review.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(review.id)}
                              className="mt-2"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
                <StarRating rating={review.rating} />
                <p className="mt-2 text-gray-700">{review.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No reviews yet. Be the first to share your thoughts!</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
