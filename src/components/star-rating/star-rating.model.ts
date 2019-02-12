import {
    StarRatingComponentInputModelInterface,
    StarRatingComponentDataModelInterface,
    RatingBarStylesInterface,
    SolidStarStylesInterface
} from './star-rating.interface';

export class StarRatingComponentInputModel implements StarRatingComponentInputModelInterface {
    public numberOfStars: number = 5;
    public starColor: string = '#F68C0B';
    public inActiveStarColor: string = '#DDDDDD';
    public emptyStarBackgroundColor: string = 'inherit';
    public ratingInPercentage: number;
    public isInActive: boolean = false;
    public totalRatings: number=0;
    public overAllRating: number=0;
    
}

export class StarRatingComponentDataModel implements StarRatingComponentDataModelInterface {
    ratingBarStyles: RatingBarStylesInterface;
    inActiveRatingBarStyles: RatingBarStylesInterface;
    solidStarStyles: SolidStarStylesInterface;
    starNumberRange: number[];
    starRating: number;
}
