import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DragDropModule} from "@angular/cdk/drag-drop";
import {FilterPipe} from "./pipe/filter.pipe";
import {GoogleMap, MapMarker} from "@angular/google-maps";
import {NbButtonModule, NbCardModule, NbInputModule} from "@nebular/theme";
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [FilterPipe],
  exports: [
    FilterPipe
  ],
  imports: [
    CommonModule,
    DragDropModule,
    GoogleMap,
    MapMarker,
    NbButtonModule,
    NbCardModule,
    NbInputModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
