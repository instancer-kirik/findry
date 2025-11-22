import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Camera,
  Flag,
  Calendar,
  User,
  Verified,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  isVerified: boolean;
  rating: number;
  cleanlinessRating: number;
  safetyRating: number;
  comment: string;
  photos?: string[];
  createdAt: Date;
  helpful: number;
  notHelpful: number;
  userVote?: 'helpful' | 'not-helpful';
  tags: string[];
}

interface BathroomReviewsProps {
  bathroomId: string;
  reviews: Review[];
  onSubmitReview?: (review: Omit<Review, 'id' | 'createdAt' | 'helpful' | 'notHelpful'>) => void;
  onVoteReview?: (reviewId: string, vote: 'helpful' | 'not-helpful') => void;
  onReportReview?: (reviewId: string, reason: string) => void;
  currentUserId?: string;
  className?: string;
}

const BathroomReviews: React.FC<BathroomReviewsProps> = ({
  bathroomId,
  reviews,
  onSubmitReview,
  onVoteReview,
  onReportReview,
  currentUserId,
  className = "",
}) => {
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    cleanlinessRating: 0,
    safetyRating: 0,
    comment: '',
    tags: [] as string[],
  });

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm', interactive: boolean = false, onRatingChange?: (rating: number) => void) => {
    const starSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${starSize} cursor-pointer transition-colors ${
          i < rating
            ? 'text-yellow-400 fill-yellow-400'
            : interactive
            ? 'text-gray-300 hover:text-yellow-200'
            : 'text-gray-300'
        }`}
        onClick={() => interactive && onRatingChange && onRatingChange(i + 1)}
      />
    ));
  };

  const handleSubmitReview = () => {
    if (onSubmitReview && newReview.rating > 0 && newReview.comment.trim()) {
      onSubmitReview({
        userId: currentUserId || 'anonymous',
        userName: 'Current User',
        isVerified: false,
        ...newReview,
      });
      setNewReview({
        rating: 0,
        cleanlinessRating: 0,
        safetyRating: 0,
        comment: '',
        tags: [],
      });
      setIsWritingReview(false);
    }
  };

  const commonTags = [
    'Clean',
    'Well-stocked',
    'Spacious',
    'Good lighting',
    'Safe area',
    'Quick access',
    'Family friendly',
    'Well maintained',
    'Private',
    'Quiet',
  ];

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  const ratingDistribution = Array.from({ length: 5 }, (_, i) => {
    const count = reviews.filter(review => Math.floor(review.rating) === 5 - i).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { stars: 5 - i, count, percentage };
  });

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Reviews & Ratings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center mb-2">
                {renderStars(averageRating, 'md')}
              </div>
              <p className="text-sm text-muted-foreground">
                Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map(({ stars, count, percentage }) => (
                <div key={stars} className="flex items-center gap-2 text-sm">
                  <span className="w-8">{stars}★</span>
                  <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Write Review */}
      {currentUserId && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Share Your Experience</CardTitle>
              {!isWritingReview && (
                <Button onClick={() => setIsWritingReview(true)}>
                  Write Review
                </Button>
              )}
            </div>
          </CardHeader>
          {isWritingReview && (
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Overall Rating</Label>
                  <div className="flex items-center gap-1 mt-1">
                    {renderStars(newReview.rating, 'md', true, (rating) =>
                      setNewReview(prev => ({ ...prev, rating }))
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Cleanliness</Label>
                  <div className="flex items-center gap-1 mt-1">
                    {renderStars(newReview.cleanlinessRating, 'md', true, (rating) =>
                      setNewReview(prev => ({ ...prev, cleanlinessRating: rating }))
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Safety</Label>
                  <div className="flex items-center gap-1 mt-1">
                    {renderStars(newReview.safetyRating, 'md', true, (rating) =>
                      setNewReview(prev => ({ ...prev, safetyRating: rating }))
                    )}
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="comment" className="text-sm font-medium">Your Review</Label>
                <Textarea
                  id="comment"
                  placeholder="Share details about your experience..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Add Tags (Optional)</Label>
                <div className="flex flex-wrap gap-2">
                  {commonTags.map(tag => (
                    <Badge
                      key={tag}
                      variant={newReview.tags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        setNewReview(prev => ({
                          ...prev,
                          tags: prev.tags.includes(tag)
                            ? prev.tags.filter(t => t !== tag)
                            : [...prev.tags, tag]
                        }));
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSubmitReview} disabled={!newReview.rating || !newReview.comment.trim()}>
                  Submit Review
                </Button>
                <Button variant="outline" onClick={() => setIsWritingReview(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
              <p className="text-muted-foreground">
                Be the first to share your experience with this bathroom facility.
              </p>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={review.userAvatar} alt={review.userName} />
                    <AvatarFallback>
                      {review.userName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{review.userName}</span>
                        {review.isVerified && (
                          <Verified className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDistanceToNow(review.createdAt, { addSuffix: true })}
                      </div>
                    </div>

                    {/* Ratings */}
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <span>Overall:</span>
                        {renderStars(review.rating)}
                      </div>
                      <div className="flex items-center gap-1">
                        <span>Cleanliness:</span>
                        {renderStars(review.cleanlinessRating)}
                      </div>
                      <div className="flex items-center gap-1">
                        <span>Safety:</span>
                        {renderStars(review.safetyRating)}
                      </div>
                    </div>

                    {/* Comment */}
                    <p className="text-sm leading-relaxed">{review.comment}</p>

                    {/* Tags */}
                    {review.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {review.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Photos */}
                    {review.photos && review.photos.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto">
                        {review.photos.map((photo, index) => (
                          <img
                            key={index}
                            src={photo}
                            alt={`Review photo ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-2">
                      <button
                        className={`flex items-center gap-1 text-sm transition-colors ${
                          review.userVote === 'helpful'
                            ? 'text-green-600'
                            : 'text-muted-foreground hover:text-green-600'
                        }`}
                        onClick={() => onVoteReview?.(review.id, 'helpful')}
                      >
                        <ThumbsUp className="h-3 w-3" />
                        Helpful ({review.helpful})
                      </button>
                      <button
                        className={`flex items-center gap-1 text-sm transition-colors ${
                          review.userVote === 'not-helpful'
                            ? 'text-red-600'
                            : 'text-muted-foreground hover:text-red-600'
                        }`}
                        onClick={() => onVoteReview?.(review.id, 'not-helpful')}
                      >
                        <ThumbsDown className="h-3 w-3" />
                        ({review.notHelpful})
                      </button>
                      <button
                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-red-600 transition-colors"
                        onClick={() => onReportReview?.(review.id, 'inappropriate')}
                      >
                        <Flag className="h-3 w-3" />
                        Report
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default BathroomReviews;
