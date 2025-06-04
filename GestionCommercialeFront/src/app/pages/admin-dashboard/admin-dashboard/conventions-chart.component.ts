// src/app/pages/dashboard/conventions-chart.component.ts
import { Component, OnInit } from '@angular/core';
import { forkJoin }            from 'rxjs';
import { DashboardService, ByYear } from '../../../services/dashboard.service';
import { ChartData }           from 'chart.js';
import { ChartjsComponent }    from '@coreui/angular-chartjs';
import { CommonModule }        from '@angular/common';

@Component({
  selector: 'app-conventions-chart',
  standalone: true,
  imports: [ChartjsComponent, CommonModule],
  template: `
    <c-chart
      *ngIf="chartData"
      [type]="'line'"
      [data]="chartData"
      [options]="chartOptions"
    ></c-chart>
  `
})
export class ConventionsChartComponent implements OnInit {
  chartData?: ChartData<'line'>;
  chartOptions = {
    responsive: true,
    plugins: { legend: { display: true } },
    scales: {
      x: { display: true,  title: { display: true, text: 'Année' } },
      y: { beginAtZero: true, ticks: { stepSize: 1 }, title: { display: true, text: 'Conventions' } }
    },
    elements: {
      line:  { tension: 0.3, borderWidth: 2 },
      point: { radius: 4 }
    }
  };

  constructor(private svc: DashboardService) {}

  ngOnInit() {
    forkJoin({
      past:this.svc.getConventionsByYear(),
      upcoming:this.svc.getUpcomingConventionsByYear()
    }).subscribe(({ past, upcoming }) => {
      const pastYears     = Object.keys(past);  
      const upcomingYears = Object.keys(upcoming);
      const labels        = [...pastYears, ...upcomingYears];

      const pastData = labels.map(y => past[y] ?? null);

      const boundaryIndex = pastYears.length - 1;
      const upcomingData = labels.map((y, i) => {
        if (i < boundaryIndex)   return null;
        if (i === boundaryIndex) return past[y] ?? null;   
        return upcoming[y] ?? null;                      
      });

      this.chartData = {
        labels,
        datasets: [
          {
            label: 'Passé',
            data: pastData,
            borderColor: '#6978fa',
            backgroundColor: 'rgba(105,120,250,0.2)',
            fill: true
          },
          {
            label: 'À venir (5 ans)',
            data: upcomingData,
            borderColor: '#fa6969',
            backgroundColor: 'rgba(250,105,105,0.2)',
            fill: true,
            spanGaps: false 
          }
        ]
      };
    });
  }
}
