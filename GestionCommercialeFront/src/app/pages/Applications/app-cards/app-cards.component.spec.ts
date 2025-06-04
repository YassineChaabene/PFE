import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCardsComponent } from './app-cards.component';

describe('AppCardsComponent', () => {
  let component: AppCardsComponent;
  let fixture: ComponentFixture<AppCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
