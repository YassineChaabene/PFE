// src/app/pages/dashboard/invoice-status-chart.component.ts
import { Component, OnInit,  AfterViewInit,ElementRef,ViewChild,OnDestroy} from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import { InvoiceStatus } from '../../../services/dashboard.service';
import {
  ChartComponent,
  ApexNonAxisChartSeries,
  ApexChart,
  ApexResponsive,
  ApexLegend
} from 'ng-apexcharts';

import { from } from 'rxjs';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(DoughnutController, ArcElement, Tooltip, Legend);
export type DoughnutChartOptions = {
  series: ApexNonAxisChartSeries;
  chart:    ApexChart;
  labels:   string[];
  responsive: ApexResponsive[];
  legend:   ApexLegend;
};

@Component({
  selector: 'app-invoice-status-chart',
  template: `
    <div class="chart-container">
  <canvas #canvas></canvas>
</div>
  `
})
export class InvoiceStatusChartComponent implements AfterViewInit, OnDestroy {
    @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
    private chart?: Chart;
  
    // order & labels you want
    private readonly statuses = ['PAYEE','IMPAYEE','EN RETARD','EN ATTENTE'];
    private readonly labels   = ['Payée','Impayée','En retard','En attente'];
    private readonly colors   = ['#4CAF50','#FFC107','#F44336','#2196F3'];
  
    constructor(private svc: DashboardService) {}
  
    ngAfterViewInit() {
      this.svc.getInvoiceStatus().subscribe((map: InvoiceStatus) => {
        const data = this.statuses.map(s => map[s] ?? 0);
  
        const ctx = this.canvas.nativeElement.getContext('2d')!;
        this.chart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: this.labels,
            datasets: [{
              data,
              backgroundColor: this.colors,
              borderWidth: 1,
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: 'right' },
              tooltip: { enabled: true }
            }
          }
        });
      });
    }
  
    ngOnDestroy() {
      this.chart?.destroy();
    }
  }