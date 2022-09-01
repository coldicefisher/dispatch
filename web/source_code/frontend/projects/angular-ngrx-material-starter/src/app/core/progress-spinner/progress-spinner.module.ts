import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProgressSpinnerComponent } from './progress-spinner.component';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';

export { ProgressSpinnerComponent } from './progress-spinner.component';
export { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
export { ProgressSpinnerMode } from '@angular/material/progress-spinner';

@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ],
  exports: [
      MatProgressSpinnerModule,
      ProgressSpinnerComponent
  ],
  declarations: [
      ProgressSpinnerComponent
  ],
  // entryComponents: [ProgressSpinnerComponent],
  

})
export class ProgressSpinnerModule { }