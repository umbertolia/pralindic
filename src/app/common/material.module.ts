import { NgModule } from '@angular/core';
import {
  MatTableModule, MatButtonModule, MatToolbarModule, MatIconModule, MatCardModule,
  MatGridListModule, MatSortModule, MatPaginatorModule, MatListModule, MatTabsModule, MatExpansionModule
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
    MatTabsModule,
    MatExpansionModule
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
    MatTabsModule,
    MatExpansionModule
  ]
})

export class MaterialModule {}
