import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Category} from '../../models/category.model';
import {CategoryService} from '../../services/category.service';
import {Subscription} from 'rxjs';
import {chechCategoryName} from '../../validators/pralindic.validator';
import {CommonService} from '../../services/common.service';
import {AppConstants} from '../../common/constantes';
import * as deepEqual from 'deep-equal';

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
  createMode: boolean;
  currentCategory: Category;

  constructor(private categorieBuilder: FormBuilder,
              private categoryService: CategoryService,
              private route: ActivatedRoute,
              private router: Router, private commonService: CommonService) {
    this.currentCategory = new Category('');
    this.createMode = true;
  }

  ngOnInit() {
    this.getCategoriesList();
    this.getCategoryFromRoute();
    this.initForm();
  }

  private initForm() {
    this.categorieForm = this.categorieBuilder.group(
      {
        name: ['', [Validators.required, Validators.pattern(/[a-zA-Z]/), chechCategoryName(this.categories, this.createMode)]]
      });
    this.fileUrl = AppConstants.getIconAddPhoto();
  }

  async onSubmit() {
    let newPhotoUploaded: boolean;
    const newCategorie = new Category(this.categorieForm.get('name').value);
    newCategorie.foods = this.currentCategory.foods ? this.currentCategory.foods : [];
    newCategorie.photo = this.currentCategory.photo ? this.currentCategory.photo : '';
    if (this.fileToUpload) {
      await this.uploadFile(this.fileToUpload, newCategorie.constructor.name.concat('_').concat(newCategorie.catName));
      newPhotoUploaded = true;
    }
    if (this.fileUrl && this.fileUrl.length > 0 && this.fileToUpload) {
      newCategorie.photo = this.fileUrl;
    }
    if (this.createMode) {
      this.categoryService.createNewCategory(newCategorie);
    } else if (!deepEqual(newCategorie, this.currentCategory)) {
      this.categoryService.updateCategorie(newCategorie, this.currentCategory, newPhotoUploaded);
    }
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

  getCategoryFromRoute() {
    this.getOptionalParamsFromRoute().then((params: Map<string, string>) => {
      if (params != null && params.size > 0) {
        this.categoryService.fetchSingleCategory(params.get('categoryName')).then((categoryBase: Category) => {
            this.currentCategory = categoryBase != null ?  { ...categoryBase} :  new Category('');
            this.fileUrl = this.currentCategory.photo ? this.currentCategory.photo : AppConstants.getIconAddPhoto();
            try {
              this.createMode =  Boolean(JSON.parse(params.get('createMode')));
            } catch (error) {
              console.log('Erreur sur le JSON.parse()');
            }
          },
          reason => {
            console.log('Aucune categorie avec le nom : ' + params['categoryName']);
          });
      }
    });
  }

  getOptionalParamsFromRoute(): Promise<Map<string, Object>> {
    const params = new Map;
    return  new Promise(resolve => {
      this.route.queryParamMap.subscribe(queryParams => {
        if (queryParams.keys.length > 0) {
          params.set('createMode', queryParams.get('createMode'));
          params.set('categoryName', queryParams.get('categoryName'));
        }
        resolve(params);
      });
    });
  }

}
