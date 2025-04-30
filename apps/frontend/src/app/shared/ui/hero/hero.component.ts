import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-hero',
    imports: [CommonModule],
    template: `
  <div
    class="hero"
    [ngClass]="cssClass"
    [ngStyle]="backgroundImage ? {'background-image': 'url(' + backgroundImage + ')'} : {}"
  >
    <div class="hero__text content">
      <ng-container [ngSwitch]="headingLevel">
        <h1 class="title" *ngSwitchCase="'h1'">{{ title }}</h1>
        <h2 class="title" *ngSwitchCase="'h2'">{{ title }}</h2>
        <h3 class="title" *ngSwitchCase="'h3'">{{ title }}</h3>
        <span class="title" *ngSwitchDefault>{{ title }}</span>
      </ng-container>
    </div>
  </div>
`,
    styleUrl: './hero.component.scss'
})
export class HeroComponent {
  @Input() title: string = '';
  @Input() backgroundImage?: string;
  @Input() cssClass?: string;
  @Input() headingLevel: 'h1' | 'h2' | 'h3' = 'h1';

  constructor() {}
}
