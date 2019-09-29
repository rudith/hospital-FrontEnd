import { Component, OnInit, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { BasePageComponent } from '../../base-page';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../interfaces/app-state';
import { HttpService } from '../../../services/http/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { Content } from '../../../ui/interfaces/modal';
import { TCModalService } from '../../../ui/services/modal/modal.service';
import { HttpClient } from '@angular/common/http';
import { HistoriaCompleta } from '../../../interfaces/historia-completa';
import { IUser } from '../../../ui/interfaces/user';
import { Triaje } from '../../../interfaces/triaje';
import { Consulta } from '../../../interfaces/consulta';
import {ToastrService} from 'ngx-toastr'; 

@Component({
  selector: 'app-consultas',
  templateUrl: './listar-consultas.component.html',
  styleUrls: ['./listar-consultas.component.scss']
})
export class ListarConsultasComponent extends BasePageComponent implements OnInit {
  @ViewChild('modalBody', { static: true }) modalBody: ElementRef<any>;
  @ViewChild('modalFooter', { static: true }) modalFooter: ElementRef<any>;
  paciente: IUser;
  historiaForm: FormGroup;
  consultForm: FormGroup;
  verMasCForm: FormGroup;
  historiaRecibida: HistoriaCompleta;
  consultas: Consulta[];
  triajes: Triaje[];
  datoBus: string;
  private nombreRecibido:string;
  private numHistRecibido: string;
  private dniRecibido:string;
  private edadRecibido:number;
  private sexoRecibido:string;
  constructor(
    private formBuilder: FormBuilder,
    store: Store<IAppState>,
    httpSv: HttpService,
    private modal: TCModalService,
    private http: HttpClient,		
    private toastr:ToastrService,
  ) {

    super(store, httpSv);
    this.pageData = {
      title: 'Historial Clinico',
      loaded: true,
      breadcrumbs: [
        {
          title: 'UI Kit',
          route: 'default-dashboard'
        },
        {
          title: 'Tables',
          route: 'default-dashboard'
        },
        {
          title: 'Historial Clinico'
        }
      ]
    };
    this.consultas = [];
    this.triajes=[];
    this.datoBus=this.httpSv.getNroHC();
    console.log(this.datoBus);
    this.cargarPaciente();    
  }

  ngOnInit() {
    super.ngOnInit();
  }
  //Modal Crear Consulta
  openModalC<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, options: any = null) {
    this.initConsultForm();
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: options
    });
  }
  closeModalC() {
    this.modal.close();
    this.consultForm.reset();
  }
  initConsultForm() {
    this.consultForm = this.formBuilder.group({
      motivoConsulta: ['', Validators.required],
      apetito: ['', Validators.required],
      orina: ['', Validators.required],
      deposiciones: ['', Validators.required],
      examenFisico: ['', Validators.required],
      diagnostico: ['', Validators.required],
      tratamiento: ['', Validators.required],
      proximaCita:[null]
    });

  }
  addConsult(form: FormGroup) {
		if (form.valid) {
      let newConsult: Consulta = form.value;
      newConsult.proximaCita = formatDate(form.value.proximaCita, 'yyyy-MM-dd', 'en-US', '+0530');
      newConsult.numeroHistoria=1;
      newConsult.triaje=this.httpSv.getIdHC();
      newConsult.medico=2;
      console.log(newConsult);
			this.httpSv.crearConsulta(newConsult);
			this.closeModalC();
			this.toastr.success('','Consulta Agregada con Exito');
			this.cargarPaciente();
			this.consultForm.reset();
		}
	}


  //fin de Modal Crear Consulta

  //Modal Ver Consulta
  openModalVerC<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, options: any) {
    this.initVerMasForm(1);
    console.log(options);
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: options
    });
  }
  closeModalVerC() {
    this.modal.close();
    this.verMasCForm.reset();
  }
  initVerMasForm(data: number) {
    this.verMasCForm = this.formBuilder.group({
      talla: [this.historiaRecibida.triajes[data-1].talla ? this.historiaRecibida.triajes[data-1].talla: '', Validators.required],
      peso: [this.historiaRecibida.triajes[data-1].peso ? this.historiaRecibida.triajes[data-1].peso: '', Validators.required],
      temperatura: [this.historiaRecibida.triajes[data-1].temperatura ? this.historiaRecibida.triajes[data-1].temperatura: '', Validators.required],
      frecuenciaR: [this.historiaRecibida.triajes[data-1].frecuenciaR ? this.historiaRecibida.triajes[data-1].frecuenciaR: '', Validators.required],
      frecuenciaC: [this.historiaRecibida.triajes[data-1].frecuenciaC ? this.historiaRecibida.triajes[data-1].frecuenciaC: '', Validators.required],
      presionArt:[this.historiaRecibida.triajes[data-1].presionArt ? this.historiaRecibida.triajes[data-1].presionArt: '', Validators.required],
      motivo: [this.historiaRecibida.consultas[data-1].motivoConsulta ? this.historiaRecibida.consultas[data-1].motivoConsulta: '', Validators.required],
      apetito: [this.historiaRecibida.consultas[data-1].apetito ? this.historiaRecibida.consultas[data-1].apetito: '', Validators.required],
      orina: [this.historiaRecibida.consultas[data-1].orina ? this.historiaRecibida.consultas[data-1].orina: '', Validators.required],
      deposiciones: [this.historiaRecibida.consultas[data-1].deposiciones ? this.historiaRecibida.consultas[data-1].deposiciones: '', Validators.required],
      exaFis: [this.historiaRecibida.consultas[data-1].examenFisico ? this.historiaRecibida.consultas[data-1].examenFisico: '', Validators.required],
      diagnostico: [this.historiaRecibida.consultas[data-1].diagnostico ? this.historiaRecibida.consultas[data-1].diagnostico: '', Validators.required],
      tratamiento: [this.historiaRecibida.consultas[data-1].tratamiento ? this.historiaRecibida.consultas[data-1].tratamiento: '', Validators.required],
    });

  }
  //fin de Modal Ver Consulta

  cargarPaciente() {
    this.httpSv.searcHistoriaCompleta(this.datoBus).subscribe(data => {
      this.historiaRecibida = data;
      this.consultas = this.historiaRecibida.consultas;
      this.triajes = this.historiaRecibida.triajes;
      this.nombreRecibido = this.historiaRecibida.nombres+" "+this.historiaRecibida.apellido_paterno+" "+this.historiaRecibida.apellido_materno;
      this.dniRecibido = this.historiaRecibida.dni;
      this.numHistRecibido = this.historiaRecibida.numeroHistoria;
      this.edadRecibido = this.historiaRecibida.edad;
      this.sexoRecibido = this.historiaRecibida.sexo;
      console.log(this.historiaRecibida.nombres);
            
    });;
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }


}
