import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {

  constructor() {
  }
  transform<T>(search: string | null, array: T[], key: keyof T, ): T[] {
    if (search) {
      return array.filter(item =>
        String.prototype.toLowerCase.call(item[key]).includes(search.toLowerCase())
      );
    }
    return array;
  }

}
