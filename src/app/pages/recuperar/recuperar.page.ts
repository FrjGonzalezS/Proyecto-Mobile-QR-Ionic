import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {

  mdl_user: string = '';

  constructor(private alertController: AlertController,
    private db: DbService) { }

  ngOnInit() {
  }
  
  recuperarUsuario() {
      if(this.db.validarUsuario(this.mdl_user)){
      this.mostrarMensaje()
    }else{
      this.menError()
    }
  }

  async mostrarMensaje() {
    const alert = await this.alertController.create({
      header: 'Información',
      message: 'Se ha restablecido contraseña',
      buttons: ['OK'],
    });
    await alert.present();
  }

  async menError() {
    const alert = await this.alertController.create({
      header: 'Información',
      message: 'Usuario Inválido',
      buttons: ['OK'],
    });
    await alert.present();
  }
}
