import { Component, ElementRef, OnDestroy, OnInit, ViewChild, OnChanges } from '@angular/core';
import { BasePageComponent } from '../../base-page';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../interfaces/app-state';
import { HttpService } from '../../../services/http/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TCModalService } from '../../../ui/services/modal/modal.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { LaboratorioService } from '../../../Services/Laboratorio/laboratorio.service';
import {Orden } from '../../../interfaces/orden';
import { Content } from '../../../ui/interfaces/modal';
import { Cabeceralab } from '../../../interfaces/cabeceralab';
import {OrdenLista} from '../../../interfaces/orden-lista';
import { formatDate } from '@angular/common';
import {Examen} from '../../../interfaces/examen';
import { Detalle } from '../../../interfaces/detalle'; 
import { from } from 'rxjs';

@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.component.html',
  styleUrls: ['./ordenes.component.scss']
})
export class OrdenesComponent extends BasePageComponent implements OnInit, OnDestroy, OnChanges {

  ordenes:Orden[];
  patientForm: FormGroup;
  cabecera: Cabeceralab[];
  today:Date;
  ordenLista:OrdenLista;
  data:OrdenLista = <OrdenLista>{};
  pageNum: number;
  rr: number;
  detalleForm: FormGroup;

  constructor(
		store: Store<IAppState>,
		httpSv: HttpService,
		private labService: LaboratorioService,
		private modal: TCModalService,
		private formBuilder: FormBuilder,
		private http: HttpClient,
		private toastr: ToastrService,
	) {
    super(store, httpSv);
    this.ordenes=[];
		this.pageData = {
			title: 'Ordenes',
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
					title: 'ordenes'
				}
				,
				{
					title: 'Search'
				}
			]
    };
	this.pageNum = 1;
	this.ordenes=[];
    this.loadOrdenes();
	}
  ngOnInit() {
    super.ngOnInit();
  }
  ngOnChanges($event) {
		console.log();
  }

  public nextPage() {
	if (this.data.next) {
		this.pageNum++;
		this.labService.loadOrdenPAgination(this.data.next).subscribe(ord => {
			this.data = ord;
			this.ordenes = ord.results;
		});
	}
}

  public prevPage() {
	if (this.pageNum > 1) {
		this.pageNum--;
		this.labService.loadOrdenPAgination(this.data.previous).subscribe(ord => {
			this.data = ord;
			this.ordenes = ord.results;
		});
	}
}


  loadOrdenes() {
		this.labService.loadOrden().subscribe(ord => {
			this.data=ord;
			this.ordenes=ord.results;
		});
  }
  
  openModalH<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, row: Orden) {
		this.initPatientForm(row);
		this.modal.open({
			body: body,
			header: header,
      footer: footer,
      options: null
		});
  }
  closeModalH() {
		this.modal.close();
	}
	initPatientForm(data:Orden) {
		this.patientForm = this.formBuilder.group({
			nombre: [data.nombre?data.nombre: '', Validators.required],
     		dni: [ data.dni?data.dni:'', Validators.required],
			orden: [data.orden?data.orden:'', ],
			observaciones: ['', Validators.required],
			tipoExam: [data.tipoExam?data.tipoExam:'', Validators.required],
			fecha:['',Validators.required], 
		});
		console.log("fecha de orden"+data.tipoExam);
  }

  addExamen(form: FormGroup) {
	
	if (form.valid) {
			this.today = new Date();
      let newCabecera: Cabeceralab = form.value;
      newCabecera.nombre= form.value.nombre;
      newCabecera.dni=form.value.dni;
	  newCabecera.fecha= formatDate(this.today, 'yyyy-MM-dd', 'en-US','+0530');
	  console.log(newCabecera.fecha);
	  newCabecera.tipoExam=form.value.tipoExam;
	  console.log("tipo examencabecera"+ newCabecera.tipoExam)
      newCabecera.orden=form.value.orden;
      newCabecera.observaciones=form.value.observaciones;
			this.labService.createCabecera(newCabecera);
			this.closeModalH();
		}
	}

	openModaD<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, row: Examen, options: any = null) {
		this.initDetalleForm();
		this.rr = row.id;
		console.log(this.rr);
		this.modal.open({
			body: body,
			header: header,
			footer: footer,
			options: options

		});
	}
	closeModalD() {
		this.modal.close();
	}
	//Valida los campos del formulario de crear detalle
	initDetalleForm() {
		this.detalleForm = this.formBuilder.group({
			descripcion: ['', Validators.required],
			resultado_obtenido: ['', Validators.required],
			unidades: ['', Validators.required],
			rango_referencia: ['', Validators.required],
		});

	}

	addDetalle(form: FormGroup) {
		if (form.valid) {
			let newDetalle: Detalle = form.value;
			newDetalle.descripcion = form.value.descripcion;
			newDetalle.rango_referencia = form.value.rango_referencia;
			newDetalle.resultado_obtenido = form.value.resultado_obtenido;
			newDetalle.unidades = form.value.unidades;
			newDetalle.codigoExam = this.rr;
			this.labService.createDetalle(newDetalle);
			this.detalleForm.reset();
		}
	}

	estado(row: Orden) {

		this.labService.cambioEstado(row.id);
		this.toastr.success("Se ha cambiado de estado");
	}

}


