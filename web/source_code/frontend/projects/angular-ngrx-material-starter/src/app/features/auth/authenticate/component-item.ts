import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[componentHost]',
})
export class ComponentDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}