import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GamePage } from './game.page';
import { HomePage } from '../home/home.page';

const routes: Routes = [
  {
    path: '',
    component: GamePage,
    children: [
      { path: 'home', component: HomePage },
      // Otras rutas específicas de la pestaña 'game'
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '**', redirectTo: 'home' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GamePageRoutingModule {}
