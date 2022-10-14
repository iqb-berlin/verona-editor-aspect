import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayIncludes'
})
export class ArrayIncludesPipe implements PipeTransform {
  transform(valueList: string[], searchValue: string): unknown {
    return valueList.includes(searchValue);
  }
}
