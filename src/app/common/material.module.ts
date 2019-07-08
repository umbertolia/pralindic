// material.module.ts

import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import {MatButtonModule, MatCardModule, MatIconModule, MatPaginatorModule, MatSortModule, MatToolbarModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatGridListModule} from '@angular/material';

@NgModule({
  imports: [
    MatTableModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatGridListModule,
    MatSortModule,
    MatPaginatorModule
  ],
  exports: [
    MatTableModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatGridListModule,
    MatSortModule,
    MatPaginatorModule
  ]
})

export class MaterialModule {}
