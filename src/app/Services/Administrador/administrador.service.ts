import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ToastrService } from "ngx-toastr";

//interfaces
import { Area } from "../../interfaces/area";
import { Especialidad } from "../../interfaces/especialidad";
import { Tipopersonal } from "../../interfaces/tipopersonal";
import { PersonalCreate } from "../../interfaces/personalCreate";
import { Personal } from "../../interfaces/personal";
import { IOption } from "../../ui/interfaces/option";
import { User } from '../../interfaces/user';
import { personalLista } from '../../interfaces/personalLista';
@Injectable({
  providedIn: "root"
})
export class AdministradorService {
  private url: string = "http://18.216.2.122:9000/administrador";
  medOption: IOption[];
  constructor(private http: HttpClient, private toastr: ToastrService) {}
  //Areas
  loadAreas(): Observable<Area[]> {
    return this.http.get<Area[]>(this.url + "/areas/");
  }
  searchArea(id: number): Observable<any> {
    return this.http.get<any>(this.url + "/areas/" + id + "/");
  }
  createArea(area: Area) {
    this.http
      .post<any>(this.url + "/areas/", {
        nombre: area.nombre
      })
      .subscribe(
        data => {
          this.toastr.success("Area Creada correctamente");
        },
        error => {
          console.log(error.message);
          this.toastr.error("No se pudo crear la Area");
        }
      );
  }

  //Especialidades
  loadEspecialidades(): Observable<Especialidad[]> {
    return this.http.get<Especialidad[]>(this.url + "/especialidad/");
  }
  searchEspecialidad(id: number): Observable<any> {
    return this.http.get<any>(this.url + "/especialidad/" + id + "/");
  }
  createEspecialidad(especialidad: Especialidad) {
    this.http
      .post<any>(this.url + "/especialidad/", {
        nombre: especialidad.nombre,
        descripcion: especialidad.descripcion
      })
      .subscribe(
        data => {
          this.toastr.success("Especialidad Creada correctamente");
        },
        error => {
          console.log(error.message);
          this.toastr.error("No se pudo crear la Especialidad");
        }
      );
  }
  //TipoPersonal
  loadTPersonal(): Observable<Tipopersonal[]> {
    return this.http.get<Tipopersonal[]>(this.url + "/tipo-personal/");
  }
  searchTPersonal(id: number): Observable<any> {
    return this.http.get<any>(this.url + "/tipo-personal/" + id + "/");
  }
  createTPersonal(tipo: Tipopersonal) {
    this.http
      .post<any>(this.url + "/tipo-personal/", {
        nombre: tipo.nombre
      })
      .subscribe(
        data => {
          this.toastr.success("Tipo personal Creado correctamente");
        },
        error => {
          console.log(error.message);
          this.toastr.error("No se pudo crear el tipo personal");
        }
      );
  }
  // Personal
  loadPersonal(): Observable<personalLista> {
    return this.http.get<personalLista>(this.url + "/ver-personales/");
  }
  loadPersonalPagination(url:string): Observable<personalLista> {
    return this.http.get<personalLista>(url);
  }
  searchPersonal(id: number): Observable<any> {
    return this.http.get<any>(this.url + "/ver-personales/" + id + "/");
  }
  createPersonal(tipo: PersonalCreate) {
    console.log(JSON.stringify(tipo));
    this.http
      .post<any>(this.url + "/crear-personal/", {
        user: tipo.user,
        dni: tipo.dni,
        nombres: tipo.nombres,
        apellido_paterno: tipo.apellido_paterno,
        apellido_materno: tipo.apellido_materno,
        celular: tipo.celular,
        telefono: tipo.telefono,
        direccion: tipo.direccion,
        area: tipo.area,
        tipo_personal: tipo.tipo_personal,
        especialidad: tipo.especialidad
      })
      .subscribe(
        data => {
          this.toastr.success("personal Creado correctamente");
        },
        error => {
          console.log(error.message);
          this.toastr.error("No se pudo crear personal");
        }
      );
  }
  //user
  loadUser(): Observable<User[]> {
    return this.http.get<User[]>(this.url + "/usuarios/");
  }
}
