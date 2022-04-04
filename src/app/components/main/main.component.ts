import { Component,OnInit } from '@angular/core';
import {LoginService} from 'src/app/services/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {Observable} from 'rxjs';
import { rejects } from 'assert';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  UserLogged = this.loginService.getUserLogged(); 
  UserId:string|null|undefined;
  profileUrl: Observable<string | null>   
  nameItemRef: AngularFireObject<any>;
  name: Observable<any>;
  comentarioItemRef: AngularFireObject<any>;
  comentario: Observable<any>;
  nuevoMensaje: string = "";

  newContact!:any; 
  allUsers:AngularFireList<any>;
  users:Observable<any[]>;
  changeMenu:boolean = this.loginService.changeMenu;


  constructor(private loginService: LoginService,private route: ActivatedRoute,private _router: Router,private storage: AngularFireStorage, private db: AngularFireDatabase) {

this.allUsers = db.list('usuarios');
	 this.users = this.allUsers.snapshotChanges().pipe( map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    }) )


    this.UserId = this.route.snapshot.paramMap.get('uid');

	 this.nameItemRef = db.object(`usuarios/${this.UserId}/name`);
    this.name = this.nameItemRef.valueChanges();
    
	 this.comentarioItemRef = db.object(`usuarios/${this.UserId}/comentario`);
    this.comentario = this.comentarioItemRef.valueChanges();

    const ref = this.storage.ref(`/users/${this.UserId}`);
    this.profileUrl = ref.getDownloadURL();

    }
    public CambiarSideBar(){
      this.loginService.CambiarSideBar();
      this.changeMenu  = !this.changeMenu;



    }
   
public AgregarContacto(): any {
	let arr:any[];
	arr =this.newContact.split(',')
	console.log(arr[0]);
	console.log(arr[1]);
	const itemsRef = this.db.list(`usuarios/${this.UserId}/Contactos`);
	itemsRef.set(arr[1],{key:arr[0]});

	

      	
      }
    public obtenerUsuarioLogeado() {
        
        this.loginService.getUserLogged().subscribe( res =>{
          console.log(res?.email);
          console.log(this.UserId);
          return res?.email;
        });
      }
    
      public logout(): any {
        this.loginService.logout();
        this._router.navigateByUrl('/login')
      }


  ngOnInit(): void {
  }


}
