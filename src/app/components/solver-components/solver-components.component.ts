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
    this.transformTSP(this.cities)
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
    let tmpRiders:{ routeNumber:number, city:City }[] = [];

    for (let index = 0; index < this.cities.length; index++) {
      let routeNumber = Math.floor(Math.random() * ((riderNumber-1) - 0) + 0);
      if(!usedCities.includes(index)){
        tmpRiders.push({'routeNumber':routeNumber,'city':this.cities[index]})
        usedCities.push(index);
      }
    }

    tmpRiders = tmpRiders.reduce((prevVal:any,nextVal:any) => ({
      ...prevVal,
      [nextVal.routeNumber]: [...(prevVal[nextVal.routeNumber] || []),nextVal.city],
    }),{});

    this.riders = Object.entries(tmpRiders)
    .map(groupedRoutes => ({'routeNumber':+groupedRoutes[0],'destinations':[...[groupedRoutes[1]]][0] as unknown as City[]}));
    console.log(this.riders)
  }

  
  transformTSP(tsp:City[]){
    let tspDict:number[][] = [];
    console.log(tspDict)
    for (let i = 0; i < tsp.length; i++) {
      tspDict[i] =[];
      for (let j = 0; j < tsp.length; j++) {
        tspDict[i][j] = this.getDistance(tsp[i], tsp[j]);
      }
    }
    return tspDict;
  }
  
  getDistance(city1:City,city2:City){
    return Math.pow((Math.pow((city2.x - city1.x),2) + Math.pow((city1.y - city2.y),2)),0.5);
  }

}
