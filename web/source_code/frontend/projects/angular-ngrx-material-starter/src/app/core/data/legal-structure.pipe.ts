import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'legalStructure'
})
export class LegalStructurePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
