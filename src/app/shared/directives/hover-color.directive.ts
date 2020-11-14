import {Directive, ElementRef, HostBinding, HostListener, Input} from '@angular/core';

function input() {

}

@Directive({
  selector: '[appHoverColor]'
})
export class HoverColorDirective {
  @HostBinding('style.color') color: string;
  @HostBinding('style.background-color') background_color: string;
  @HostBinding('style.transition') transaction: string = '0.3s';

  @Input() defaultColor: string ;
  @Input() defaultBackgroundColor: string ;

  constructor(private el: ElementRef) {}

  @HostListener('mouseover') onMouseOver(){
    this.color=this.defaultBackgroundColor;
    this.background_color=this.defaultColor;
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.color = this.defaultColor ;
    this.background_color = this.defaultBackgroundColor ;
  }
}
