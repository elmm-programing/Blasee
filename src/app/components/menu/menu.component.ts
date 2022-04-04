import { Component,OnInit } from '@angular/core';

import {LoginService} from 'src/app/services/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {Observable} from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {


  UserLogged = this.loginService.getUserLogged(); 
  UserId:string|null|undefined;
  profileUrl: Observable<string | null>
  newContact!:any; 

  allUsers:AngularFireList<any>;
  users:Observable<any[]>;

  constructor(private loginService: LoginService,private route: ActivatedRoute,private _router: Router,private storage: AngularFireStorage,private db: AngularFireDatabase) {

         this.allUsers = db.list('usuarios');
	 this.users = this.allUsers.snapshotChanges().pipe( map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    }) )

    this.users.subscribe( (action:any):any=>{
      console.log(action);
    
    } )
    console.log(this.users);

         this.UserId = this.route.snapshot.paramMap.get('uid');


/*
    const itemPath =  `usuarios/${this.UserId}`;
      this.item = db.object(itemPath).valueChanges();
      console.log(this.item);
*/
const ref = this.storage.ref(`/users/${this.UserId}`);
     this.profileUrl = ref.getDownloadURL();
     

		
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
