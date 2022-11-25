import { Component, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { Vehicle } from 'src/app/models/Vehicle';
import { CalculatingServiceService } from 'src/app/services/calculating.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  vehicles: Vehicle[] = [];
  isLoaded: boolean = false;

  chartData: ChartDataset[] = [];
  chartLabels: string[] = [];
  chartType: ChartType = 'scatter';
  chartLegend: boolean = true;
  chartPlugins = [];
  chartOptions: ChartOptions = {
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        beginAtZero: true,
        max: 100
      },
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  }

  constructor(private calculateService: CalculatingServiceService) {
  }

  ngOnInit(): void {
    this.calculateService.searchRoutes().subscribe(response => {
      this.vehicles = response;
      this.isLoaded = true;
      this.vehicles.forEach((vehicle, index) => {
        this.calculateService.neighborhoodSearch(400000, vehicle.destinations);
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        let color = "rgb(" + r + "," + g + "," + b + ")";

        this.chartData.push({
          label: `Vehicle[${index}]`,
          data: [
            ...vehicle.destinations
              .map(cityNumber =>
                ({ x: this.calculateService.getCityByIndex(cityNumber).x, y: this.calculateService.getCityByIndex(cityNumber).y }))
          ],
          borderColor: color,
          borderWidth: 1,
          pointBackgroundColor: color,
          pointBorderColor: color,
          pointRadius: 3,
          pointHoverRadius: 4,
          tension: 0,
          showLine: true
        })
      })

      this.chartData.push({
        label: "Depo",
        data: [{ x: 50, y: 50 }],
        borderColor: 'red',
        borderWidth: 1,
        pointBackgroundColor: 'red',
        pointBorderColor: 'red',
        pointRadius: 8,
        pointHoverRadius: 8,
        fill: true,
        tension: 10,
        showLine: true
      })
    })

  }
}