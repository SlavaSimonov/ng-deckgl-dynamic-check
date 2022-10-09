import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerationControlFormComponent } from './generation-control-form.component';

describe('GenerationControlFormComponent', () => {
  let component: GenerationControlFormComponent;
  let fixture: ComponentFixture<GenerationControlFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerationControlFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerationControlFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
