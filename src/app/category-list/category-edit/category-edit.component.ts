import {Component, OnInit} from '@angular/core';
import {Category} from '../../models/category.model';
import {ActivatedRoute, Router} from '@angular/router';
import {CategoryService} from '../../services/category.service';
import {CommonService} from '../../services/common.service';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.scss']
})
export class CategoryEditComponent implements OnInit {

  category: Category;
  fileUrl: string;
  fileToUpload: File = null;
  oldFileUrl: string;



  constructor(private route: ActivatedRoute,
              private router: Router,
              private categoryService: CategoryService, private commonService: CommonService) {

  }

  ngOnInit() {
    this.category = new Category('');
    const idCat = this.route.snapshot.params['id'];
    this.categoryService.fetchSingleCategory(+idCat).then(
      (categ: Category) => {
        console.log('Categorie Edition avec : ' + categ);
        this.category = categ;
        if (this.category.photo) {
          console.log('lien de la photo : ' + this.category.photo);
          this.fileUrl = this.category.photo;
        }
      },
      (error) => {
        console.log('Impossible de récupérer la catégorie avec l\' id' + idCat);
      }
    );
  }

  onPrevious() {
    this.router.navigate(['/categories']);
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
    }
    this.fileToUpload =  event.target.files[0];
  }

  async valider() {
    if (this.fileToUpload) {
      await this.uploadFile(this.fileToUpload);
    }
    if (this.fileUrl && this.fileUrl.length > 0) {
      this.oldFileUrl = this.category.photo;
      this.category.photo = this.fileUrl;
    }
    const idCat = this.route.snapshot.params['id'];
    this.categoryService.updateCategorie(this.category, idCat, this.fileToUpload, this.oldFileUrl);
    this.router.navigate(['/categories']);
  }

  async uploadFile(file: File) {
    await this.commonService.uploadFile(file).then(
      (url: string) => {
        this.fileUrl = url;
      });
  }



}
