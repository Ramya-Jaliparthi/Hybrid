
export interface StarRatingComponentInputModelInterface {
    numberOfStars: number;
    starColor: string;
    inActiveStarColor: string;
    emptyStarBackgroundColor: string;
    ratingInPercentage: number;
    isInActive: boolean;
    totalRatings: number;
    overAllRating: number;
}

export interface StarRatingComponentDataModelInterface {
    ratingBarStyles: RatingBarStylesInterface;
    inActiveRatingBarStyles: RatingBarStylesInterface;
    solidStarStyles: SolidStarStylesInterface;
    starNumberRange: number[];
    starRating: number;
}

export interface RatingBarStylesInterface {
    color: string;
    width: string;
}

export interface SolidStarStylesInterface {
    width: string;
}





