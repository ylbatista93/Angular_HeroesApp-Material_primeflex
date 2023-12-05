import { Component, OnInit } from '@angular/core';
import { Hero } from '../../interfaces/hero.interface';

import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: [
  ]
})
export class ListPageComponent implements OnInit {

  public heroes: Hero[] = [];

  constructor(
    private heroesSvc: HeroesService,
  ){}


  ngOnInit(): void {
    this.heroesSvc.getHeroes().subscribe(heroResponse => {
      console.log(heroResponse);
      this.heroes = heroResponse;
    })

  }

  

}
