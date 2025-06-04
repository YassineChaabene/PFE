import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsByRegionChartComponent } from './clients-by-region-chart.component';

describe('ClientsByRegionChartComponent', () => {
  let component: ClientsByRegionChartComponent;
  let fixture: ComponentFixture<ClientsByRegionChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientsByRegionChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientsByRegionChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
