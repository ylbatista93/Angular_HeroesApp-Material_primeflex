import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { filter, first, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})

export class NewPageComponent implements OnInit {

  public heroForm = new FormGroup({
    id: new FormControl<string>(''),              
    superhero: new FormControl<string>('', { nonNullable: true }),       
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),       
    first_appearance: new FormControl<string>(''),
    characters: new FormControl<string>(''),      
    alt_img: new FormControl<string>(''),        
  });

  public publishers = [
    {id: 'DC Comics', desc: 'DC-Comics'},
    {id: 'Marvel Comics', desc: 'Marvel-Comics'}
  ]

  constructor(
    private heroesSvc: HeroesService,

    private activateRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ){}

  ngOnInit(): void {
    // si la url no contiene el tag edit, retornar para que siga con la funcion de crear heroe
    if( !this.router.url.includes('edit') ) return;

    this.activateRoute.params
    .pipe(
      // desectructuro el params para obtener el id ({ id }) y llamo al svc para obtener el hero de ese id
      switchMap(({ id }) => this.heroesSvc.getHeroById( id )),
    ).subscribe( hero => {
      console.log(hero);

      if( !hero ) {
        return this.router.navigateByUrl('/')
      };

      this.heroForm.reset( hero );
      return;
      
    })
  }

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  onSubmit(){

    if( this.heroForm.invalid ) return;
    if( this.currentHero.id ) {
      this.heroesSvc.updateHero( this.currentHero )
      .subscribe( hero => {
        // TODO: mostrar snackbar
        this.showSnackBar(`${hero.superhero} Actualizado!!`);
      });
      return;
    }

    this.heroesSvc.addHero( this.currentHero )
    .subscribe ( hero => {
      // TODO: mostrar snackbar, y navegar a /heroes/edit/ hero.id
      this.showSnackBar(`${hero.superhero} Creado!!`);
      this.router.navigate(['/heroes/edit', hero.id]);
    })
    
  }

  // creo un metodo para mostrar el snackbar
  showSnackBar( message: string ):void {
    this.snackBar.open( message, 'Echo', {
      duration: 2500,
    } )
  }

  // metodo para eliminar hero
  onDeleteHero() {
    if( !this.currentHero.id ) throw Error('Hero ID es requerido');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });

    dialogRef.afterClosed()
    .pipe(
      filter(( result: boolean) =>result ),
      switchMap( () => this.heroesSvc.deleteHeroById( this.currentHero.id )),
      filter( (wasDeleted: boolean ) => wasDeleted ),
    )
    .subscribe(() => {
      this.router.navigate(['/heroes']);
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   if( !result ) return;
    //   // console.log( 'ELIMINADO' );
    //   this.heroesSvc.deleteHeroById( this.currentHero.id )
    //   .subscribe( wasDeleted => {

    //     if( wasDeleted ) {
    //       console.log('Heroe eliminado', wasDeleted);
    //       this.router.navigate(['/heroes']);
    //     }
    //   });
    // });
  }

}
