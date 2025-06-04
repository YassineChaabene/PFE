import { Component, OnInit } from '@angular/core';
import { CommonModule }       from '@angular/common';
import { ChartData, ChartOptions } from 'chart.js';
import { ChartjsComponent }   from '@coreui/angular-chartjs';
import { RevenueService, YearlyRevenue } from '../../../services/revenue.service';
import { forkJoin } from 'rxjs';

interface MonthlyPrediction {
  date:  string;  
  total: number;
}

@Component({
  selector: 'app-factures-revenue-chart',
  standalone: true,
  imports: [ChartjsComponent, CommonModule],
  template: `
    <c-chart
      *ngIf="chartData"
      [type]="'line'"
      [data]="chartData"
      [options]="chartOptions">
    </c-chart>
  `
})
export class FacturesRevenueChartComponent implements OnInit {
  chartData?: ChartData<'line'>;
  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: { legend: { position: 'top' }},
    scales: {
      x: { title: { display: true, text: 'Date' } },
      y: { title: { display: true, text: 'TND' }, beginAtZero: true }
    },
     elements: {
      line:  { tension: 0.3, borderWidth: 2 },
      point: { radius: 4 }
    }
  };

  constructor(private revenueService: RevenueService) {}

 ngOnInit() {
  forkJoin({
    annual: this.revenueService.getHistorical(),      
    monthly: this.revenueService.getHistoricalMonthly(), 
    pred: this.revenueService.getPredictions(5)  
  }).subscribe(({ annual, monthly, pred }) => {


    const yearLabels  = annual.map(r => r.year.toString());
    const monthLabels = monthly.map(m => m.date);
    const predLabels  = pred.map(p => p.date);

    const labels = [...yearLabels, ...monthLabels, ...predLabels];

    const yearValues = annual.map(r => r.total);
    const monthValues = monthly.map(m => m.total);
    const predValues  = pred.map(p => p.total);

    const nullsForMonth = Array(monthLabels.length).fill(null);
    const nullsForPred1 = Array(yearLabels.length).fill(null);
    const nullsForPred2 = Array(monthLabels.length).fill(null);

    this.chartData = {
      labels,
      datasets: [
        {
          label: 'Revenue par année',
          data: [...yearValues, ...nullsForMonth, ...Array(predLabels.length).fill(null)],
          borderColor: '#4e73df',
          backgroundColor: 'rgba(78,115,223,0.2)',
          fill: true,
        },
        {
          label: 'Revenue Mensuel (cette année)',
          data: [...Array(yearLabels.length).fill(null), ...monthValues, ...Array(predLabels.length).fill(null)],
          borderColor: '#1cc88a',
          backgroundColor: 'rgba(28,200,138,0.2)',
          fill: true,
        },
        {
          label: 'Revenue estimé',
          data: [...nullsForPred1, ...nullsForPred2, ...predValues],
          borderColor: '#e74a3b',
          backgroundColor: 'rgba(231,74,59,0.2)',
          fill: true,
        }
      ]
    };
  });
}
}