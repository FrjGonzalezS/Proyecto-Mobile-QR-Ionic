import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.page.html',
  styleUrls: ['./crear-usuario.page.scss'],
})
export class CrearUsuarioPage implements OnInit {

  mdl_correo: string = '';
  mdl_contrasena: string = '';
  mdl_nombre: string = '';
  mdl_apellido: string = '';

  constructor(private router: Router, private api: ApiService,
    private loadingCtrl: LoadingController, private toastController: ToastController) { }

  ngOnInit() {
    this.loadingCtrl.create({
      message: '',  
      spinner: 'bubbles'
    }).then(res => {
      res.dismiss();
    });
  }

  crear() {
    let that = this;
    this.loadingCtrl.create({
      message: 'Almacenando Persona...',
      spinner: 'bubbles'
    }).then(async res => {
      res.present();

      let data = await that.api.UsuarioAlmacenar(this.mdl_correo, this.mdl_contrasena, this.mdl_nombre, this.mdl_apellido);
      console.log('hola ' + this.mdl_correo + ' ' + this.mdl_contrasena)
      console.log('hola ' + JSON.stringify(data))
      //debugger;
      if(data['result'][0].RESPUESTA == 'OK') { // {"result":[{"RESPUESTA":"OK"}]}
          that.mostrarMensaje('Persona Almacenada Correctamente');
          that.router.navigate(['login']);
          that.limpiar();
      }else if(data['result'][0].RESPUESTA == 'ERR01') { // {"result":[{"RESPUESTA":"ERR01"}]}
        that.mostrarMensaje('Este correo ya esta registrado');
        that.limpiar();
      }
      else if (this.mdl_correo == null && this.mdl_contrasena == null && this.mdl_nombre == null  &&this.mdl_apellido == null){
        that.mostrarMensaje('Error al almacenar');
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
    this.mdl_nombre = '';
    this.mdl_apellido = '';
  }

  volver() {
    this.router.navigate(['login']);
  }

}
