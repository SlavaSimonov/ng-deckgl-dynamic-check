import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsDisplayComponent } from './metrics-display.component';

describe('MetricsDisplayComponent', () => {
  let component: MetricsDisplayComponent;
  let fixture: ComponentFixture<MetricsDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetricsDisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetricsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
