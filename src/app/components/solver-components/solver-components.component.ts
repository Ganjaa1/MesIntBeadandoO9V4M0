import { Component, OnInit } from '@angular/core';
import { City } from 'src/app/models/City';
import { Rider } from 'src/app/models/Rider';

@Component({
  selector: 'app-solver-components',
  templateUrl: './solver-components.component.html',
  styleUrls: ['./solver-components.component.scss']
})
export class SolverComponentsComponent implements OnInit {

  cities: City[] = [];
  riders: Rider[] = [];
  constructor() { }

  ngOnInit(): void {
    this.generateCitiesCoordinates(10);
    console.log('cities:', this.cities)
    this.shuffleCitiesForRiders(3);
    console.log('riders', this.riders)

    let riderPaths = this.riders.map(item => item.destinations.map(dest => dest));
    riderPaths.forEach(routes => {
      console.log('ezvót: ', routes)
      console.log('ez lett: ', this.localSearch(1000000, routes));

    })
    this.getBestBetweenRiders(10)
  }

  generateCitiesCoordinates(clientNumber: number) {
    for (let index = 0; index < clientNumber; index++) {
      let x = Math.floor(Math.random() * 10);
      let y = Math.floor(Math.random() * 10);
      this.cities.push({ x, y })
    }
  }

  shuffleCitiesForRiders(riderNumber: number) {
    let usedCities: number[] = [];
    let tmpRiders: { routeNumber: number, cityIndex: number }[] = [];

    this.cities.forEach((_city, index) => {
      let routeNumber = Math.floor(Math.random() * ((riderNumber) - 0) + 0);
      if (!usedCities.includes(index)) {
        tmpRiders.push({ 'routeNumber': routeNumber, 'cityIndex': index })
        usedCities.push(index);
      }
    })

    tmpRiders = tmpRiders.reduce((prevVal: any, nextVal: any) => ({
      ...prevVal,
      [nextVal.routeNumber]: [...(prevVal[nextVal.routeNumber] || []), nextVal.cityIndex],
    }), {});

    this.riders = Object.entries(tmpRiders).map(groupedRoutes => ({ 'routeNumber': +groupedRoutes[0], 'destinations': [...[groupedRoutes[1]]][0] as unknown as number[] }));
  }

  transformTSP(tsp: City[]) {
    let tspDict: number[][] = [];
    tsp.forEach((_city, i) => {
      tspDict[i] = [];
      tsp.forEach((_city, j) => tspDict[i][j] = this.getDistance(tsp[i], tsp[j]));
    })
    return tspDict;
  }

  objectFunction(dictionary: number[][], s: any) {
    let dist = 0;
    let prev = s[0];
    for (let i = 0; i < s.length; i++) {
      dist += dictionary[prev][i];
      prev = i;
    }
    dist += dictionary[s.slice(-1)[0]][0];
    return dist;

  }

  localSearch(iterations: number, routes: number[]) {
    let tmpRoutes = [...routes];
    let tspDictionary = this.transformTSP(this.cities);
    let bestSearch = this.objectFunction(tspDictionary, tmpRoutes);
    let bestRoutes = tmpRoutes;

    for (let i = 0; i < iterations; i++) {
      tmpRoutes = [...routes]
      let a: number = Math.floor(Math.random() * ((tmpRoutes.length - 1) - 0) + 0);
      let b: number = Math.floor(Math.random() * ((tmpRoutes.length - 1) - 0) + 0);
      let tmp = tmpRoutes[a];
      tmpRoutes[a] = tmpRoutes[b];
      tmpRoutes[b] = tmp;
      let currenRoutesSearchCalc = this.objectFunction(tspDictionary, tmpRoutes);

      if (currenRoutesSearchCalc < bestSearch && a != b) {
        bestSearch = currenRoutesSearchCalc;
        bestRoutes = tmpRoutes;
      }

    }
    return bestRoutes;
  }

  getBestBetweenRiders(iterations: number) {
    let riderPaths = [...this.riders.map(item => item.destinations.map(dest => dest))];
    riderPaths.forEach(route => {
      let bestRowRoutes = this.localSearch(1000000, route);
      bestRowRoutes.forEach(bestRow => {
        let rowIndex: number = Math.floor(Math.random() * ((this.riders.length - 1) - 0) + 0);
        let columnIndex: number = Math.floor(Math.random() * ((route.length - 1) - 0) + 0);
        console.log(rowIndex, ' ', columnIndex, ' ', this.riders[rowIndex].destinations[columnIndex])
      })
      //amit kivesz azt cserélgetni, hogy lenne jobb mint volt, felülírni, de úgy hogy azt még később tudjam használni
      // route.forEach(routeItem => {

      // })
    })
    // for (let i = 0; i < riderPaths.length; i++) {
    //   let bestRowRoutes = this.localSearch(1000000, riderPaths[i]);
    //   for (let j = 0; j < riderPaths[i].length; j++) {

    //   }

    // }
  }

  getDistance(city1: City, city2: City) {
    return Math.pow((Math.pow((city2.x - city1.x), 2) + Math.pow((city1.y - city2.y), 2)), 0.5);
  }

}
