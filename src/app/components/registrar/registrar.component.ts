import {AngularFireStorage} from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireAction } from '@angular/fire/compat/database';
import {LoginService} from 'src/app/services/login.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent implements OnInit {
 public usuario  ={
    email: '',
    password: '',
    name:'',
    comentario:''
  }
  constructor(private loginService: LoginService,private db: AngularFireDatabase,private afStorage: AngularFireStorage,private _router: Router ) { }
     profileUrl!: Observable<string | null>;
  filePath!: String;
  upload(event:any) {    
    this.filePath = event.target.files[0]
  }
  uploadImage(uid:any){
    console.log(this.filePath)
    const fileRef = this.afStorage.ref(`users/${uid}`);
     const task = this.afStorage.upload('users/'+`${uid}`, this.filePath);
     this.profileUrl = fileRef.getDownloadURL();
     console.log(this.profileUrl);
           
  }
  
public Ingresar(): any {
    if (this.usuario.email && this.usuario.password && this.usuario.name && this.usuario.comentario && this.filePath) {
      this.loginService.register(this.usuario.email, this.usuario.password).then( (res:any)=>{
	const itemsRef = this.db.list('usuarios');
	itemsRef.set(res.user.uid,{name:this.usuario.name,comentario:this.usuario.comentario});
	this.uploadImage(res.user.uid);
	this._router.navigateByUrl('/main')
	console.log("Se Registro correctamente: ",res.user.uid);
      } )	
    }else{
alert("Insert some values")
    }
  	
  }

  ngOnInit(): void {
  }

}
