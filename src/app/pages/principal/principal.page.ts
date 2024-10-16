import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { AlertController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';
import { HttpClient } from '@angular/common/http';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {

  
  mdl_nombre: string = '';
  mdl_apellido: string = '';
  mdl_correo: string = '';
  mdl_contrasenaNueva: string = '';
  mdl_contrasenaActual: string = '';
  mdl_id_clase: string = '';

  nombre_personas: string = '';

  texto: string = '';

  arreglo1: string = '';
  arreglo2: string = '';

  //nombre_personas = [];

  characters = []
  constructor(private router: Router, private api: ApiService, private loadingCtrl: LoadingController, private toastController: ToastController,
    private alertController: AlertController, private db: DbService,private htpp: HttpClient) { }

  ngOnInit() {

    this.htpp.get<any>('https://rickandmortyapi.com/api/character')
    .subscribe(res => {
      console.log(res);
      this.characters = res.results;
    })

     this.loadingCtrl.create({
      message: '',  
      spinner: 'bubbles'
    }).then(res => {
      res.dismiss();
    }); 

    this.obtenerUsuario();

  }



  async obtenerUsuario() {
    console.log('chao: entrando')
    let that = this;
    this.loadingCtrl.create({
      message: 'Obetiendo Información...',
      spinner: 'bubbles'
    }).then(async res => {
      res.present();
      this.db.buscarCorreo().then((data1) => {
        console.log('mostrar: ' +JSON.stringify(data1.rows.item(0)))
        that.nombre_personas = data1.rows.item(0).NOMBRE + ' ' + data1.rows.item(0).APELLIDO;
      })
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
  
  CerrarSesion() {
    let that = this;
    this.loadingCtrl.create({
      message: 'Obetiendo Información...',
      spinner: 'bubbles'
    }).then(async res => {
      res.present();
    this.db.eliminarPersona();
    this.router.navigate(['login']);
    res.dismiss(); 
    })    
  }
  
  modificar() {
    this.router.navigate(['modificar-pass']);
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
      if(data['result'] == 'OK') { // {"result":"OK"}
        //that.mostrarMensaje('Contraseña Modificada');

      }else if(data['result'] == 'ERR02') { // {"result":"ERR02"}
        that.mostrarMensaje('Error en modificar');
      }
      debugger;
      res.dismiss();
    });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Hello World!',
      duration: 1500,
      icon: 'globe'
    });

    await toast.present();
  }

  asistencia() {
    let that = this;
    this.loadingCtrl.create({
      message: 'Escaneando ...',
      spinner: 'bubbles'
    }).then(async res => {
      res.present();
      
      await that.leerQR();
      this.mdl_id_clase = this.arreglo1;
      console.log('asis0 ' + this.mdl_id_clase )
      this.db.buscarCorreo().then(async (data1) => {
        this.mdl_correo = data1.rows.item(0).CORREO;      
        console.log('asis1 ' + this.mdl_correo ) 
        console.log('asis1.1 ' + this.mdl_correo )
  
        let data = await that.api.AsistenciaAlmacenar(this.mdl_correo, this.mdl_id_clase);  
        console.log('asis2 ' + JSON.stringify(data))
        if(data['result'][0].RESPUESTA == 'OK') { 
          that.mostrarMensaje('Asistencia registrada correctamente');
          console.log('asis5 ')
          
        }else if(data['result'][0].RESPUESTA == 'ERR03') { 
          that.mostrarMensaje('Error asistencia ya registrada');
          console.log('asis6 ')
        }
      });
      debugger;
      res.dismiss();
    });
  }

  async leerQR() {
    document.querySelector('body').classList.add('scanner-active');
   
    await BarcodeScanner.checkPermission({ force: true });
    
    BarcodeScanner.hideBackground();
   
    const result = await BarcodeScanner.startScan();
   
    if (result.hasContent) {
      this.texto = result.content;
      var arreglo = result.content.split('|');
      this.arreglo1 = arreglo[0];
      this.arreglo2 = arreglo[1];
      console.log('asis3 ' + this.arreglo1 ) 
      console.log('asis4 ' + this.arreglo2 ) 
    }else{
      this.arreglo1 = '';
      this.arreglo2 = '';
    }
   
    document.querySelector('body').classList.remove('scanner-active');
    
  };
}


