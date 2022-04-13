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
import { ChatService } from 'src/app/services/chat.service';import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit {
  UserLogged = this.loginService.getUserLogged(); 
  UserId:string|null|undefined;
  nameItemRef: AngularFireObject<any>;
  name: Observable<any>;
  profileUrl: Observable<string | null>   
  
  nuevoMensaje: string = "";
  pipe!: any;
  today!: any;

  @ViewChild('contenedorMensajes') private contenedor!: ElementRef;
  public mensajes: Mensajes[] = [];
  respuesta:any[] = [];
  no!: number;
  contacto:any;
  public nombreContacto: any;
  data:any;
  temp:any;
  posicion:any;
  refM:any;
  visto:any;
  vistoArr:any;
  emisor!:any[];
  
  constructor(private loginService: LoginService,private route: ActivatedRoute,private _router: Router,private storage: AngularFireStorage, private db: AngularFireDatabase,
    private chat: ChatService){

    this.contacto = chat.idContacto;
    this.nombreContacto = chat.nombreContacto;
    this.profileUrl = chat.imgContacto;
    this.UserId = this.route.snapshot.paramMap.get('uid');

	 this.nameItemRef = db.object(`usuarios/${this.UserId}/name`);
    this.name = this.nameItemRef.valueChanges();

    const ref = this.storage.ref(`/users/${this.contacto}`);
    this.profileUrl = ref.getDownloadURL();

    console.log(this.contacto);

    setTimeout(()=> { 
      this.refM = chat.reff;
      this.obtenerMensajes(); 
    }, 300);
    
    }

  ngOnInit(){
    this.chat.Referencia();
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
  
  if(this.temp!){
    await this.db.object(`chat/privado/${this.refM}/Mensajes/${idMsg} - ${this.today}`).set({
      'mensaje': this.nuevoMensaje,
      'mensajeResp': this.temp,
      'emisor': this.UserId,
      'fecha': this.today,
      'no': this.no,
      'visto': false
    });
    this.temp = "";

  }else{
  await this.db.object(`chat/privado/${this.refM}/Mensajes/${idMsg} - ${this.today}`).set({
    'mensaje': this.nuevoMensaje,
    'emisor': this.UserId,
    'fecha': this.today,
    'no': this.no,
    'visto': false
     });
  }
    await this.obtenerMensajes();

    this.nuevoMensaje = "";
    setTimeout(()=>
    {
    this.scrollUltimo();
    }, 30);

  }

  TipoMensaje(emisor:string){
    if (this.UserId==emisor){
        return "enviado"
        }
    else{
        return "recibido"
    }
  }

  ResponderMensaje(mensaje:string, posicion:number){
    this.temp = mensaje;
  }
  
  Cancelar(){
    this.temp = "";
  }

  async obtenerMensajes(){

    var msjdb!: Mensajes[];

    this.db.list(`chat/privado/${this.refM}/Mensajes`, ref=>
    ref.orderByChild('no').limitToLast(25)).valueChanges(['child_added']).subscribe(
      value => { 
        msjdb = value as Mensajes[];
        this.emisor = msjdb.map(element =>{
          return element.emisor;
        });
        this.vistoArr = msjdb.map(element =>{
          return element.visto;
        });
        
        if(this.emisor.length > 0){
          if(this.emisor[this.emisor.length - 1] != this.UserId){
            let dbCon = this.db.database.ref(`chat/privado/${this.refM}/Mensajes/`);
            dbCon.once("value", function(snapshot) {
              snapshot.forEach(function(child) {
                child.ref.update({
                  visto: true
                });
              });
            }).then(()=>{
              this.visto = true;
            });

          }else if(this.vistoArr[this.vistoArr.length - 1] == true){
            this.visto = true;
          }else{
            this.visto = false;
          }
       }else{
         this.visto = false;
       }

        if(msjdb.length != this.mensajes.length){
    
          this.mensajes = msjdb;
          setTimeout(()=>
          {
          this.scrollUltimo();
          }, 30);
    
        }else{
          
          this.mensajes = msjdb;  
          
        }
          
        this.data = true;

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
  mensajeResp!: string;
  emisor!: string;
  fecha!: string;
  no!: number;
  visto!: boolean;
  
}