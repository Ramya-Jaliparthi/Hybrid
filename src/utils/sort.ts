import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

export enum SortOrder {
    ASCENDING = 1 ,
    DESCENDING = -1
}

@Pipe({  name: 'orderBy' })
export class OrderByPipe implements PipeTransform {

    transform(records: Array<any>, direction:number,colName:string/*, statusName:string, statusValue:string*/): any {
        if(records != undefined){
            records.sort(function(a, b){
            let dateValue1 = moment(a[colName], 'MM/DD/YYYY');
            let dateValue2 = moment(b[colName], 'MM/DD/YYYY');

            if(dateValue1.isBefore(dateValue2)){
                return -1 * direction;
            }
            else if( dateValue1.isAfter(dateValue2)){
                return 1 * direction;
            }
            else{
                return 0;
            }
        });
        return records;
        }
    };
}