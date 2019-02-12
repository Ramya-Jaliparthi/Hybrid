import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'matchTextHighlight'
})
export class MatchTextHighlightPipe implements PipeTransform {

  transform(text: string, search): string {
    let pattern = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    pattern = pattern.split(' ').filter((t) => {
      return t.length > 0;
    }).join('|');
    const regex = new RegExp(pattern, 'gi');

    return search ? text.replace(regex, (match) => `<span class='highlight-matching-text'>${match}</span>`) : text;
  }

}
