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
  comentarioItemRef: AngularFireObject<any>;
  name!: Observable<any>;
  nuevoMensaje: string = "";
   
  searchContainer: boolean = false;
  changeMenu:boolean = this.loginService.changeMenu;
  public contactos: Contactos[] = [];
  public ids: any[] = [];
  public nombreContacto: any[] = [];
  public comentario: any[] = [];
  profileUrlC: Observable<string | null>[] = [];
  changeChat:boolean = false;
  contactoAgregado:any;
  nombre!:string;
  comentarioU!:string;
  
/*users*/
userRef!: AngularFireList<any>;
  allUsers!: Observable<any[]>;
  FilterUsersWitoutUser:any[]=[];
  FilterUsers:any[]=[]
  allUserContacts!:Observable<any>;
  filterUserContacts:any[]=[];
private _listFilter: string = '';

	public get listFilter(): string {
		return this._listFilter;
	}
	public set listFilter(value: string) {
		this._listFilter = value;
		this.filterSearchUsers = this.performFilter(value);
	}

	filterSearchUsers!:any[];

  constructor(private loginService: LoginService,private route: ActivatedRoute,private _router: Router,private storage: AngularFireStorage, private db: AngularFireDatabase,
  private chat: ChatService) {

 
    this.UserId = this.route.snapshot.paramMap.get('uid');

	 this.nameItemRef = db.object(`usuarios/${this.UserId}/name`);
    this.nameItemRef.valueChanges().subscribe(value => {
      this.nombre = value;
  });

  this.comentarioItemRef = db.object(`usuarios/${this.UserId}/comentario`);
   this.comentarioItemRef.valueChanges().subscribe(value => {
     this.comentarioU = value;


 });

    const ref = this.storage.ref(`/users/${this.UserId}`);
    this.profileUrl = ref.getDownloadURL();

    this.ObtenerContactos();
this.allUserContacts =  this.db.list(`usuarios/${this.UserId}/Contactos`).valueChanges();
    this.allUserContacts.subscribe((contactos:any) => {
      contactos.map((cont:any) => {
	this.filterUserContacts.push(cont.id);

      })
    })
 this.userRef = this.db.list('usuarios');
    // Use snapshotChanges().map() to store the key
 //
    this.allUsers = this.userRef.snapshotChanges().pipe(
      map(changes => 
	  changes.map(c => {
	    if (c.payload.key != this.UserId) {
	    return ({ key: c.payload.key, ...c.payload.val() })
	    }
	  })
	 )
	  
    );   

    this.allUsers.subscribe( (value) => {
      value.map(val=>{
	if (val != null   ) {
	  console.log(this.FilterUsersWitoutUser.includes(val));
	  if (!this.FilterUsersWitoutUser.includes(val)) {
      this.FilterUsersWitoutUser.push(val);
	  }
	}
      })
    	
      console.log(this.FilterUsersWitoutUser);
    } )

    this.ObtenerUsuarios();

    

    }
	performFilter(filterBy: string): any[] {
	  filterBy = filterBy.toLocaleLowerCase();
	  return this.FilterUsers.filter( (product):any=>{
	    return product.name.toLocaleLowerCase().includes(filterBy)
	  
	  } )
	}
  	
    public ObtenerUsuarios(){
    setTimeout(() => {
  this.FilterUsersWitoutUser.filter((Users)=>{
	if(this.filterUserContacts.includes(Users.key)){

	}else{
	  /*verificar el array de usuarios que te llega con el que ya tiene*/
	  if (this.FilterUsers) {
	  	
	  }
  this.FilterUsers.push(Users); 	

	}})	
    
  this.filterSearchUsers = this.FilterUsers;
    },1000);

    }
  public CambiarSideBar(){
  this.loginService.CambiarSideBar();
  this.changeMenu  = !this.changeMenu;

  }
    	
  public DeleteFilterUserByKey(key:string){


    for (let index = 0; index < this.FilterUsers.length; index++) {
      if (this.FilterUsers[index].key === key){
	console.log(this.FilterUsers[index].key);
	console.log(index);
	this.FilterUsers.splice(index,1)
      }
    	
    }
    
    	

  }
  
  AgregarContacto(key:string,name:string,comentario:string){
  
  this.contactoAgregado = key;

  this.db.object(`usuarios/${this.UserId}/Contactos/${key}`).set({
    'nombre': name,
    'id': key,
    'comentario':comentario 
  });

  this.db.object(`usuarios/${key}/Contactos/${this.UserId}`).set({
    'nombre': this.nombre,
    'id': this.UserId,
    'comentario': this.comentarioU
  });


  this.db.object(`chat/privado/${this.UserId} y ${this.contactoAgregado}`).set({
    'usuarios': this.UserId + ' y ' + key
  });

  this.ObtenerContactos();
  this.DeleteFilterUserByKey(key);
  this.listFilter = '';
  this.filterSearchUsers = this.FilterUsers;

  this.searchContainer = false;
  }

  async ObtenerContactos(){

    var cont!: Contactos[];
    var ids!:any[];

    this.db.list('usuarios/' + this.UserId + '/Contactos').valueChanges(['child_added']).subscribe(
      value => {

        this.profileUrlC = [];
        cont = value as Contactos[];
        ids = cont.map(element =>{
          return element.id;
        });
        this.nombreContacto = cont.map(element =>{
          return element.nombre;
        });
        this.comentario = cont.map(element =>{
          return element.comentario;
        });


        for(let i=0;i<ids.length;i++){
          const ref2 = this.storage.ref(`/users/${ids[i]}`);
          this.profileUrlC.push(ref2.getDownloadURL());
        }
        
      
        this.ids = ids;
        this.contactos = cont;

      });


  }
    
      public logout(): any {
        this.loginService.logout();
        this._router.navigateByUrl('/login')
      }


  ngOnInit(): void {
    
    this.ObtenerContactos();
  }

  public Chats(posicion:number){
    this.chat.idContacto = this.ids[posicion];
    this.chat.nombreContacto = this.nombreContacto[posicion];
    this.chat.imgContacto = this.profileUrlC[posicion];
    this.chat.UserId = this.UserId;
    

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
  constructor(nombre: string, id: string, comentario: string) {
    this.nombre = nombre;
    this.id = id;
    this.comentario = comentario;
  }

  public nombre!: string;
  public id!: string;
  public comentario!: string;
  
}