import { Component,OnInit,Output,EventEmitter } from '@angular/core';
import {LoginService} from 'src/app/services/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
@Output()
startReLoadData: EventEmitter<any> = new EventEmitter<any>(); 

  UserLogged = this.loginService.getUserLogged(); 
  UserId:string|null|undefined;
  profileUrl: Observable<string | null>   
  nameItemRef: AngularFireObject<any>;
  name: Observable<any>;;
  comentarioItemRef: AngularFireObject<any>;
  comentario: Observable<any>;;


  constructor(private loginService: LoginService,private route: ActivatedRoute,private _router: Router,private storage: AngularFireStorage,db: AngularFireDatabase) {

         this.UserId = this.route.snapshot.paramMap.get('uid');

	 this.nameItemRef = db.object(`usuarios/${this.UserId}/name`);
    this.name = this.nameItemRef.valueChanges();
    
	 this.comentarioItemRef = db.object(`usuarios/${this.UserId}/comentario`);
    this.comentario = this.comentarioItemRef.valueChanges();



/*
    const itemPath =  `usuarios/${this.UserId}`;
      this.item = db.object(itemPath).valueChanges();
      console.log(this.item);
*/
    console.log(this.UserId);
const ref = this.storage.ref(`/users/${this.UserId}`);
     this.profileUrl = ref.getDownloadURL();

		

      }
public HidePerfil(){
  this.startReLoadData.emit();

    }
        public obtenerUsuarioLogeado() {
  	
    this.loginService.getUserLogged().subscribe( res =>{
      console.log(res?.email);
      console.log(this.UserId);
      return res?.email;
    });
  }

  ngOnInit(): void {
    console.log(this.UserId);
  }

}
