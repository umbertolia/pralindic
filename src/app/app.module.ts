import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { FoodListComponent } from './food-list/food-list.component';
import { HeaderComponent } from './header/header.component';
import {AuthentificationService} from './services/authentification.service';
import {AuthGuardService} from './services/auth-guard.service';
import {FoodService} from './services/food.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule, Routes} from '@angular/router';
import { CategoryFormComponent } from './category-list/category-form/category-form.component';
import { CategoryEditComponent } from './category-list/category-edit/category-edit.component';
import { FoodFormComponent } from './food-list/food-form/food-form.component';
import {FoodEditComponent} from './food-list/food-edit/food-edit.component';
import { FoodManagerComponent } from './food-manager/food-manager.component';

const appRoutes: Routes = [
  { path: 'auth/signup', component: SignupComponent },
  { path: 'auth/signin', component: SigninComponent },
  { path: 'categories', canActivate: [AuthGuardService], component: CategoryListComponent},
  { path: 'categories/new', canActivate: [AuthGuardService], component: CategoryFormComponent},
  { path: 'categories/edit/:id', canActivate: [AuthGuardService], component: CategoryEditComponent},
  { path: 'foods', canActivate: [AuthGuardService], component: FoodListComponent},
  { path: 'foods/new', canActivate: [AuthGuardService], component: FoodFormComponent},
  { path: 'foods/edit/:id', canActivate: [AuthGuardService], component: FoodEditComponent},
  { path: 'manager', canActivate: [AuthGuardService], component: FoodManagerComponent},
  { path: '', redirectTo: 'manager', pathMatch: 'full'},
  { path: '**', redirectTo: 'manager'}
  ];

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    SigninComponent,
    CategoryListComponent,
    FoodListComponent,
    HeaderComponent,
    CategoryFormComponent,
    CategoryEditComponent,
    FoodEditComponent,
    FoodFormComponent,
    FoodManagerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [AuthentificationService, AuthGuardService, FoodService],
  bootstrap: [AppComponent]
})
export class AppModule { }
