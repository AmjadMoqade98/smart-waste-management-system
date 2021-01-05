import {Directive, ElementRef, HostBinding, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[appHoverZoom]'
})
// @ts-ignore
export class HoverZoomDirective {
  @HostBinding('style.font-size') fontSize: string;
  @Input() font_size: string ;
  constructor(private el: ElementRef) {
  }

  @HostListener('mouseover') onMouseOver(){
    let size_value = "" ;
    let unit = "" ;
    this.font_size.split("").map(a => {
      if(!isNaN(+a)) size_value= size_value + a ;
      else unit = unit + a ;
    });

    let calculateFont = (+size_value)*1.2 ;

    this.fontSize= calculateFont +"" + unit ;
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.fontSize= this.font_size ;
  }

}

