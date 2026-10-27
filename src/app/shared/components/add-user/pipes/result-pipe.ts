import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'result',
})
export class ResultPipe implements PipeTransform {
  transform(marks: number): string {
    if (marks >= 35) {
      return 'Pass';
    }

    return 'Fail';
  }
}
