import { Component, OnInit, OnChanges, ViewChild, ElementRef, ɵConsole } from '@angular/core';
import { BasePageComponent } from '../../base-page';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../interfaces/app-state';
import { HttpService } from '../../../services/http/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { Content } from '../../../ui/interfaces/modal';
import { TCModalService } from '../../../ui/services/modal/modal.service';
import { HttpClient } from '@angular/common/http';
import { ConsultaCompleta } from '../../../interfaces/consulta-c';
import { Triaje } from '../../../interfaces/triaje';
import { Consulta } from '../../../interfaces/consulta';
import { Router } from '@angular/router';
import { Examen } from '../../../interfaces/examen';

@Component({
  selector: 'app-consultas',
  templateUrl: './listar-consultas.component.html',
  styleUrls: ['./listar-consultas.component.scss'],
})
export class ListarConsultasComponent extends BasePageComponent implements OnInit, OnChanges{
  @ViewChild('modalBody', { static: true }) modalBody: ElementRef<any>;
  @ViewChild('modalFooter', { static: true }) modalFooter: ElementRef<any>;
  consultForm: FormGroup;
  verMasCForm: FormGroup;
  verTriajeForm:FormGroup;
  consultasRecibidas: ConsultaCompleta[];
  examenesRecibidos:Examen[];
  triajeRecibido:Triaje;
  datoBus: string;
  private idRecibido:number;
  private nombreRecibido:string;
  private numHistRecibido: string;
  private dniRecibido:string;
  private edadRecibido:number;
  private sexoRecibido:string;
  private idCitaRecibida:number;
  private hayEx :boolean;
  constructor(
    private formBuilder: FormBuilder,
    store: Store<IAppState>,
    httpSv: HttpService,
    private modal: TCModalService,
    private http: HttpClient,   
    private router: Router,
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
    this.hayEx=true;
    this.consultasRecibidas = [];
    this.examenesRecibidos = [];
    this.datoBus=this.httpSv.getNroHC();
    this.idCitaRecibida=this.httpSv.getIdHC();
    this.httpSv.searcTriajeC(this.idCitaRecibida).subscribe(data =>{
      this.triajeRecibido=data;
    }); 
    this.cargarDatos();
    this.cargarConsultas();
  }
  ngOnInit() {
    super.ngOnInit();
  }
  ngOnChanges($event) {
		console.log();
  }
  ngOnDestroy() {
    super.ngOnDestroy();
  }

  /*** 
	 * autor: Milagros Motta R.
	 * cargarDatos: Carga lo datos del paciente haciendo una llamata al servicio
	***/
  cargarDatos(){
    this.httpSv.searcHistoriasNroR(this.datoBus).subscribe(data=>{
      this.idRecibido=data[0].id;
      this.dniRecibido=data[0].dni;
      this.nombreRecibido=data[0].nombres+" "+data[0].apellido_paterno+" "+data[0].apellido_materno;
      this.edadRecibido=data[0].edad;
      this.sexoRecibido=data[0].sexo;
      this.cargarExamenes(data[0].dni);
    });
  }

  /*** 
	 * autor: Milagros Motta R.
	 * cargarConsultas: Carga las consultas del paciente haciendo una llamata al servicio 
	***/
  cargarConsultas() {
    this.httpSv.searcHistoriaCompleta(this.datoBus).subscribe(data => {
      this.consultasRecibidas=data;
      for (let index = 0; index < this.consultasRecibidas.length; index++) {
        this.consultasRecibidas[index].proximaCita=this.consultasRecibidas[index].especialidad.nombre;
      }
    });
  }

  /*** 
	 * autor: Milagros Motta R.
	 * cargarExamenes: Carga los examenes del paciente haciendo una llamata al servicio 
	***/
  cargarExamenes(dni:string) {
    this.httpSv.searchExamenbDni(dni).subscribe(data => {
      this.examenesRecibidos=data;
      for (let index = 0; index < this.examenesRecibidos.length; index++) {
        this.examenesRecibidos[index].nombre=this.examenesRecibidos[index].tipoExam.nombre;
      }
    });
  }

  /*** 
	 * autor: Milagros Motta R.
	 * regresar: Retorna al componente consultas que muestra las citas Pendientes 
	***/
  regresar(){
    this.router.navigate(['/vertical/consultas']);
  }

  /*** 
	 * autor: Milagros Motta R.
	 * atenderCita: Cambia el estado de la cita de Triado -> Atendido 
	***/
  atenderCita(id: number) {
    this.httpSv.AtenderCita(id).subscribe(cita => {
      this.httpSv.loadCitasM();
    });
  }

