import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConventionUpdateComponent } from './convention-update.component';

describe('ConventionUpdateComponent', () => {
  let component: ConventionUpdateComponent;
  let fixture: ComponentFixture<ConventionUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConventionUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConventionUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
