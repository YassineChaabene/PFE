import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartConfiguration } from 'chart.js';

@Component({
  standalone:false,
  selector: 'app-clients-by-region-chart',
  templateUrl: './clients-by-region-chart.component.html',
  styleUrls: ['./clients-by-region-chart.component.css']
})
export class ClientsByRegionChartComponent implements OnChanges {
  @Input() data: Record<string, number> = {};

  public chartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{
      label: 'Clients by Region',
      data: [],
      backgroundColor: '#043571'
    }]
  };

  public chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: { beginAtZero: true, ticks: { precision: 0 } }
    },
    plugins: { legend: { display: false } }
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data) {
      const labels = Object.keys(this.data);
      const values = Object.values(this.data);
      this.chartData = {
        labels,
        datasets: [{
          label: 'Clients by Region',
          data: values,
          backgroundColor: '#20a8d8'
        }]
      };
    }
  }
}
