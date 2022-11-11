import { Component, OnInit } from '@angular/core';
import { City } from 'src/app/models/City';
import { Rider } from 'src/app/models/Rider';

@Component({
  selector: 'app-solver-components',
  templateUrl: './solver-components.component.html',
  styleUrls: ['./solver-components.component.scss']
})
export class SolverComponentsComponent implements OnInit {

  cities:City[] = [];
  riders:Rider[] = [];
  constructor() { }

  ngOnInit(): void {
    this.generateCitiesCoordinates(10);
    console.log('cities:',this.cities)
    this.shuffleCitiesForRiders(4);
    // for (let index = 0; index < dataIndexes.length; index++) {
    //   console.log(`Vehicle[${index}] route: ${[...dataIndexes[index]]} \n and it's cost: ${this.objectFunction(this.transformTSP(this.cities),dataIndexes[index])}`);
    // }
  } 

  generateCitiesCoordinates(clientNumber:number){
    for (let index = 0; index < clientNumber; index++) {
      let x = Math.floor(Math.random() * 10);
      let y = Math.floor(Math.random() * 10);
      this.cities.push({x,y})
    }
  }

  shuffleCitiesForRiders(riderNumber:number){
    let usedCities:number[] = [];
    let tmpRiders:{ routeNumber:number, cityIndex:number }[] = [];

    for (let index = 0; index < this.cities.length; index++) {
      let routeNumber = Math.floor(Math.random() * ((riderNumber-1) - 0) + 0);
      if(!usedCities.includes(index)){
        tmpRiders.push({'routeNumber':routeNumber,'cityIndex':index})
        usedCities.push(index);
      }
    }

    tmpRiders = tmpRiders.reduce((prevVal:any,nextVal:any) => ({
      ...prevVal,
      [nextVal.routeNumber]: [...(prevVal[nextVal.routeNumber] || []),nextVal.cityIndex],
    }),{});

    this.riders = Object.entries(tmpRiders)
    .map(groupedRoutes => ({'routeNumber':+groupedRoutes[0],'destinations':[...[groupedRoutes[1]]][0] as unknown as number[]}));
    console.log('riders',this.riders)
  }

  transformTSP(tsp:City[]){
    let tspDict:number[][] = [];
    for (let i = 0; i < tsp.length; i++) {
      tspDict[i] =[];
      for (let j = 0; j < tsp.length; j++) {
        tspDict[i][j] = this.getDistance(tsp[i], tsp[j]);
      }
    }
    return tspDict;
  }

  objectFunction(dictionary:number[][],s:any){
    let dist = 0;
    let prev = s[0];
    for (let i = 0; i < s.length; i++) {
      dist += dictionary[prev][i];
      prev = i;
    }
    dist += dictionary[s.slice(-1)[0]][0];
    return dist;

  }

  localSearch(iterations:number){
    let tsp_dict = this.transformTSP(this.cities);
    let riderPaths = this.riders.map(item => item.destinations.map(dest => dest));
    for (let i = 0; i < riderPaths.length; i++) {
      //itt úgy vizsgálódni, hogy ez a loop nézi hogy az elsőhöz rendelve hogy a legjobb, majd megy a kövi sorra, amiken már átment elmenti
    }
    // for (let index = 0; index < dataIndexes.length; index++) {
    //   console.log(`Vehicle[${index}] route: ${[...dataIndexes[index]]} \n and it's cost: ${this.objectFunction(this.transformTSP(this.cities),dataIndexes[index])}`);
    // }
    // let objectF = this.objectFunction(tsp_dict,s)
    // let sBest = s;
    //let fBest =
  }
  
  getDistance(city1:City,city2:City){
    return Math.pow((Math.pow((city2.x - city1.x),2) + Math.pow((city1.y - city2.y),2)),0.5);
  }

}
