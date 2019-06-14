import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Category} from '../../models/category.model';
import {FoodService} from '../../services/food.service';
import {Subscription} from 'rxjs';
import {chechCategoryName} from '../../validators/categorie.validator';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {

  categorieForm: FormGroup;
  errorMessage: string;
  fileIsUploading: boolean;
  fileUrl: string;
  fileUploaded: boolean;
  categoriesSubscription: Subscription;
  categories: Category[];
  fileToUpload: File = null;

  constructor(private categorieBuilder: FormBuilder,
              private foodService: FoodService,
              private router: Router) { }

  ngOnInit() {
    this.getCategoriesList();
    this.initForm();
  }

  private initForm() {
    this.categorieForm = this.categorieBuilder.group(
      {
        name: ['', [Validators.required, Validators.pattern(/[a-zA-Z]/), chechCategoryName(this.categories)]]
      });
  }

  async onSubmit() {
    if (this.fileToUpload) {
      await this.uploadFile(this.fileToUpload);
      console.log('photo url dans onSubmit : ' + this.fileUrl);
    }

    const name = this.categorieForm.get('name').value;
    const newCategorie = new Category(name);
    if (this.fileUrl && this.fileUrl.length > 0) {
      newCategorie.photo = this.fileUrl;
    }
    this.foodService.createNewCategory(newCategorie);
    this.router.navigate(['/categories']);
  }

  async uploadFile(file: File) {
    this.fileIsUploading = true;
    await this.foodService.uploadFile(file).then(
      (url: string) => {
        this.fileUrl = url;
        console.log('photo url dans  uploadFile : ' + this.fileUrl);
        this.fileIsUploading = false;
        this.fileUploaded = true;
      }
    );
  }

  onSelectFiles(event) {
    if (event.target.files[0]) {
      this.fileToUpload = event.target.files[0];
      // image preview
      const reader = new FileReader();
      reader.onload = (evenemnt: any) => {
        this.fileUrl = evenemnt.target.result;
      };
      reader.readAsDataURL(this.fileToUpload);
      this.fileIsUploading = false;
    }
    this.fileToUpload =  event.target.files[0];
  }

  private getCategoriesList() {
    console.log('getCategoriesList()');
      console.log('liste categories avant observ : ' + this.categories);
    this.categoriesSubscription = this.foodService.categoriesSubject.subscribe(
      (catListe: Category[]) => {
        this.categories = catListe;
      }
    );
    this.foodService.fetchCategories();
    console.log('liste categories apres emit : ' + this.categories);
  }
}
