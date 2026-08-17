import { Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarImage } from "../../components/ui/avatar";
import { ButtonGroup, ButtonGroupSeparator } from "../../components/ui/button-group";

interface ReviewCardProps {
  customerName: string;
  customerAvatar?: string;
  rating: number;
  reviewDate: string;
  totalSpend: number;
  totalReviews: number;
  reviewText: string;
}

export const ReviewCard = ({ review }: { review: ReviewCardProps }) => {
  const renderStars = () => {
    return Array(5)
      .fill("")
      .map((_, i) =>
        i < review.rating ? (
          <Star key={i} className="size-4 fill-amber-500 text-amber-500 lg:size-5" />
        ) : (
          <Star key={i} className="text-muted-foreground size-4 lg:size-5" />
        )
      );
  };

  return (
    <div className="flex gap-4">
      <Avatar className="size-12 rounded-none lg:size-20">
        <AvatarImage
          src={review.customerAvatar}
          alt={review.customerName}
          className="object-cover"
        />
      </Avatar>

      {/* Content */}
      <div className="min-w-0 flex-1">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            <h3 className="mb-1 font-semibold">{review.customerName}</h3>
            <div className="text-muted-foreground flex gap-1 text-sm">
              Total Spend: <span className="font-semibold">${review.totalSpend}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-1">{renderStars()}</div>
            <span className="text-muted-foreground text-sm whitespace-nowrap">
              {review.reviewDate}
            </span>
          </div>
        </div>

        {/* Review Text */}
        <p className="text-muted-foreground mb-4 leading-relaxed">{review.reviewText}</p>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ButtonGroup>
            <Button variant="secondary" size="sm">
              <ThumbsUp />
            </Button>
            <ButtonGroupSeparator />
            <Button variant="outline" size="icon-sm" disabled>
              15
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button variant="secondary" size="sm">
              <ThumbsDown />
            </Button>
            <ButtonGroupSeparator />
            <Button variant="outline" size="icon-sm" disabled>
              2
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
};
