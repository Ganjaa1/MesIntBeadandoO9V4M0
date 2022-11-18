import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { City } from 'src/app/models/City';
import { Vehicle } from 'src/app/models/Vehicle';

@Component({
  selector: 'app-solver-components',
  templateUrl: './solver-components.component.html',
  styleUrls: ['./solver-components.component.scss']
})
export class SolverComponentsComponent implements OnInit {
  isLoading = false;

  cities: City[] = [];
  vehicles: Vehicle[] = [];
  depot: City = { x: 50, y: 50 }; 

  selectedVehicleNumber!:number;
  selectedCityNumber!:number;
  citiesNumber: number[] = [ 10 , 20 , 50 , 100 , 200 , 500];
  vehicleNumbers: number[] = [ 1 , 2 , 4 , 5 , 10 , 20];
  
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
        max:100
      },
      y: {
        beginAtZero: true,
        max:100
      }
    }
  }

  constructor() { }

  //selectboxra subscribe -> megadni a numbereket 2 db van!

  ngOnInit(): void {
    // this.generateCities(10);
    // //this.cities = [{x:10,y:10},{x:10,y:40},{x:30,y:80},{x:20,y:90},{x:70,y:30},{x:60,y:90},{x:50,y:40},{x:40,y:80},{x:90,y:60},{x:20,y:10}]
    // this.cities.unshift(this.depot)
    // console.log('cities:', this.cities)
    // this.shuffleCitiesForVehicles(1);
    // console.log('vehicles', this.vehicles);
    // this.searchRoutes();
  }
  
  makeAction(){
    if(this.selectedVehicleNumber && this.selectedCityNumber){
      this.chartData = [];
      this.cities = [];
      this.vehicles = [];
      this.isLoading = true;
      this.generateCities(this.selectedCityNumber);
      //this.cities = [{x:10,y:10},{x:10,y:40},{x:30,y:80},{x:20,y:90},{x:70,y:30},{x:60,y:90},{x:50,y:40},{x:40,y:80},{x:90,y:60},{x:20,y:10}]
      this.cities.unshift(this.depot)
      console.log('cities:', this.cities)
      this.shuffleCitiesForVehicles(this.selectedVehicleNumber);
      console.log('vehicles', this.vehicles);
      this.searchRoutes();
      this.isLoading = false;
    }else{
      alert("Wrong input!")
    }

  }

  generateCities(clientNumber: number) {
    let i = 0;
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

  shuffleCitiesForVehicles(riderNumber: number) {
    let usedCities: number[] = [];
    let tmpVehicles: { routeNumber: number, cityIndex: number }[] = [];

    this.cities.forEach((_city, index) => {
      let routeNumber = Math.floor(Math.random() * ((riderNumber) - 0) + 0);
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
  }


  objectFunction(routes: any[]) {
    let dist:number = 0;
    let prev = 0;
    for (let i = 0; i < routes.length; i++) {
      dist += +this.getDistance(this.cities[routes[prev]], this.cities[routes[i]]);
      prev = i;
    }
    dist += +this.getDistance(this.cities[routes[routes.length - 1]], this.cities[routes[0]]);
    return dist;

  }

  neighborhoodSearch(iterations: number, routes: number[]) {
    let bestCalc = this.objectFunction(routes);
    let bestRoutes = [...routes];

    let sBase = [...bestRoutes]
    let sBaseCalc = this.objectFunction(sBase)

    for (let i = 0; i < iterations; i++) {
      let bestNeighborRoutes = [...sBase];
      let bestNeighborCalc = sBaseCalc;

      for (let j = 0; j < 100; j++) {
        let neighbor = [...sBase];
        let a: number = Math.floor(Math.random() * ((bestRoutes.length - 2) -1)+1);
        let b: number = Math.floor(Math.random() * ((bestRoutes.length - 2) -1)+1);
        let tmp = neighbor[a];
        neighbor[a] = neighbor[b];
        neighbor[b] = tmp;
        let neighborCalc = this.objectFunction(neighbor);

        if (neighborCalc < bestNeighborCalc && a != b) {
          bestNeighborCalc = neighborCalc;
          bestNeighborRoutes = [...neighbor];
        }
      }
      sBase = [...bestNeighborRoutes];
      sBaseCalc = bestNeighborCalc;

      if (sBaseCalc < bestCalc) {
        bestRoutes = [...sBase];
        bestCalc = sBaseCalc;
      }
    }
    return bestRoutes;
  }

  optimumRouteSearch(routes: number[][]){
    let bestRoutes = [...routes];


    return bestRoutes;
  }


  searchRoutes() {
    let color = ['#000', '#00bcd6', '#d300d6']
    this.vehicles.forEach((vehicle, index) => {
      console.log('előtte: ', vehicle.destinations, '\nCalc: ', this.objectFunction(vehicle.destinations))
      let neighbor = this.neighborhoodSearch(200000, vehicle.destinations)
      console.log('utána: ', neighbor, '\nCalc: ', this.objectFunction(neighbor));
      // let optimum = this.optimumRouteSearch(vehicle.destinations)
      // console.log('optimum',optimum,'\nCalc: ', this.objectFunction(optimum))
      //let bestNeighbor = this.bestRouteSearch(100000, vehicle.destinations);
      //console.log('BestRouteSearch : ', bestNeighbor, '\nCalc: ', this.objectFunction(bestNeighbor),)
      // let bestNeighborSorted = this.neighborhoodSearch(100000, bestNeighbor);
      // let bestNeighborCalc = this.objectFunction(bestNeighborSorted);
      // console.log('BestRouteSearch : ', bestNeighbor, '\nCalc: ', this.objectFunction(bestNeighbor), '\nRendezve:', bestNeighborSorted, '\nennek calc: ', bestNeighborCalc);
      var r = Math.floor(Math.random() * 255);
      var g = Math.floor(Math.random() * 255);
      var b = Math.floor(Math.random() * 255);
      let color = "rgb(" + r + "," + g + "," + b + ")";
      this.chartData.push({
        label: `Vehicle[${index}]`,
        data: [
          ...neighbor.map(cityNumber => ({ x: this.cities[cityNumber].x, y: this.cities[cityNumber].y }))
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
    console.table(this.cities)
    console.log('usedcities:', this.usedCities)

  }

  getDistance(city1: City, city2: City) {
    return Math.abs(city2.x - city1.x) + Math.abs(city1.y - city2.y);
  }

}




  // bestRouteSearch(iterations: number, routes: number[]) {
  //   let bestCalc = this.objectFunction(routes);
  //   let bestRoutes = [...routes];

  //   let sBase = [...bestRoutes];
  //   let sBaseCalc = this.objectFunction(sBase)

  //   let tmpUsedCities: number[] = [...this.usedCities, ...bestRoutes];

  //   let allRoute:number[] = this.cities.map((_i,index)=> (index));
  //   let leftOverCities:number[] = allRoute.filter(city => !this.usedCities.includes(city))
    
  //   for (let i = 0; i < iterations; i++) {
  //     let bestNeighborRoutes = [...sBase];
  //     let bestNeighborCalc = sBaseCalc;

  //     for (let j = 0; j < 100; j++) {
  //       let randomCityIndex = Math.floor(Math.random() * ((leftOverCities.length - 1)));
  //       let routeIndex: number = Math.floor(Math.random() * ((this.cities.length - 1)));
  //       let insideRoutes = [...sBase];
  //       let randomCity = leftOverCities[randomCityIndex];
  //       if (!tmpUsedCities.includes(randomCity) && !bestNeighborRoutes.includes(randomCity)) {
  //         if (routeIndex < insideRoutes.length) {
  //           insideRoutes[routeIndex] = randomCity;
  //         }
  //         else if(routeIndex >= insideRoutes.length){
  //           insideRoutes.push(randomCity)
  //         }
  //       let currentRoutesSearchCalc = this.objectFunction(insideRoutes);
  //       if (currentRoutesSearchCalc < bestNeighborCalc && !tmpUsedCities.includes(randomCity)) {
  //         tmpUsedCities[tmpUsedCities.length - 1] = randomCity;
  //         bestNeighborCalc = currentRoutesSearchCalc;
  //         bestNeighborRoutes = [...insideRoutes];
  //       }
  //     }

  //     }
  //     sBase = bestNeighborRoutes;
  //     sBaseCalc = bestNeighborCalc;
  //     if (sBaseCalc < bestCalc) {
  //       bestRoutes = [...bestNeighborRoutes];
  //       bestCalc = bestNeighborCalc;
  //     }
  //   }
  //   bestRoutes.forEach(city => !this.usedCities.includes(city) ? this.usedCities.push(city) : null)
  //   return this.neighborhoodSearch(100000,bestRoutes);
  // }


  // bestRouteSearch(iterations: number, routes: number[]) {
  //   let bestCalc = this.objectFunction(routes);
  //   let bestRoutes = routes;
  //   let sBase = [...bestRoutes]
  //   let sBaseCalc = this.objectFunction(sBase)
  //   for (let i = 0; i < iterations; i++) {
  //     let bestNeighborRoutes = [...sBase];
  //     let bestNeighborCalc = sBaseCalc;
  //     for (let j = 0; j < 100; j++) {
  //       let neigbour = [...sBase];
  //       let a: number = Math.floor(Math.random() * ((bestRoutes.length - 1)));
  //       let citiesIndex: number = Math.floor(Math.random() * ((this.cities.length - 1)));
  //       let tmp = +neigbour[a];
  //       neigbour[a] = citiesIndex;
  //       neigbour[citiesIndex] = tmp;
  //       this.neighborhoodSearch(1000, neigbour)
  //       let neighbourCalc = this.objectFunction(neigbour);

  //       if (neighbourCalc < bestNeighborCalc && a != citiesIndex) {
  //         bestNeighborCalc = neighbourCalc;
  //         bestNeighborRoutes = neigbour;
  //       }
  //     }
  //     sBase = bestNeighborRoutes;
  //     sBaseCalc = bestNeighborCalc;
  //     if (sBaseCalc < bestCalc) {
  //       bestRoutes = sBase;
  //       bestCalc = sBaseCalc;
  //     }
  //   }
  //   return bestRoutes;
  // }


  // objectFunction(s: number[]) {
  //   let cities = [...this.cities];
  //   let dist = 0;
  //   let prev = 0;
  //   //dist += this.getDistance(this.depot, cities[s[0]])
  //   for (let i = 0; i < s.length; i++) {
  //     dist += this.getDistance(cities[prev], cities[s[i]])
  //     prev = i;
  //   }
  //   //dist += this.getDistance(this.depot, cities[s[s.length - 1]])

  //   return dist;

  // }

  // transformTSP(tsp: City[]) {
  //   let tspDict: number[][] = [];
  //   tsp.forEach((_city, i) => {
  //     tspDict[i] = [];
  //     tsp.forEach((_city, j) => tspDict[i][j] = this.getDistance(tsp[i], tsp[j]));
  //   })
  //   return tspDict;
  // }





  // neighborhoodSearch(iterations: number, neighbors: number, routes: number[]) {
  //   let riderRoutes = [...this.riders.map(item => [...item.destinations])];
  //   let bestSearch = this.objectFunction([...routes]);
  //   let bestRoutes = [...routes];
  //   let usedCities: number[] = [];

  //   for (let i = 0; i < iterations; i++) {
  //     let rowIndex: number = Math.floor(Math.random() * ((riderRoutes.length - 1)));
  //     let columnIndex: number = Math.floor(Math.random() * ((riderRoutes[rowIndex].length - 1)));
  //     let currentColumnIndex: number = Math.floor(Math.random() * ((bestRoutes.length - 1)));

  //     for (let j = 0; j < neighbors; j++) {
  //       let tmpRoutes = [...bestRoutes];
  //       tmpRoutes[currentColumnIndex] = riderRoutes[rowIndex][columnIndex];
  //       let currentCalc = this.objectFunction(tmpRoutes);
  //       if (currentCalc < bestSearch && !usedCities.includes(riderRoutes[rowIndex][columnIndex])) {
  //         console.log('ez jobb: ', currentCalc, ' mint: ', bestSearch, ' ezzel:', tmpRoutes, ' ehelyett: ', bestRoutes);
  //         bestSearch = currentCalc;
  //         bestRoutes = tmpRoutes;
  //         bestRoutes.forEach(route => usedCities.push(route))
  //       }
  //     }

  //   }

  //   console.log('best: ', bestRoutes)
  //   console.log('used: ', usedCities)
  //   return bestRoutes;
  // }

  // getBestBetweenRiders(iterations: number) {
  //   let riderRoutes = [...this.riders.map(item => [...item.destinations])];
  //   let optimalRoutes: number[][] = [...riderRoutes];
  //   let usedCities: number[] = [];

  //   riderRoutes.forEach((route, index) => {
  //     optimalRoutes[index] = [];
  //     let localBestRoutes = [...this.localSearch(1000000, route)];
  //     let localBestCalc = this.objectFunction(localBestRoutes);

  //     for (let i = 0; i < iterations; i++) {
  //       let rowIndex: number = Math.floor(Math.random() * ((riderRoutes.length - 1)));
  //       let columnIndex: number = Math.floor(Math.random() * ((riderRoutes[rowIndex].length - 1)));
  //       let currentRowIndex: number = Math.floor(Math.random() * ((route.length - 1)));

  //       if (!usedCities.includes(riderRoutes[rowIndex][columnIndex])) {
  //         let currentRoutes = [...localBestRoutes];
  //         let tmp = currentRoutes[currentRowIndex];
  //         currentRoutes[currentRowIndex] = riderRoutes[rowIndex][columnIndex];
  //         let currentCalc = this.objectFunction(currentRoutes);

  //         if (currentCalc < localBestCalc && !usedCities.includes(riderRoutes[rowIndex][columnIndex])) {
  //           console.log('ez jobb: ', currentCalc, ' mint: ', localBestCalc, ' ezzel:', currentRoutes, ' ehelyett: ', localBestRoutes);
  //           localBestCalc = currentCalc;
  //           localBestRoutes = currentRoutes;
  //           currentRoutes[currentRowIndex] = riderRoutes[rowIndex][columnIndex];
  //           riderRoutes[rowIndex][columnIndex] = tmp;
  //         }
  //       }
  //     }
  //     localBestRoutes.forEach(route => usedCities.push(route))
  //     optimalRoutes[index] = localBestRoutes;
  //   })
  //   console.log('vége')
  //   optimalRoutes.forEach((route, index) => {
  //     console.log(`rider[${index}]: \n route:${route} \n cost: ${this.objectFunction(route)}`)
  //   })
  //   this.cities.forEach((city, index) => {
  //     console.table(`${index}.(${city.x},${city.y})\n`)
  //   })
  //   //console.table(this.cities)
  // }

  // generateRoutesByDistance(riderNumber: number) {
  //   /////// úgy hogy usedcitesben nincs benne, és az összes távolságának a minje-t adni arányosan hozzá egy csoporthoz, ha nem arányosak a számok akkor oda adni, ahol a legkisebb a distance
  //   let cities = [...this.cities];
  //   let rate = Math.floor(this.cities.length / riderNumber);
  //   for (let i = 0; i < riderNumber; i++) {
  //     if ((i + 1) / rate) {

  //     }
  //   }

  //   if (this.cities.length % riderNumber != 0) {
  //     //lekezelni hogy a maradék elemek hova menjenek
  //   }

  // }

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