import { AfterViewInit, Component,ElementRef,OnInit, ViewChild } from '@angular/core';
import {LoginService} from 'src/app/services/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase, AngularFireObject,AngularFireList } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {Observable} from 'rxjs';
import { rejects } from 'assert';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { ChatService } from 'src/app/services/chat.service';

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
  contacto:any;
  existencia:any;
  
  constructor(private loginService: LoginService,private route: ActivatedRoute,private _router: Router,private storage: AngularFireStorage, private db: AngularFireDatabase,
    private chat: ChatService){

    this.contacto = chat.id;
    this.UserId = this.route.snapshot.paramMap.get('uid');

	 this.nameItemRef = db.object(`usuarios/${this.UserId}/name`);
    this.name = this.nameItemRef.valueChanges();
    
	 this.comentarioItemRef = db.object(`usuarios/${this.UserId}/comentario`);
    this.comentario = this.comentarioItemRef.valueChanges();

    const ref = this.storage.ref(`/users/${this.UserId}`);
    this.profileUrl = ref.getDownloadURL();
    setInterval(()=> { this.setValores() }, 2 * 1000);
    
    this.Existencia();
    
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
    console.log();
  }
  
  ngAfterViewInit(): void {
    setTimeout(()=>
    {
    this.scrollUltimo();

    }, 1000);
  }

  async enviarMensaje(){

    if (this.nuevoMensaje == "") return;
    var idMsg = uuidv4();
    this.no = new Date().getTime();
    this.pipe = new DatePipe('en-US');
    this.today = this.pipe.transform(Date.now(), 'MMM d, y, h:mm:ss a');
    if(this.existencia){

      await this.db.object(`chat/privado/${this.UserId} y ${this.contacto}/Mensajes/${idMsg} - ${this.today}`).set({
        'mensaje': this.nuevoMensaje,
        'emisor': this.UserId,
        'fecha': this.today,
        'no': this.no
      });

    }else{
      
    await this.db.object(`chat/privado/${this.contacto} y ${this.UserId}/Mensajes/${idMsg} - ${this.today}`).set({
      'mensaje': this.nuevoMensaje,
      'emisor': this.UserId,
      'fecha': this.today,
      'no': this.no
    });
  
  }

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

    }else{
      
      this.mensajes = msjdb;  
      
    }
      
    

  }

  async obtenerMensajes(){

    if(this.existencia){
    return new Promise((resolve, reject)=>{
      this.db.list(`chat/privado/${this.UserId} y ${this.contacto}/Mensajes`, ref=>
      ref.orderByChild('no').limitToLast(25)).valueChanges().subscribe(
        value => {
          resolve(value);
        });
      });
    }else{
      
    return new Promise((resolve, reject)=>{
      this.db.list(`chat/privado/${this.contacto} y ${this.UserId}/Mensajes`, ref=>
      ref.orderByChild('no').limitToLast(25)).valueChanges().subscribe(
        value => {
          resolve(value);
        });
      });
    }

  }

  public Existencia(){
    
    this.db.database.ref(`chat/privado/${this.UserId} y ${this.contacto}`).once('value', (snapshot) => {
      if(snapshot.exists()){
        this.setExistencia(true);
      }else{
        this.setExistencia(false);
      }
     });


  }

  public setExistencia(existencia:boolean){
    this.existencia = existencia;
    console.log(this.existencia);
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