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
  tspDictionary: any[] = [];
  constructor() { }

  ngOnInit(): void {
    this.generateCitiesCoordinates(10);
    this.tspDictionary = this.transformTSP(this.cities);
    console.log('cities:', this.cities)
    this.shuffleCitiesForRiders(3);
    console.log('riders', this.riders)
    this.getBestBetweenRiders(10000)
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

  objectFunction(s: any[]) {
    let dist = 0;
    let prev = s[0];
    for (let i = 0; i < s.length; i++) {
      dist += this.tspDictionary[prev][i];
      prev = i;
    }
    dist += this.tspDictionary[s.slice(-1)[0]][0];
    return dist;

  }

  localSearch(iterations: number, routes: number[]) {
    let tmpRoutes = [...routes];
    let bestSearch = this.objectFunction(tmpRoutes);
    let bestRoutes = tmpRoutes;

    for (let i = 0; i < iterations; i++) {
      tmpRoutes = [...routes]
      let a: number = Math.floor(Math.random() * ((tmpRoutes.length - 1)));
      let b: number = Math.floor(Math.random() * ((tmpRoutes.length - 1)));
      let tmp = tmpRoutes[a];
      tmpRoutes[a] = tmpRoutes[b];
      tmpRoutes[b] = tmp;
      let currenRoutesSearchCalc = this.objectFunction(tmpRoutes);

      if (currenRoutesSearchCalc < bestSearch && a != b) {
        bestSearch = currenRoutesSearchCalc;
        bestRoutes = tmpRoutes;
      }

    }
    return bestRoutes;
  }

  getBestBetweenRiders(iterations: number) {
    let riderRoutes = [...this.riders.map(item => [...item.destinations])];
    let optimalRoutes: number[][] = [...riderRoutes];
    let usedCities: number[] = [];
  }

  // getBestBetweenRiders(iterations: number) {
  //   let riderRoutes = [...this.riders.map(item => [...item.destinations])];
  //   let optimalRoutes: number[][] = [...riderRoutes];
  //   let usedCities: number[] = [];

  //   riderRoutes.forEach((route,index) => {
  //     optimalRoutes[index] = [];
  //     let localBestRoutes = [...this.localSearch(1000000, route)];
  //     let localBestCalc = this.objectFunction(localBestRoutes);

  //     for (let i = 0; i < iterations; i++) {
  //       let rowIndex: number = Math.floor(Math.random() * ((riderRoutes.length - 1)));
  //       let columnIndex: number = Math.floor(Math.random() * ((riderRoutes[rowIndex].length - 1)));
  //       let currentRowIndex: number = Math.floor(Math.random() * ((route.length - 1)));

  //       if(!usedCities.includes(riderRoutes[rowIndex][columnIndex])){
  //         let currentRoutes = [...localBestRoutes];
  //         let tmp = currentRoutes[currentRowIndex];
  //         currentRoutes[currentRowIndex] = riderRoutes[rowIndex][columnIndex];
  //         let currentCalc = this.objectFunction(currentRoutes);

  //         if(currentCalc < localBestCalc && !usedCities.includes(riderRoutes[rowIndex][columnIndex])){
  //           console.log('ez jobb: ',currentCalc, ' mint: ',localBestCalc,' ezzel:', currentRoutes, ' ehelyett: ',localBestRoutes);
  //           localBestCalc = currentCalc;
  //           localBestRoutes = currentRoutes;
  //           currentRoutes[currentRowIndex] = riderRoutes[rowIndex][columnIndex];
  //           riderRoutes[rowIndex][columnIndex] = tmp;
  //         }
  //       }
  //     }
  //     localBestRoutes.forEach(route => usedCities.push(route))
  //     optimalRoutes[index]= localBestRoutes;
  //   })
  //   console.log('vége')
  //   optimalRoutes.forEach((route,index) => {
  //     console.log(`rider[${index}]: \n route:${route} \n cost: ${this.objectFunction(route)}`)
  //   })
  //   this.cities.forEach((city,index) => {
  //     console.table(`(${city.x},${city.y})\n`)
  //   })
  //   //console.table(this.cities)
  // }

  getDistance(city1: City, city2: City) {
    return Math.pow((Math.pow((city2.x - city1.x), 2) + Math.pow((city1.y - city2.y), 2)), 0.5);
  }

}
      // let tmpCurrentArray = [...localBestRoutes];
      // localBestRoutes.forEach((_currentItem,currentItemIndex) => {
      //   riderRoutes.filter(rider => rider != route).forEach(notCurrentArray =>{
      //     //console.log(tmpCurrentArray, notCurrentArray)
      //       notCurrentArray.forEach(notCurrentItem =>{
      //         tmpCurrentArray[currentItemIndex] = notCurrentItem;
      //         let currentRoutes= this.localSearch(1000000,tmpCurrentArray);
      //         let currentCalc = this.objectFunction(currentRoutes);
      //         //console.log(currentCalc, currentRoutes)
      //         if(currentCalc < localBestCalc && !usedCities.some(city => notCurrentArray.indexOf(city) >=0)){
      //           console.log('ez jobb: ',currentCalc, ' mint: ',localBestCalc,' ezzel:', currentRoutes, ' ehelyett: ',localBestRoutes);
      //           localBestCalc = currentCalc;
      //           localBestRoutes = currentRoutes;
      //           localBestRoutes.forEach(route => usedCities.push(route))
      //           optimalRoutes[index] = [...new Set(currentRoutes)]
      //         }
      //       })
      //   })