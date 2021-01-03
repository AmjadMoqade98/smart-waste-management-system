import {Directive, ElementRef, HostBinding, HostListener, Input, OnInit} from '@angular/core';

function input() {

}

@Directive({
  selector: '[appHoverColor]'
})
export class HoverColorDirective implements OnInit{
  @HostBinding('style.color') color: string;
  @HostBinding('style.background-color') backgroundColor: string;
  @HostBinding('style.border-color') borderColor: string;
  @HostBinding('style.transition') transaction = '0.3s';
  @Input() defaultColor: string ;
  @Input() defaultBackgroundColor: string ;

  constructor(private el: ElementRef) {
  }

  ngOnInit(): void {
    this.color = this.defaultColor ;
    this.borderColor = this.defaultColor;
    this.backgroundColor = this.defaultBackgroundColor ;
  }

  @HostListener('mouseover') onMouseOver(){
    this.color= this.defaultBackgroundColor;
    this.borderColor = this.defaultBackgroundColor;
    this.backgroundColor= this.defaultColor;
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.color = this.defaultColor ;
    this.borderColor = this.defaultColor;
    this.backgroundColor = this.defaultBackgroundColor ;
  }
}
