import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { City } from 'src/app/models/City';
import { Vehicle } from 'src/app/models/Vehicle';

@Component({
  selector: 'app-solver-components',
  templateUrl: './solver-components.component.html',
  styleUrls: ['./solver-components.component.scss']
})
export class SolverComponentsComponent {
  isLoaded: boolean = true;

  cities: City[] = [];
  vehicles: Vehicle[] = [];
  depot: City = { x: 50, y: 50 };
  beforeVehicles: Vehicle[] = [];

  selectedVehicleNumber!: number;
  selectedCityNumber!: number;
  citiesNumber: number[] = [10, 20, 50, 100, 200, 500];
  vehicleNumbers: number[] = [1, 2, 4, 5, 10, 20];

  usedCities: number[] = [];

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

  makeAction() {
    if (this.selectedVehicleNumber && this.selectedCityNumber) {
      this.chartData = [];
      this.cities = [];
      this.vehicles = [];
      this.generateCities(this.selectedCityNumber);
      this.cities.unshift(this.depot)
      console.clear()
      this.shuffleCitiesForVehicles(this.selectedVehicleNumber);
      this.searchRoutes();
      this.isLoaded = false;
    } else {
      alert("Wrong input!")
    }

  }

  generateCities(clientNumber: number) {
    let i: number = 0;
    while (i < clientNumber) {
      let x = Math.floor(Math.random() * 100);
      let y = Math.floor(Math.random() * 100);
      let city = { x, y };
      if (!this.cities.find(c => c === city) && city !== this.depot) {
        this.cities.push({ x, y })
        i++;
      }
    }
  }

  shuffleCitiesForVehicles(vehicleNumber: number) {
    let usedCities: number[] = [];
    let tmpVehicles: { routeNumber: number, cityIndex: number }[] = [];

    this.cities.forEach((_city, index) => {
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
    this.vehicles = Object.entries(tmpVehicles)
      .map(groupedRoutes => ({ 'routeNumber': +groupedRoutes[0], 'destinations': [...[groupedRoutes[1]]][0] as unknown as number[] }));
    this.vehicles.forEach(vehicle => {
      vehicle.destinations.unshift(0)
      vehicle.destinations.push(0)
    })
    localStorage['vehicles'] = JSON.stringify(this.vehicles);
  }

  objectFunction(route: any[]) {
    let dist: number = 0;
    let prev: number = 0;
    for (let i = 0; i < route.length; i++) {
      dist += +this.getDistance(this.cities[route[prev]], this.cities[route[i]]);
      prev = i;
    }
    return dist;
  }

  neighborhoodSearch(iterations: number, route: number[]) {
    let bestCalc: number = this.objectFunction(route);
    let bestRoute: number[] = [...route];

    let sBase: number[] = [...bestRoute]
    let sBaseCalc: number = this.objectFunction(sBase)

    for (let i = 0; i < iterations; i++) {
      let bestNeighborRoute: number[] = [...sBase];
      let bestNeighborCalc: number = sBaseCalc;

      for (let j = 0; j < 100; j++) {
        let neighbor = [...sBase];
        let a: number = Math.floor(Math.random() * ((bestRoute.length - 2) - 1) + 1);
        let b: number = Math.floor(Math.random() * ((bestRoute.length - 2) - 1) + 1);
        let tmp = neighbor[a];
        neighbor[a] = neighbor[b];
        neighbor[b] = tmp;
        let neighborCalc = this.objectFunction(neighbor);

        if (neighborCalc < bestNeighborCalc && a != b) {
          bestNeighborCalc = neighborCalc;
          bestNeighborRoute = [...neighbor];
        }
      }
      sBase = [...bestNeighborRoute];
      sBaseCalc = bestNeighborCalc;

      if (sBaseCalc < bestCalc) {
        bestRoute = [...sBase];
        bestCalc = sBaseCalc;
      }
    }
    return bestRoute;
  }

  searchRoutes() {
    let currentUsedCities: number[] = []
    for (let index = 0; index < this.vehicles.length; index++) {

      let optimalRoute = [...this.neighborhoodSearch(100000, this.vehicles[index].destinations)];
      let optimalRouteCalc = this.objectFunction(optimalRoute);

      for (let insideIndex = 0; insideIndex < 200000; insideIndex++) {
        let currentRoute = [...this.vehicles[index].destinations];

        let rowIndex: number = Math.floor(Math.random() * ((this.vehicles.length - 1)));
        let columnIndex: number = Math.floor(Math.random() * ((this.vehicles[rowIndex].destinations.length - 1) - 1) + 1);
        let currentIndex: number = Math.floor(Math.random() * ((currentRoute.length - 1) - 1) + 1);
        let tmp = currentRoute[currentIndex]
        currentRoute[currentIndex] = this.vehicles[rowIndex].destinations[columnIndex]
        let currentCalc = this.objectFunction(currentRoute);

        if (currentCalc < optimalRouteCalc && !currentUsedCities.includes(this.vehicles[rowIndex].destinations[columnIndex]) && rowIndex !== index) {
          console.log("csere")
          this.vehicles[index].destinations[currentIndex] = this.vehicles[rowIndex].destinations[columnIndex]
          this.vehicles[rowIndex].destinations[columnIndex] = tmp;
          optimalRoute = [...currentRoute];
          optimalRouteCalc = currentCalc;
          currentUsedCities.push(this.vehicles[rowIndex].destinations[columnIndex])
        }
      }

    };
    // console.log(currentUsedCities);

    this.vehicles.forEach((vehicle, index) => {
      var r = Math.floor(Math.random() * 255);
      var g = Math.floor(Math.random() * 255);
      var b = Math.floor(Math.random() * 255);
      let color = "rgb(" + r + "," + g + "," + b + ")";

      this.chartData.push({
        label: `Vehicle[${index}]`,
        data: [
          ...this.neighborhoodSearch(200000, vehicle.destinations).map(cityNumber => ({ x: this.cities[cityNumber].x, y: this.cities[cityNumber].y }))
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
      data: [{ x: this.depot.x, y: this.depot.y }],
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
    // console.log('Előtte:');
    this.beforeVehicles = JSON.parse(localStorage['vehicles']);
    // let beforeVehicles: Vehicle[] = JSON.parse(localStorage['vehicles']);
    // beforeVehicles.forEach(vehicle => {
    //   console.log(`ID: ${vehicle.routeNumber} \nRoute: ${vehicle.destinations.map((v, vIndex) => { if (vIndex != vehicle.destinations.length - 1) { return `${v} -> ` } else { return `${v}` } })}`)
    // })
    // console.log('---------------------------\nUtána:');
    // this.vehicles.forEach(vehicle => {
    //   console.log(`ID: ${vehicle.routeNumber} \nRoute: ${vehicle.destinations.map((v, vIndex) => { if (vIndex != vehicle.destinations.length - 1) { return `${v} -> ` } else { return `${v}` } })}`)
    // })

    // console.table(this.cities)
  }

  getDistance(city1: City, city2: City) {
    return Math.abs(city2.x - city1.x) + Math.abs(city1.y - city2.y);
  }

  returnBeforeSummary():number{
    return this.beforeVehicles.reduce((totalSum,u)=>totalSum+this.objectFunction(u.destinations),0)
  }
  
  returnAfterSummary():number{
    return this.vehicles.reduce((totalSum,u)=>totalSum+this.objectFunction(u.destinations),0)
  }

}