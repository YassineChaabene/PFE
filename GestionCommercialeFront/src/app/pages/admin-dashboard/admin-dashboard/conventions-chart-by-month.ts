
import { Component, OnInit } from '@angular/core';
import { CommonModule }       from '@angular/common';
import { ChartData }          from 'chart.js';
import { ChartjsComponent }   from '@coreui/angular-chartjs';
import { DashboardService, ByMonth } from '../../../services/dashboard.service';

@Component({
  selector: 'app-conventions-by-month-chart',
  standalone: true,
  imports: [ChartjsComponent, CommonModule],
  template: `
    <c-chart 
      *ngIf="chartData"
      [type]="'bar'" 
      [data]="chartData" 
      [options]="chartOptions">
    </c-chart>
  `
})
export class ConventionsByMonthChartComponent implements OnInit {
  chartData?: ChartData<'bar'>;
  chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        display: true,
        title: { display: true, text: 'Mois' }
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        title: { display: true, text: 'Conventions' }
      }
    }
  };

  constructor(private svc: DashboardService) {}

  ngOnInit() {
    this.svc.getConventionsByMonth().subscribe((m: ByMonth) => {
      const monthNums = Array.from({ length: 12 }, (_, i) => i + 1);
      const labels = monthNums.map(n =>
        new Date(0, n - 1).toLocaleString('default', { month: 'short' })
      );

      const counts = monthNums.map(n => m[n] ?? 0);

      this.chartData = {
        labels,
        datasets: [{
          label: 'Conventions',
          data: counts,
          borderWidth: 2,
          borderColor: '#4e73df',
          backgroundColor: 'rgba(78,115,223,0.2)'
        }]
      };
    });
  }
}