import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConventionListComponent } from './convention-list.component';

describe('ConventionListComponent', () => {
  let component: ConventionListComponent;
  let fixture: ComponentFixture<ConventionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConventionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConventionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
