import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SolverComponentsComponent } from './components/solver-components/solver-components.component';

const routes: Routes = [
  {path:'solver',component:SolverComponentsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
