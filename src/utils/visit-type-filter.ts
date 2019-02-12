import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'visitTypeFilter' })
export class visitTypeFilter implements PipeTransform {
  transform(items: Array<any>, selectedType: string, colName: string) {
    if (items != undefined) {
      if (selectedType == "All") {
        return items;
      } else {
        return items.filter(item => item[colName] == selectedType);
      }
    }
  }
}