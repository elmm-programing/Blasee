import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {LoginService} from 'src/app/services/login.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
   UserId:any;

  constructor(private loginService: LoginService,private _router: Router) {

  }

  public usuario: {email:string;password:string;} ={
    email: '',
    password: ''
  }
  public Ingresar(): any {
    if (this.usuario.email && this.usuario.password) {
      try {
      	this.loginService.login(this.usuario.email, this.usuario.password).then( (res:any)=>{
	if (res.user.uid) {
	  this.UserId = res.user.uid
	  this._router.navigate(['main',{uid:this.UserId}])
	console.log("Se inicio sesion: ",res);
	}
      } )
      } catch (e) {
	alert('Contraseña o Email erroneos')
  
      }
      	
    }else{
alert("Rellene todos los campos")
    }
  	
  }
    ngOnInit(): void {

  }

}
