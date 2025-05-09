import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecentNewsWidgetComponent } from './recent-news-widget.component';

describe('RecentNewsWidgetComponent', () => {
  let component: RecentNewsWidgetComponent;
  let fixture: ComponentFixture<RecentNewsWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentNewsWidgetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecentNewsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
