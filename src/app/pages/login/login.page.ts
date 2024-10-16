import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  mdl_correo: string = '';
  mdl_contrasena: string = '';
  mdl_nombre: string = '';

  constructor(private router: Router, private alertController: AlertController, private db: DbService, private api: ApiService,
    private loadingCtrl: LoadingController, private toastController: ToastController) { }

    ngOnInit() {
      this.loadingCtrl.create({
        message: '',  
        spinner: 'bubbles'
      }).then(res => {

        this.db.buscarCorreo().then((data1) => {
          console.log('chao: ' +JSON.stringify(data1.rows.item(0)))
          this.mdl_correo = data1.rows.item(0).CORREO
          this.mdl_contrasena = data1.rows.item(0).CONTRASENA
          this.validarUser();
        })
        
        res.dismiss();
      });
      
    }
  
    validarUser() {
      let that = this;
      this.loadingCtrl.create({
        message: 'Almacenando Persona...',
        spinner: 'bubbles'
      }).then(async res => {
        res.present();
  
        let data = await that.api.UsuarioLogin(this.mdl_correo, this.mdl_contrasena);
        console.log('holanda ' + this.mdl_correo + ' ' + this.mdl_contrasena)
        console.log('hola ' + JSON.stringify(data))
        //debugger;
        if(data['result'] == 'LOGIN OK') { // {"result":"LOGIN OK"}
          let data2 = await that.api.UsuarioObtenerNombre(this.mdl_correo);
          this.db.almacenarPersona(this.mdl_correo, this.mdl_contrasena, data2['result'][0].NOMBRE, data2['result'][0].APELLIDO);
          console.log('holanda ' + this.mdl_correo + ' ' + this.mdl_contrasena + data2['result'][0].NOMBRE + data2['result'][0].APELLIDO) 
          that.mostrarMensaje('Datos ingresados correctamente');
          that.router.navigate(['principal']);
          that.limpiar();
          //that.limpiar(); 
        }else if(data['result'] == 'LOGIN NOK') { // {"result":"LOGIN NOK"}
          that.mostrarMensaje('Credenciales incorrectas');
        }
        debugger;
        res.dismiss();
      });
    }
    
  
    async mostrarMensaje(mensaje) {
      const toast = await this.toastController.create({
        message: mensaje,
        duration: 3000,
        position: 'bottom'
      });
  
      await toast.present();
    }
  
    limpiar() {
      this.mdl_correo = '';
      this.mdl_contrasena = '';
    }

/*   ingresar() {
    if(!this.db.validarCredencial(this.mdl_correo, this.mdl_contrasena)){
      this.mostrarMensaje()
    }else{
      let extras: NavigationExtras ={
        state: {
          usuario: this.mdl_nombre,
          caulquierCosa:'Cualquier valor'
        }
      }  
      this.router.navigate(['principal'], extras);
    }
  } */



/*   async mostrarMensaje() {
    const alert = await this.alertController.create({
      header: 'Información',
      message: 'Credenciales Inválidas',
      buttons: ['OK'],
    });
    await alert.present();
  } */

  recuperar() {
    this.router.navigate(['recuperar']);
  }

  crearUsuario() {
    this.router.navigate(['crear-usuario']);
  }  
  
  navegar(){

    let extras: NavigationExtras ={
      state: {
        usuario: this.mdl_nombre,
        caulquierCosa:'Cualquier valor'
      }
    } 

    this.router.navigate(['principal'], extras);
  }

}
