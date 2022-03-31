import { AfterViewInit, Component,ElementRef,OnInit, ViewChild } from '@angular/core';
import {LoginService} from 'src/app/services/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {Observable} from 'rxjs';
import { rejects } from 'assert';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit {
  UserLogged = this.loginService.getUserLogged(); 
  UserId:string|null|undefined;
  profileUrl: Observable<string | null>   
  nameItemRef: AngularFireObject<any>;
  name: Observable<any>;
  comentarioItemRef: AngularFireObject<any>;
  comentario: Observable<any>;
  nuevoMensaje: string = "";
  pipe!: any;
  today!: any;
  
  @ViewChild('contenedorMensajes') private contenedor!: ElementRef;
  public mensajes: Mensajes[] = [];
  no!: number;

  constructor(private loginService: LoginService,private route: ActivatedRoute,private _router: Router,private storage: AngularFireStorage, private db: AngularFireDatabase) {


    this.UserId = this.route.snapshot.paramMap.get('uid');

	 this.nameItemRef = db.object(`usuarios/${this.UserId}/name`);
    this.name = this.nameItemRef.valueChanges();
    
	 this.comentarioItemRef = db.object(`usuarios/${this.UserId}/comentario`);
    this.comentario = this.comentarioItemRef.valueChanges();

    const ref = this.storage.ref(`/users/${this.UserId}`);
    this.profileUrl = ref.getDownloadURL();
    setInterval(()=> { this.setValores() }, 2 * 1000);
    

    }
    

    public obtenerUsuarioLogeado() {
        
        this.loginService.getUserLogged().subscribe( res =>{
          console.log(res?.email);
          console.log(this.UserId);
          return res?.email;
        });
      }


  ngOnInit(): void {
    this.setValores();
  }
  
  ngAfterViewInit(): void {
    setTimeout(()=>
    {
    this.scrollUltimo();
    console.log("aja");
    }, 1000);
  }

  async enviarMensaje(){

    if (this.nuevoMensaje == "") return;
    this.no = this.mensajes.length + 1;
    this.pipe = new DatePipe('en-US');
    this.today = this.pipe.transform(Date.now(), 'MMM d, y, h:mm:ss a');
    
    await this.db.object('chat/privado/' + 'roomID/' + this.no + ' - ' + this.today).set({
      'mensaje': this.nuevoMensaje,
      'emisor': this.UserId,
      'fecha': this.today,
      'no': this.no
    });
    
    await this.setValores();

    this.nuevoMensaje = "";
    setTimeout(()=>
    {
    this.scrollUltimo();
    }, 30);

  }

  async setValores(){

    var msjdb!: Mensajes[];
    
    await this.obtenerMensajes().then(value => {
      msjdb = value as Mensajes[];
    });

    if(msjdb.length != this.mensajes.length){

      this.mensajes = msjdb;
      setTimeout(()=>
      {
      this.scrollUltimo();
      }, 30);

    }
    

  }

  async obtenerMensajes(){

    return new Promise((resolve, reject)=>{
      this.db.list('chat/privado/' + 'roomID', ref=>
      ref.orderByChild('no').limitToLast(25)).valueChanges().subscribe(
        value => {
          resolve(value);
        });

    });

  }

  async scrollUltimo(){

    try {

      this.contenedor.nativeElement.scrollTop = this.contenedor.nativeElement.scrollHeight;
 
    } catch(err) { 
      console.log(err);
    }  

  }


}

class Mensajes {
  mensaje!: string;
  emisor!: string;
  fecha!: string;
  no!: number;
  
}