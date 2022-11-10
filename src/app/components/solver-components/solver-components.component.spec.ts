import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolverComponentsComponent } from './solver-components.component';

describe('SolverComponentsComponent', () => {
  let component: SolverComponentsComponent;
  let fixture: ComponentFixture<SolverComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolverComponentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolverComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
