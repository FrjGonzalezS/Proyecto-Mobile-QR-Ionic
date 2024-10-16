import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-modificar-pass',
  templateUrl: './modificar-pass.page.html',
  styleUrls: ['./modificar-pass.page.scss'],
})
export class ModificarPassPage implements OnInit {

  mdl_nombre: string = '';
  mdl_apellido: string = '';
  mdl_correo: string = '';
  mdl_contrasenaNueva: string = '';
  mdl_contrasenaActual: string = '';


  constructor(private router: Router, private api: ApiService, private loadingCtrl: LoadingController, private toastController: ToastController,
    private alertController: AlertController, private db: DbService) { }

  ngOnInit() {
    this.loadingCtrl.create({
      message: '',  
      spinner: 'bubbles'
    }).then(res => {
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
    this.mdl_nombre = '';
    this.mdl_apellido = '';
  }
  
  volver() {
    this.router.navigate(['principal']);
  }


  cambiarContrasena() {
    let that = this;
    this.loadingCtrl.create({
      message: 'Almacenando Persona...',
      spinner: 'bubbles'
    }).then(async res => {
      res.present();

      let data = await that.api.UsuarioModificarContrasena(this.mdl_correo, this.mdl_contrasenaNueva, this.mdl_contrasenaActual);
      console.log('hola ' + this.mdl_correo + ' ' + this.mdl_contrasenaNueva + ' ' + this.mdl_contrasenaActual )
      console.log('hola ' + JSON.stringify(data))
      //debugger;
      if(data['result'][0].RESPUESTA == 'OK') { // {"result":"OK"}
        let data2 = await that.api.UsuarioObtenerNombre(this.mdl_correo);
        this.db.almacenarPersona(this.mdl_correo, this.mdl_contrasenaNueva, data2['result'][0].NOMBRE, data2['result'][0].APELLIDO);
        console.log('holanda ' + this.mdl_correo + ' ' + this.mdl_contrasenaNueva + data2['result'][0].NOMBRE + data2['result'][0].APELLIDO)
        that.mostrarMensaje('Contraseña Modificada');
        this.db.eliminarPersona();
        that.router.navigate(['login']);
        that.limpiar();
      }else if(data['result'][0].RESPUESTA  == 'ERR02') { // {"result":"ERR02"}
        that.mostrarMensaje('Error en modificar');
      }
      debugger;
      res.dismiss();
    });
  }
}
