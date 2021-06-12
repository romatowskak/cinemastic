import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AngularMaterialModule } from '../pages/angular-material/angular-material.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { BarRatingModule } from 'ngx-bar-rating';
import { NgxGalleryModule } from 'ngx-gallery';
import 'hammerjs';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    TranslateModule,
    NgxPaginationModule,
    BarRatingModule,
    NgxGalleryModule,
  ],
  exports: [
    ReactiveFormsModule,
    AngularMaterialModule,
    TranslateModule,
    CommonModule,
    NgxPaginationModule,
    BarRatingModule,
    NgxGalleryModule,
  ],
})
export class SharedModule {}
