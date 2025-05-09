import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-a11y-letter',
  standalone: true,
  template: `
    <button
      type="button"
      [style.backgroundColor]="bgColor"
      [style.color]="textColor"
      (click)="onClick()"
      [attr.aria-label]="'Change to ' + type + ' colour scheme'"
    >
      {{ letter }}
    </button>
  `,
  styleUrl: './a11y-letter.component.scss',
})
export class A11yLetterComponent {
  @Input() bgColor: string = 'white';
  @Input() textColor: string = 'black';
  @Input() letter?: string = 'A';
  @Input() type?: string = 'Default';
  @Output() letterClicked = new EventEmitter<void>();

  onClick(): void {
    this.letterClicked.emit();
  }
}
