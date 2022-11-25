import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { City } from '../models/City';
import { Vehicle } from '../models/Vehicle';

@Injectable({
  providedIn: 'root'
})
export class CalculatingServiceService {

  $cities: BehaviorSubject<City[]> = new BehaviorSubject<City[]>([]);
  $vehicles: BehaviorSubject<Vehicle[]> = new BehaviorSubject<Vehicle[]>([]);

  $calculationStarted!: Subject<void>;

  searchRoutes(): Observable<Vehicle[]> {
    let currentUsedCities: number[] = []
    for (let index = 0; index < this.$vehicles.value.length; index++) {

      let optimalRoute = [...this.neighborhoodSearch(200000, this.$vehicles.value[index].destinations)];
      let optimalRouteCalc = this.calculateRouteCost(optimalRoute);

      for (let insideIndex = 0; insideIndex < 500000; insideIndex++) {
        let currentRoute = [...this.$vehicles.value[index].destinations];

        let rowIndex: number = Math.floor(Math.random() * ((this.$vehicles.value.length - 1)));
        let columnIndex: number = Math.floor(Math.random() * ((this.$vehicles.value[rowIndex].destinations.length - 1) - 1) + 1);
        let currentIndex: number = Math.floor(Math.random() * ((currentRoute.length - 1) - 1) + 1);
        let tmp = currentRoute[currentIndex]
        currentRoute[currentIndex] = this.$vehicles.value[rowIndex].destinations[columnIndex]
        let currentCalc = this.calculateRouteCost(currentRoute);

        if (currentCalc < optimalRouteCalc && !currentUsedCities.includes(this.$vehicles.value[rowIndex].destinations[columnIndex]) && rowIndex !== index) {
          this.$vehicles.value[index].destinations[currentIndex] = this.$vehicles.value[rowIndex].destinations[columnIndex]
          this.$vehicles.value[rowIndex].destinations[columnIndex] = tmp;
          optimalRoute = [...currentRoute];
          optimalRouteCalc = currentCalc;
          currentUsedCities.push(this.$vehicles.value[rowIndex].destinations[columnIndex])
        }
      }
    };
    return of(this.$vehicles.value)
  }

  neighborhoodSearch(iterations: number, route: number[]) {
    let bestCalc: number = this.calculateRouteCost(route);
    let bestRoute: number[] = [...route];

    let sBase: number[] = [...bestRoute]
    let sBaseCalc: number = this.calculateRouteCost(sBase)

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
        let neighborCalc = this.calculateRouteCost(neighbor);

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

  calculateRouteCost(route: number[]) {
    let dist: number = 0;
    let prev: number = 0;
    for (let i = 0; i < route.length; i++) {
      dist += +this.getDistance(this.$cities.value[route[prev]], this.$cities.value[route[i]]);
      prev = i;
    }
    return dist;
  }

  getDistance(city1: City, city2: City) {

    return Math.abs(city2.x - city1.x) + Math.abs(city1.y - city2.y);
  }

  getCityByIndex(index: number) {
    return this.$cities.value[index];
  }

  getSummaryCost(): number {
    return this.$vehicles.value.reduce((totalSum, u) => totalSum + this.calculateRouteCost(u.destinations), 0)
  }


}
