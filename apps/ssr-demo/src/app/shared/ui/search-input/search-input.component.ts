import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-search-input',
    imports: [],
    templateUrl: './search-input.component.html',
    styleUrl: './search-input.component.scss'
})
export class SearchInputComponent {
  @Input() query: string = '';
  @Output() queryChange = new EventEmitter<string>();

  onQueryChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.queryChange.emit(input.value);
  }
}
