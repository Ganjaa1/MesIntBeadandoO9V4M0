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

      })
      // route.forEach(routeItem => {

      // })
    })
    // for (let i = 0; i < riderPaths.length; i++) {
    //   let bestRowRoutes = this.localSearch(1000000, riderPaths[i]);
    //   for (let j = 0; j < riderPaths[i].length; j++) {

    //   }

    // }
  }

  // localSearch(iterations: number) {
  //   let usedCities: number[] = [];
  //   let tsp_dict = this.transformTSP(this.cities);
  //   let riderPaths = this.riders.map(item => item.destinations.map(dest => dest));
  //   for (let i = 0; i < riderPaths.length; i++) {
  //     let currentBest = this.objectFunction(tsp_dict, riderPaths[i]);
  //     let currentBestRoutes: number[] = riderPaths[i];
  //     console.log("startedBest: ", currentBest, 'indexes: ', currentBestRoutes)
  //     for (let j = 0; j < iterations; j++) {
  //       let randomLength: number = Math.floor(Math.random() * ((this.cities.length - 1) - currentBestRoutes.length) + currentBestRoutes.length)
  //       let currentPathShuffledRoutes: number[];
  //       randomLength = Math.floor(Math.random() * ((this.cities.length - 1) - currentBestRoutes.length) + currentBestRoutes.length);
  //       currentPathShuffledRoutes =
  //         [...new Set(
  //           [...new Array(randomLength)].map(() =>
  //             Math.floor(Math.random() * (this.cities.length - 1 - 0) + 0)
  //           )
  //         ),
  //         ];
  //       let currentPathCalc = this.objectFunction(tsp_dict, currentPathShuffledRoutes);

  //       if (currentPathCalc < currentBest && currentPathCalc
  //         && currentPathShuffledRoutes.length != 0 && !usedCities.some(city => currentPathShuffledRoutes.includes(city))) {
  //         currentBestRoutes = currentPathShuffledRoutes;
  //         currentBest = currentPathCalc;
  //       }
  //     }
  //     currentBestRoutes.forEach(route => usedCities.push(route))
  //     console.log("finishedBest: ", currentBest, 'indexes: ', currentBestRoutes, '\n')
  //     console.log("fasz")

  //   }
  //   console.log(usedCities)
  // }
  //itt úgy vizsgálódni, hogy ez a loop nézi hogy az elsőhöz rendelve hogy a legjobb, majd megy a kövi sorra, amiken már átment elmenti
  // for (let index = 0; index < dataIndexes.length; index++) {
  //   console.log(`Vehicle[${index}] route:   {[...dataIndexes[index]]} \n and it's cost: ${this.objectFunction(this.transformTSP(this.cities),dataIndexes[index])}`);
  // } 
  // let objectF = this.objectFunction(tsp_dict,s)
  // let sBest = s;
  //let fBest =

  getDistance(city1: City, city2: City) {
    return Math.pow((Math.pow((city2.x - city1.x), 2) + Math.pow((city1.y - city2.y), 2)), 0.5);
  }

}
