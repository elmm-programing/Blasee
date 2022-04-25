import {AfterViewInit,Component,ElementRef,OnInit,ViewChild} from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import {AngularFireDatabase,AngularFireObject,AngularFireList,} from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { combineLatest, Observable } from 'rxjs';
import { rejects } from 'assert';
import { DatePipe } from '@angular/common';
import { filter, map } from 'rxjs/operators';
import { ChatService } from 'src/app/services/chat.service';
import { loadavg } from 'os';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  UserLogged = this.loginService.getUserLogged();
  UserId: string | null | undefined;
  profileUrl: Observable<string | null>;
  nameItemRef: AngularFireObject<any>;
  comentarioItemRef: AngularFireObject<any>;
  name!: Observable<any>;
  nuevoMensaje: string = '';
  FilterUsers:any[]=[]
  searchContainer: boolean = false;
  changeMenu: boolean = this.loginService.changeMenu;
  public contactos: Contactos[] = [];
  public ids: any[] = [];
  public nombreContacto: any[] = [];
  public comentario: any[] = [];
  profileUrlC: Observable<string | null>[] = [];
  FilterusersPhotos: Observable<string | null>[] = [];
  changeChat: boolean = false;
  contactoAgregado: any;
  nombre!: string;
  comentarioU!: string;
  presionar:boolean = true;
  /*users*/
  userRef!: AngularFireList<any>;
  allUsers!: Observable<any[]>;
  allUserContacts!: Observable<any>;
  filterUserContacts: any[] = [];
  filteredStates$: Observable<any[]> ;
  filter: FormControl;
  filter$: Observable<any>;

  constructor(
    private loginService: LoginService,
    private route: ActivatedRoute,
    private _router: Router,
    private storage: AngularFireStorage,
    private db: AngularFireDatabase,
    private chat: ChatService
  ) {
    this.UserId = this.route.snapshot.paramMap.get('uid');

    this.nameItemRef = db.object(`usuarios/${this.UserId}/name`);
    this.nameItemRef.valueChanges().subscribe((value) => {
      this.nombre = value;
    });

    this.comentarioItemRef = db.object(`usuarios/${this.UserId}/comentario`);
    this.comentarioItemRef.valueChanges().subscribe((value) => {
      this.comentarioU = value;
    });

    const ref = this.storage.ref(`/users/${this.UserId}`);
    this.profileUrl = ref.getDownloadURL();

    this.ObtenerContactos();
    this.BuscarIdDeContactos();
    this.buscarUsuarios();
this.filter = new FormControl('');
  this.filter$ = this.filter.valueChanges;
  this.filteredStates$ = combineLatest(this.allUsers, this.filter$).pipe(
    map(([states, filterString]) => states.filter(state => state.name.toLowerCase().indexOf(filterString.toLowerCase()) !== -1))
  );
  }
  public deleteIdContactos(value: string) {
    const index = this.filterUserContacts.indexOf(value);
    if (index > -1) {
      this.filterUserContacts.splice(index, 1); // 2nd parameter means remove one item only
    }
  }
  
  public buscarUsuarios() {
    this.userRef = this.db.list('usuarios');
    this.allUsers = this.userRef.snapshotChanges().pipe(
      map((changes) => {
        let datos = changes.map((users) => {
          if (users.payload.key != this.UserId) {
            return { key: users.payload.key, ...users.payload.val() };
          }
        });
        let datosFiltrados = datos.filter((dato) => {
          if (dato !== undefined) {
            this.BuscarIdDeContactos();
            if (!this.filterUserContacts.includes(dato.key)) {
              let ref2 = this.storage.ref(`/users/${dato.key}`);
              this.FilterusersPhotos.push(ref2.getDownloadURL());
              dato.photo = ref2.getDownloadURL();
              return dato;
            }
          }
        });

        return datosFiltrados;
      })
    );
  }
  public BuscarIdDeContactos() {
    this.allUserContacts = this.db
      .list(`usuarios/${this.UserId}/Contactos`)
      .valueChanges();
    this.allUserContacts.subscribe((contactos: any) => {
      contactos.map((cont: any) => {
        if (!this.filterUserContacts.includes(cont.id)) {
          this.filterUserContacts.push(cont.id);
        }
      });
    });
  }

  public CambiarSideBar() {
    this.loginService.CambiarSideBar();
    this.changeMenu = !this.changeMenu;
  }

  AgregarContacto(key: string, name: string, comentario: string) {
    this.contactoAgregado = key;

    this.db.object(`usuarios/${this.UserId}/Contactos/${key}`).set({
      nombre: name,
      id: key,
      comentario: comentario,
    });

    this.db.object(`usuarios/${key}/Contactos/${this.UserId}`).set({
      nombre: this.nombre,
      id: this.UserId,
      comentario: this.comentarioU,
    });

    this.db
      .object(`chat/privado/${this.UserId} y ${this.contactoAgregado}`)
      .set({
        usuarios: this.UserId + ' y ' + key,
      });

    this.ObtenerContactos();

    this.searchContainer = false;
  }

  async ObtenerContactos() {
    var cont!: Contactos[];
    var ids!: any[];

    this.db
      .list('usuarios/' + this.UserId + '/Contactos')
      .valueChanges(['child_added', 'child_changed'])
      .subscribe((value) => {
        this.profileUrlC = [];
        cont = value as Contactos[];
        ids = cont.map((element) => {
          return element.id;
        });
        this.nombreContacto = cont.map((element) => {
          return element.nombre;
        });
        this.comentario = cont.map((element) => {
          return element.comentario;
        });

        for (let i = 0; i < ids.length; i++) {
          const ref2 = this.storage.ref(`/users/${ids[i]}`);
          this.profileUrlC.push(ref2.getDownloadURL());
        }

        this.ids = ids;
        this.contactos = cont;
      });
  }

  EliminarContactos(contacto: string) {
    setTimeout(() => {
      this.changeChat = false;
    }, 200);

    this.db.object(`usuarios/${this.UserId}/Contactos/${contacto}`).remove();
    this.db.object(`usuarios/${contacto}/Contactos/${this.UserId}`).remove();
    this.deleteIdContactos(contacto);
    this.BuscarIdDeContactos();
    this.buscarUsuarios();

    this.ObtenerContactos();
  }

  public logout(): any {
    this.loginService.logout();
    this._router.navigateByUrl('/login');
  }

  ngOnInit(): void {
    this.ObtenerContactos();
  }

  public Chats(posicion: number) {
    this.chat.idContacto = this.ids[posicion];
    this.chat.nombreContacto = this.nombreContacto[posicion];
    this.chat.imgContacto = this.profileUrlC[posicion];
    this.chat.UserId = this.UserId;

    this.changeChat = !this.changeChat;
    if (this.changeChat == false) {
      setTimeout(() => {
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
