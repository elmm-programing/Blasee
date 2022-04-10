import { AfterViewInit, Component,ElementRef,OnInit, ViewChild } from '@angular/core';
import {LoginService} from 'src/app/services/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase, AngularFireObject,AngularFireList } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {Observable} from 'rxjs';
import { rejects } from 'assert';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs/operators';
import { ChatService } from 'src/app/services/chat.service';
import { loadavg } from 'os';

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
  name!: Observable<any>;
  comentarioItemRef: AngularFireObject<any>;
  comentario: Observable<any>;
  nuevoMensaje: string = "";

  newContact!:any; 
  allUsers:AngularFireList<any>;
  users:Observable<any[]>;
  changeMenu:boolean = this.loginService.changeMenu;
  public contactos: Contactos[] = [];
  public ids: any[] = [];
  profileUrlC: Observable<string | null>[] = [];
  changeChat:boolean = false;
  contactoAgregado:any;
  nombre!:string;
  

  constructor(private loginService: LoginService,private route: ActivatedRoute,private _router: Router,private storage: AngularFireStorage, private db: AngularFireDatabase,
  private chat: ChatService) {

this.allUsers = db.list('usuarios');
	 this.users = this.allUsers.snapshotChanges().pipe( map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    }) )


    this.UserId = this.route.snapshot.paramMap.get('uid');

	 this.nameItemRef = db.object(`usuarios/${this.UserId}/name`);
    this.nameItemRef.valueChanges().subscribe(value => {
      this.nombre = value;
  });

    
	 this.comentarioItemRef = db.object(`usuarios/${this.UserId}/comentario`);
    this.comentario = this.comentarioItemRef.valueChanges();

    const ref = this.storage.ref(`/users/${this.UserId}`);
    this.profileUrl = ref.getDownloadURL();

    this.setValores();
    }


public CambiarSideBar(){
  this.loginService.CambiarSideBar();
  this.changeMenu  = !this.changeMenu;

  }
   
AgregarContacto(){
	let arr:any[];
	arr =this.newContact.split(',');
  this.contactoAgregado = arr[0];

  this.db.object(`usuarios/${this.UserId}/Contactos/${arr[0]}`).set({
    'nombre': arr[1],
    'id': arr[0]
  });

  this.db.object(`usuarios/${arr[0]}/Contactos/${this.UserId}`).set({
    'nombre': this.nombre,
    'id': this.UserId
  });


  this.db.object(`chat/privado/${this.UserId} y ${this.contactoAgregado}`).set({
    'usuarios': this.UserId + ' y ' + arr[0]
  });

  this.setValores();
  location.reload();
  }

  
  async setValores(){
    
    var cont!: Contactos[];
    var ids!:any[];
    
    await this.ObtenerContactos().then(value => {
      cont = value as Contactos[];
      ids = cont.map(element =>{
        return element.id;
      });
    });

    for(let i=0;i<ids.length;i++){

      const ref2 = this.storage.ref(`/users/${ids[i]}`);
      this.profileUrlC.push(ref2.getDownloadURL());
    }
  
    this.ids = ids;
    this.contactos = cont;

  }

  async ObtenerContactos(){

    return new Promise((resolve, reject)=>{
      this.db.list('usuarios/' + this.UserId + '/Contactos').valueChanges().subscribe(
        value => {
          resolve(value);
        });

    });

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

  public Chats(posicion:number){
    this.chat.id = this.ids[posicion];
    this.changeChat = !this.changeChat;
    if(this.changeChat == false){
      
    setTimeout(()=>
    {
      this.changeChat = !this.changeChat;

    }, 100);

  }
  }
  
}


class Contactos {
  constructor(nombre: string, id: string) {
    this.nombre = nombre;
    this.id = id;
  }

  public nombre!: string;
  public id!: string;
  
}