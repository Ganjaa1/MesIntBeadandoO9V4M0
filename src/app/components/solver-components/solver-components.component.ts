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
    console.log(this.cities)
    this.shuffleCitiesForRiders(4);
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
    let tmpRiders:Rider[] = [];
    for (let index = 0; index < this.cities.length; index++) {
      let routeNumber = Math.floor(Math.random() * ((riderNumber-1) - 0) + 0);
      if(!usedCities.includes(index)){
        tmpRiders.push({'routeNumber':routeNumber,'destinations':[this.cities[index]]})
        usedCities.push(index);
      }
    }
    tmpRiders = tmpRiders.reduce((prevVal:any,nextVal:any) => ({
      ...prevVal,
      [nextVal.routeNumber]: [...(prevVal[nextVal.routeNumber] || []),[...nextVal.destinations]],
    }),{});
    console.log(tmpRiders)
  }

}
