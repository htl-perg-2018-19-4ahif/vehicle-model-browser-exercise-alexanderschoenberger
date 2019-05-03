import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.css']
})

export class ModelsComponent implements OnInit {

  years: number[];
  makes: string[];
  page = 1;
  data: Vehicle[] = [];
  selectedMake: string;
  selectedYear: number;
  filter: boolean;
  lastPage: boolean;
  displayedColumns: string[] = ['year', 'make', 'model'];
  url = 'https://vehicle-data.azurewebsites.net/api/';
  offset = '';
  constructor(private http: HttpClient) { }


  async ngOnInit() {
    this.years = await this.http.get<number[]>(`${this.url}years`).toPromise();
    this.years.unshift(undefined);
    this.makes = await this.http.get<string[]>(`${this.url}makes`).toPromise();
    this.makes.unshift(undefined);
  }

  async refresh() {
    console.log(this.selectedMake, this.selectedYear);
    if (this.filter) {
      if (this.selectedMake !== undefined) {
        this.data = await this.http.get<Vehicle[]>
          (`${this.url}models?make=${this.selectedMake}${this.offset}`).toPromise();
      } else if (this.selectedYear !== undefined) {
        this.data = await this.http.get<Vehicle[]>
          (`${this.url}models?year=${this.selectedYear}${this.offset}`).toPromise();
      } else if (this.selectedMake !== undefined && this.selectedYear !== undefined) {
        this.data = await this.http.get<Vehicle[]>
          (`${this.url}models?make=${this.selectedMake}&year=${this.selectedYear}${this.offset}`)
          .toPromise();
      }
    } else {
      this.data = await this.http.get<Vehicle[]>(`${this.url}models?offset=${this.page * 10}`).toPromise();
    }
    console.log(this.data);
  }

  next() {
    this.page++;
    this.refresh();
    this.offset = `&offset=${this.page * 10}`;

  }
  previous() {
    this.page--;
    this.refresh();
  }
}
interface Vehicle {
  year: number;
  make: string;
  model: string;
}