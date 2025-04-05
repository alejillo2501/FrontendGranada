import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringToJson'
})
export class StringToJsonPipe implements PipeTransform {
  transform(value: string): any {
    try {
      return JSON.parse(value);
    } catch (error) {
      console.error('JSON parsing error:', error);
      return value; // devuelve el string original si falla
    }
  }
}