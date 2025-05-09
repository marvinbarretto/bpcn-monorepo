import { ComponentFixture, TestBed } from '@angular/core/testing';

import { A11yLetterComponent } from './a11y-letter.component';

describe('A11yLetterComponent', () => {
  let component: A11yLetterComponent;
  let fixture: ComponentFixture<A11yLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [A11yLetterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(A11yLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
