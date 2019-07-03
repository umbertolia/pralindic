import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Category} from '../../models/category.model';
import {CategoryService} from '../../services/category.service';
import {Subscription} from 'rxjs';
import {chechCategoryName} from '../../validators/pralindic.validator';
import {CommonService} from '../../services/common.service';
import {AppConstants} from '../../common/constantes';

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
  categories = new Map<string, Category>();
  fileToUpload: File = null;

  constructor(private categorieBuilder: FormBuilder,
              private categoryService: CategoryService,
              private router: Router, private commonService: CommonService) { }

  ngOnInit() {
    this.getCategoriesList();
    this.initForm();
  }

  private initForm() {
    this.categorieForm = this.categorieBuilder.group(
      {
        name: ['', [Validators.required, Validators.pattern(/[a-zA-Z]/), chechCategoryName(this.categories)]]
      });
    this.fileUrl = AppConstants.getIconAddPhoto();
  }

  async onSubmit() {
    const newCategorie = new Category(this.categorieForm.get('name').value);
    if (this.fileToUpload) {
      await this.uploadFile(this.fileToUpload, newCategorie.constructor.name.concat('_').concat(newCategorie.catName));
      console.log('photo url dans onSubmit : ' + this.fileUrl);
    }

    if (this.fileUrl && this.fileUrl.length > 0 && this.fileToUpload) {
      newCategorie.photo = this.fileUrl;
    }
    this.categoryService.createNewCategory(newCategorie);
    this.router.navigate(['/categories']);
  }

  async uploadFile(file: File, additionalString: string) {
    this.fileIsUploading = true;
    await this.commonService.uploadFile(file, additionalString).then(
      (url: string) => {
        this.fileUrl = url;
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
    this.categoriesSubscription = this.categoryService.categoriesSubject.subscribe(
      (categoryList: Map<string, Category>) => {
        this.categories = categoryList;
      }
    );
    this.categoryService.fetchCategories();
  }
}
