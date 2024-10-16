import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

    rutaBase: string = 'https://fer-sepulveda.cl/API_PRUEBA2/api-service.php';

  constructor(private http: HttpClient) { }


  UsuarioAlmacenar(correo, contrasena, nombre, apellido){
    let that = this;

    return new Promise(resolve =>{
      resolve(that.http.post(that.rutaBase, {
        nombreFuncion: 'UsuarioAlmacenar',
        parametros: [correo, contrasena, nombre, apellido]
      }).toPromise())

    })
  }

  UsuarioLogin(correo, contrasena){
    let that = this;

    return new Promise(resolve =>{
      resolve(that.http.post(that.rutaBase, {
        nombreFuncion: 'UsuarioLogin',
        parametros: [correo, contrasena]
      }).toPromise())

    })

  }

/*     UsuarioObtenerNombre(correo){
      let that = this;
  
      return new Promise(resolve => {
        resolve(that.http.get(that.rutaBase + '?nombreFuncion=UsuarioObtenerNombre&correo=' + correo).toPromise())
      })
    } */

    UsuarioObtenerNombre(correo){
      let that = this;
  
      return new Promise(resolve =>{
        resolve(that.http.get(that.rutaBase + '?nombreFuncion=UsuarioObtenerNombre&correo=' + correo).toPromise())
      })

    }

    UsuarioModificarContrasena(correo, contrasenaNueva, contrasenaActual){
      let that = this;
      return new Promise(resolve =>{
        resolve(that.http.patch(that.rutaBase, {
          nombreFuncion: 'UsuarioModificarContrasena',
          parametros: [correo, contrasenaNueva, contrasenaActual]
        }).toPromise())
  
      })
  
    }

    AsistenciaAlmacenar(correo, id_clase){
      let that = this;
  
      return new Promise(resolve =>{
        resolve(that.http.post(that.rutaBase, {
          nombreFuncion: 'AsistenciaAlmacenar',
          parametros: [correo, id_clase]
        }).toPromise())
  
      })
  
    }
  
}

