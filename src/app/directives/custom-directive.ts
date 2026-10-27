import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appCustomDirective]',
})
export class CustomDirective {
  constructor(e:ElementRef){
    e.nativeElement.style.background='blue'
  }
}
