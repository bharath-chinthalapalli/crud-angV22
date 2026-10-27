import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nameTitle',
})
export class NameTitlePipe implements PipeTransform {
  transform(name: string, gender: string): string {
    if (gender === 'male') {
      return 'Mr. ' + name;
    }

    if (gender === 'female') {
      return 'Ms. ' + name;
    }

    return name;
  }
}
