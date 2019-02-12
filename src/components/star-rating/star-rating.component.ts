import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { StarRatingComponentInputModelInterface, StarRatingComponentDataModelInterface } from './star-rating.interface';
import { StarRatingComponentInputModel, StarRatingComponentDataModel } from './star-rating.model';


@Component({
  selector: 'app-star-rating-component',
  templateUrl: './star-rating.component.html',
  // styleUrls: ['./star-rating.component.scss']
})
export class StarRatingComponent implements OnInit, OnChanges {

  @Input('componentInput') componentInput: StarRatingComponentInputModelInterface;

  public componentData: StarRatingComponentDataModelInterface;

  private config = {
    widthPerStar: 15.8 // 13.2
  };

  constructor() { }

  ngOnInit() {


  }

  ngOnChanges(changes: SimpleChanges) {

    let starRatingChanges: StarRatingComponentInputModelInterface = changes.componentInput.currentValue;
    const componentData: StarRatingComponentDataModelInterface = new StarRatingComponentDataModel();

    
    
    if (!starRatingChanges) {
      starRatingChanges = new StarRatingComponentInputModel();
    }



    componentData.starRating = Number(starRatingChanges.totalRatings) ? Number(starRatingChanges.totalRatings) : 0;
    // if (componentData.starRating > 100) {
    //   componentData.starRating = 100;
    // }

    starRatingChanges.numberOfStars = 5;
    // if (!starRatingChanges.numberOfStars) {
    //   starRatingChanges.numberOfStars = 5;
    // }

    componentData.starNumberRange = Array.from(Array(starRatingChanges.numberOfStars).keys());

    componentData.ratingBarStyles = {
      'color': starRatingChanges.starColor,
      'width': (this.config.widthPerStar * starRatingChanges.numberOfStars +20) + 'px'
    };

    componentData.inActiveRatingBarStyles = {
      'color': starRatingChanges.inActiveStarColor,
      'width': (this.config.widthPerStar * starRatingChanges.numberOfStars) + 'px'
    };

    componentData.solidStarStyles = {
      'width':  ( this.config.widthPerStar * starRatingChanges.overAllRating ) + 'px'
      //'width': componentData.starRating + '%'
      //'width':'100%'
    };

    this.componentInput = starRatingChanges;
    this.componentData = componentData;
  }


}
