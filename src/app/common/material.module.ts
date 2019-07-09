import { NgModule } from '@angular/core';
import {
  MatTableModule, MatButtonModule, MatToolbarModule, MatIconModule, MatCardModule,
  MatGridListModule, MatSortModule, MatPaginatorModule, MatListModule, MatTabsModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    MatTableModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatGridListModule,
    MatSortModule,
    MatPaginatorModule,
    MatListModule,
    MatTabsModule

],
  exports: [
    BrowserAnimationsModule,
    MatTableModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatGridListModule,
    MatSortModule,
    MatPaginatorModule,
    MatListModule,
    MatTabsModule
  ]
})

export class MaterialModule {}
