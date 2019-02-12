import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dateFilter'
})
export class dateFilter implements PipeTransform {
    transform(dateString: string): string {

        if (!dateString) {
            return '';
        }
        const dateFrags = dateString.split('-');

        if (!dateFrags[0] || !dateFrags[1] || !dateFrags[2]) {
            return '';
        }

        return `${dateFrags[1]}/${dateFrags[2]}/${dateFrags[0]}`;
    }
}
