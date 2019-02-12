// import { Pipe, PipeTransform } from '@angular/core';
// import * as moment from 'moment';

// @Pipe({  name: 'orderBy' })
// export class ClaimsOrderByPipe implements PipeTransform {

//     transform(records: Array<any>, direction:number): any {
//         if(records != undefined){

//             // for(let i=0; i< records.length; i++){
//             //     console.log(records[i].lastDOS);
//             // }
//             records.sort(function(a, b){
//             let dateValue1 = moment(a.lastDOS, 'MM/DD/YYYY');
//             let dateValue2 = moment(b.lastDOS, 'MM/DD/YYYY');

//             if(dateValue1.isBefore(dateValue2)){
//                 return -1 * direction;
//             }
//             else if( dateValue1.isAfter(dateValue2)){
//                 return 1 * direction;
//             }
//             else{
//                 return 0;
//             }
//         });
//             console.log("after sort");
        
//             // for(let i=0; i< records.length; i++){
//             //     console.log(records[i].lastDOS);
//             // }
//         return records;

//         }
//     };
// }