  //Modal Crear Consulta
  /*** 
	 * autor: Milagros Motta R.
	 * openModalC: Abre el modal e inicializa sus formGroups 
	***/
  openModalC<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, options: any = null) {
    this.initverTriajeForm();
    this.initConsultForm();
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: options
    });
  }

  /*** 
	 * autor: Milagros Motta R.
	 * closeModalC: Cierra el modal  
	***/
  closeModalC() {
    this.modal.close();
    this.consultForm.reset();
  }

  /*** 
	 * autor: Milagros Motta R.
	 * initverTriajeForm: Inicializa el formGroup para visualizarlos elementos del triaje recibido 
	***/
  initverTriajeForm() {
    this.verTriajeForm = this.formBuilder.group({
      talla: [this.triajeRecibido.talla ? this.triajeRecibido.talla: '', Validators.required],
      peso: [this.triajeRecibido.peso ? this.triajeRecibido.peso: '', Validators.required],
      temperatura: [this.triajeRecibido.temperatura ? this.triajeRecibido.temperatura: '', Validators.required],
      frecuenciaR: [this.triajeRecibido.frecuenciaR ? this.triajeRecibido.frecuenciaR: '', Validators.required],
      frecuenciaC: [this.triajeRecibido.frecuenciaC ? this.triajeRecibido.frecuenciaC: '', Validators.required],
      presionArt:[this.triajeRecibido.presionArt ? this.triajeRecibido.presionArt: '', Validators.required]
    });

  }

  /*** 
	 * autor: Milagros Motta R.
	 * initConsultForm: Hace 
	***/
  initConsultForm() {
    this.consultForm = this.formBuilder.group({
      motivoConsulta: ['', Validators.required],
      apetito: ['', [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\s ]+')]],
      orina: ['', [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\s ]+')]],
      deposiciones: ['', [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\s ]+')]],
      examenFisico: ['', [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\s ]+')]],
      diagnostico: ['', [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\s ]+')]],
      tratamiento: ['', [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\s ]+')]],
      proximaCita:[null]
    });

  }

  /*** 
	 * autor: Milagros Motta R.
	 * addConsult: Agrega los valores del formularios y otros más al objeto newConsult que se envia al servicio de creación. 
	***/
  addConsult(form: FormGroup) {
    if (form.valid) {
      let newConsult: Consulta = form.value;
      newConsult.proximaCita = formatDate(form.value.proximaCita, 'yyyy-MM-dd', 'en-US', '+0530');
      newConsult.numeroHistoria=this.idRecibido;
      newConsult.triaje=this.idCitaRecibida;
      newConsult.medico=1;
      newConsult.especialidad=1;
      this.httpSv.crearConsulta(newConsult);
      this.atenderCita(this.idCitaRecibida);
      this.closeModalC();
      this.cargarConsultas();
      this.consultForm.reset();
    //this.router.navigate(['/vertical/consultas']);   
    }
  }
  //fin de Modal Crear Consulta

  //Modal Ver Consulta
  /*** 
	 * autor: Milagros Motta R.
	 * openModalVerC: Abre el modal e inicializa sus formGroups 
	***/
  openModalVerC<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, options: any) {
    this.initVerMasForm(options);
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: options
    });
  }

  /*** 
	 * autor: Milagros Motta R.
	 * closeModalVerC: Cierra el modal 
	***/
  closeModalVerC() {
    this.modal.close();
    this.verMasCForm.reset();

  }

  /*** 
	 * autor: Milagros Motta R.
	 * initVerMasForm: Hace 
	***/
  initVerMasForm(data: any) {
    this.verMasCForm = this.formBuilder.group({
      talla: [data.triaje.talla ? data.triaje.talla: '', Validators.required],
      peso: [data.triaje.peso ? data.triaje.peso: '', Validators.required],
      temperatura: [data.triaje.temperatura ? data.triaje.temperatura: '', Validators.required],
      frecuenciaR: [data.triaje.frecuenciaR ? data.triaje.frecuenciaR: '', Validators.required],
      frecuenciaC: [data.triaje.frecuenciaC ? data.triaje.frecuenciaC: '', Validators.required],
      presionArt:[data.triaje.presionArt ? data.triaje.presionArt: '', Validators.required],
      motivo: [data.motivoConsulta ? data.motivoConsulta: '', Validators.required],
      apetito: [data.apetito ? data.apetito: '', Validators.required],
      orina: [data.orina ? data.orina: '', Validators.required],
      deposiciones: [data.deposiciones ? data.deposiciones: '', Validators.required],
      exaFis: [data.examenFisico ? data.examenFisico: '', Validators.required],
      diagnostico: [data.diagnostico ? data.diagnostico: '', Validators.required],
      tratamiento: [data.tratamiento ? data.tratamiento: '', Validators.required],
    });

  }
  //fin de Modal Ver Consulta

  //Modal Examenes de Laboratorio
  /*** 
	 * autor: Milagros Motta R.
	 * openModalExamenes: Abre el modal e inicializa sus formGroups 
	***/
  openModalExamenes<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, options: any) {
    if(this.examenesRecibidos.length>0){
      this.hayEx=false;
    }
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: options
    });
  }

  /*** 
	 * autor: Milagros Motta R.
	 * closeModalExamenes: Cierra el modal 
	***/
  closeModalExamenes() {
    this.modal.close();
  }

  /*** 
   * autor: Milagros Motta R.
   * closeModalExamenes: Hace la llamada al servicio para imprimir el resultado del examen por ID 
  ***/
  imprimirEx(Ex:Examen){
    this.httpSv.imprimirResultados(Ex.id);
  }
  //fin de Modal Examenes de Laboratorio
}
