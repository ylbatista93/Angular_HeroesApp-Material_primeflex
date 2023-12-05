import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environments } from 'src/environments/environments';
import { Hero } from '../interfaces/hero.interface';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  private api_URL: string = environments.api_URL

  constructor(
    private http: HttpClient,
  ) { }


  getHeroes(): Observable <Hero[]> {
    return this.http.get<Hero[]>(`${this.api_URL}/heroes`);
  }

  getHeroById(id: string): Observable< Hero | undefined > {
    return this.http.get<Hero>(`${this.api_URL}/heroes/${ id }`)
    .pipe(
      catchError( error => of(undefined))
    );
  }

  getSuggestions(query: string): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.api_URL}/heroes?q=${ query }&_limit=6`)
  }

  // CRUD
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(`${ this.api_URL }/heroes`, hero )
  }

  updateHero(hero: Hero): Observable<Hero> {
    if( !hero.id ) throw Error('Hero id es requerido');
    return this.http.patch<Hero>(`${ this.api_URL }/heroes/${ hero.id }`, hero );
  }

  deleteHeroById(id: string): Observable<boolean> {
   
    return this.http.delete(`${ this.api_URL }/heroes/${ id }`)
    .pipe(
      catchError( err => of(false) ),
      map( resp => true)
    );
  }
}
