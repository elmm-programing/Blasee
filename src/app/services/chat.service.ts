import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public UserId:any;
  public idContacto:any;
  public nombreContacto:any;
  public imgContacto:any;
  public reff:any;

  constructor(private db: AngularFireDatabase) { 
  }


  Referencia(){
    
    this.db.database.ref(`chat/privado/${this.UserId} y ${this.idContacto}`).once('value', (snapshot) => {
      if(snapshot.exists() == true){
        this.reff = `${this.UserId} y ${this.idContacto}`;
      }else{
        this.reff = `${this.idContacto} y ${this.UserId}`;
      }
     });

  }


}
