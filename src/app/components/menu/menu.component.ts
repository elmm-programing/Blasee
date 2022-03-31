import { Component,OnInit } from '@angular/core';
import {LoginService} from 'src/app/services/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {Observable} from 'rxjs';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {


  UserLogged = this.loginService.getUserLogged(); 
  UserId:string|null|undefined;
  profileUrl: Observable<string | null>

  constructor(private loginService: LoginService,private route: ActivatedRoute,private _router: Router,private storage: AngularFireStorage,db: AngularFireDatabase) {

         this.UserId = this.route.snapshot.paramMap.get('uid');


/*
    const itemPath =  `usuarios/${this.UserId}`;
      this.item = db.object(itemPath).valueChanges();
      console.log(this.item);
*/
    console.log(this.UserId);
const ref = this.storage.ref(`/users/${this.UserId}`);
     this.profileUrl = ref.getDownloadURL();

		
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
    console.log(this.UserId);
  }
}
