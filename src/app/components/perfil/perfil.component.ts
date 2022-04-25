import { Component,OnInit,Output,EventEmitter } from '@angular/core';
import {LoginService} from 'src/app/services/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {Observable} from 'rxjs';
import { contains } from '@firebase/util';

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
  comentario: Observable<any>;
  
  botonNombre = true;
  botonComentario = true;
  nombreInput = '';
  comentarioInput = '';
  userRef:AngularFireObject<any> | undefined;
  ref:any;
  allUsers!: Observable<any>;
  allId!: any;



  constructor(private loginService: LoginService,private route: ActivatedRoute,private _router: Router,private storage: AngularFireStorage, public db: AngularFireDatabase) {

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
    this.ref = this.storage.ref(`/users/${this.UserId}`);
     this.profileUrl = this.ref.getDownloadURL();

 
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


  ocultarBotonNombre(){
    this.botonNombre = !this.botonNombre;
  }

  ocultarBotonComentario (){
    this.botonComentario = !this.botonComentario;
  }

  actualizarNombre(){
    this.userRef = this.db.object(`usuarios/${this.UserId}`)
    this.userRef.update({name: this.nombreInput});
    this.botonNombre = true;
    
  }

  actualizarComentario(){
    this.userRef = this.db.object(`usuarios/${this.UserId}`)
    this.userRef.update({comentario: this.comentarioInput});
    this.botonComentario = true;
  }

  
  actualizarImagen(event:any){
    
  
  var pathFile = event.target.files[0];  
  
  this.storage.ref("users/" + this.UserId).delete();
  
  this.storage.upload("users/" + this.UserId, pathFile).then(()=>{

    this.profileUrl = this.ref.getDownloadURL();
  });
  }

  ngOnInit(): void {
    console.log(this.UserId);
  }

}
