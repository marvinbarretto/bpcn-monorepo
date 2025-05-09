import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NextEventWidgetComponent } from './next-event-widget.component';

describe('NextEventWidgetComponent', () => {
  let component: NextEventWidgetComponent;
  let fixture: ComponentFixture<NextEventWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NextEventWidgetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NextEventWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
