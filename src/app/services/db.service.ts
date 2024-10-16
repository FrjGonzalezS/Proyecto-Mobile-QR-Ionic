import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  validador: boolean = false;

  constructor(private router: Router, private sqlite: SQLite) { 
    // SE CREA LA BASE DE DATOS
    this.sqlite.create({
      name: "datos.db",
      location: "default" //esto se añade en las ultimas versiones
    }).then((db: SQLiteObject) => {
      db.executeSql("CREATE TABLE IF NOT EXISTS USUARIO(CORREO VARCHAR(75),"
        + "CONTRASENA VARCHAR(30), NOMBRE VARCHAR(20), APELLIDO VARCHAR(20))", []).then(() => {
          console.log('chao: Tabla creada correctamente');
        }).catch(e => {
          console.log('chao: TABLA NOK')
        })
    }).catch(e => {
      console.log('chao: BASE DE DATOS NOK')
    }) 
  }

  almacenarPersona(correo, contrasena, nombre, apellido) {
    this.sqlite.create({
      name: "datos.db",
      iosDatabaseLocation: "default"
    }).then((db: SQLiteObject) => {
      db.executeSql('INSERT INTO USUARIO VALUES(?, ?, ?, ?)', 
      [correo, contrasena, nombre, apellido]).then(() => {
          console.log('chao: Base de datos OK');
        })
    });
  }

  eliminarPersona() {
    this.sqlite.create({
      name: "datos.db",
      iosDatabaseLocation: "default"
    }).then((db: SQLiteObject) => {
      db.executeSql('DELETE FROM USUARIO', 
      []).then(() => {
          console.log('FRJ: Persona eliminada correctamente');
        })
    });
  }
  
  buscarCorreo() {
    console.log('chao: entrando a buscar correo')
    return this.sqlite.create({
      name: "datos.db",
      iosDatabaseLocation: "default"
    }).then((db: SQLiteObject) => {
      return db.executeSql('SELECT * FROM USUARIO', []).then((data) => {
          return data;
        })
    });
  }

  canActivate(){
    if(this.validador){
      return true;
    }else{
    this.router.navigate(['login']);
    return false;
    }
  }

  validarCredencial(user, pass){
    if(user == 'admin' && pass == 'admin'){
      this.validador = true;
      this.router.navigate(['principal']);
      return true;
    }else{
      return false;
    }
  }

  validarUsuario(user){
    if(user == 'admin'){
      this.router.navigate(['login']);
      return true;
    }else{
      return false;
    }
  }

}
