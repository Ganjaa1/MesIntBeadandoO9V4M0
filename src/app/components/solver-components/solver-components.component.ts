import { Component } from '@angular/core';
import { City } from 'src/app/models/City';
import { Vehicle } from 'src/app/models/Vehicle';
import { CalculatingServiceService } from 'src/app/services/calculating.service';

@Component({
  selector: 'app-solver-components',
  templateUrl: './solver-components.component.html',
  styleUrls: ['./solver-components.component.scss']
})
export class SolverComponentsComponent {
  isLoaded!: boolean;
  depot: City = { x: 50, y: 50 };

  selectedVehicleNumber!: number;
  selectedCityNumber!: number;
  citiesNumber: number[] = [10, 20, 50, 100, 200, 500];
  vehicleNumbers: number[] = [1, 2, 4, 5, 10, 20];

  constructor(private calculateService: CalculatingServiceService) { }

  makeActions() {
    if (this.selectedVehicleNumber && this.selectedCityNumber) {
      this.generateCities(this.selectedCityNumber);
      this.calculateService.$cities.value.unshift(this.depot)
      this.shuffleCitiesForVehicles(this.selectedVehicleNumber);
      this.calculateService.searchRoutes().subscribe(_response => this.isLoaded = true);
    } else {
      alert("Wrong input!")
    }
  }

  generateCities(clientNumber: number) {
    let cities: City[] = [];
    let i: number = 0;
    while (i < clientNumber) {
      let x = Math.floor(Math.random() * 100);
      let y = Math.floor(Math.random() * 100);
      let city = { x, y };
      if (!cities.find(c => c === city) && city !== this.depot) {
        cities.push({ x, y })
        i++;
      }
    }
    this.calculateService.$cities.next(cities)
  }

  shuffleCitiesForVehicles(vehicleNumber: number) {
    let vehicles: Vehicle[] = [];
    let usedCities: number[] = [];
    let tmpVehicles: { routeNumber: number, cityIndex: number }[] = [];

    this.calculateService.$cities.value.forEach((_city, index) => {
      let routeNumber = Math.floor(Math.random() * ((vehicleNumber) - 0) + 0);
      if (!usedCities.includes(index) && index != 0) {
        tmpVehicles.push({ 'routeNumber': routeNumber, 'cityIndex': index })
        usedCities.push(index);
      }
    })

    tmpVehicles = tmpVehicles.reduce((prevVal: any, nextVal: any) => ({
      ...prevVal,
      [nextVal.routeNumber]: [...(prevVal[nextVal.routeNumber] || []), nextVal.cityIndex],
    }), {});
    vehicles = Object.entries(tmpVehicles)
      .map(groupedRoutes => ({ 'routeNumber': +groupedRoutes[0], 'destinations': [...[groupedRoutes[1]]][0] as unknown as number[] }));
    vehicles.forEach(vehicle => {
      vehicle.destinations.unshift(0)
      vehicle.destinations.push(0)
    })
    localStorage['vehicles'] = JSON.stringify(vehicles);
    this.calculateService.$vehicles.next(vehicles);

  }
}