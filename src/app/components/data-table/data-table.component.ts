import { Component } from '@angular/core';
import { Vehicle } from 'src/app/models/Vehicle';
import { CalculatingServiceService } from 'src/app/services/calculating.service';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent {

  beforeVehicles: Vehicle[] = [];
  vehicles: Vehicle[] = [];
  constructor(private calculatorService: CalculatingServiceService) { }

  ngOnInit(): void {
    this.beforeVehicles = JSON.parse(localStorage['vehicles']);
    this.calculatorService.searchRoutes().subscribe(vehicles => this.vehicles = vehicles)
  }

  returnBeforeSummary(): number {
    return this.beforeVehicles.reduce((totalSum, u) => totalSum + this.calculatorService.calculateRouteCost(u.destinations), 0)
  }

  returnAfterSummary(): number {
    return this.calculatorService.getSummaryCost();
  }

  getRouteCost(route: number[]): number {
    return this.calculatorService.calculateRouteCost(route);
  }
}
