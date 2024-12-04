
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaskDirective } from 'ngx-mask';
import { Transaction, TransactionType } from '../../core/models/transaction.interface';
import { Category } from '../../core/models/category.interface';
import { StateService } from '../../core/services/state.service';
import { generateUUID } from '../../core/utils/uuid';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface TransactionDialogData {
  title: string;
  transaction?: Transaction;
}


@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogModule,
    MatNativeDateModule,
    MatDatepickerModule,
    NgxMaskDirective,
  ],
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionFormComponent implements OnInit {
  form!: FormGroup;
  categories!: Category[];
  transactionTypes: string[] = Object.values(TransactionType);

  constructor(
    private dialogRef: MatDialogRef<TransactionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TransactionDialogData,
    private fb: FormBuilder,
    private stateService: StateService
  ) {
    this.stateService.getState('categories').pipe(takeUntilDestroyed()).subscribe((categories: Category[]) => this.categories = categories)
  }

  ngOnInit(): void {
    this.formInit();
  }

  private formInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      transactionType: ['', [Validators.required]],
      categoryId: [''],
      transactionDate: [new Date()],
      id: [generateUUID()],
    });
    if (this.data.transaction) {
      this.form.patchValue(this.data.transaction);
      this.form.get('categoryId')?.patchValue(this.data.transaction.category.id)
    }
  }

  onCloseDialog(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.form.markAllAsTouched();
    const { valid, value } = this.form;
    if (!valid) {
      return;
    }

    if (value.transactionDate instanceof Date) {
      value.transactionDate = value.transactionDate.toISOString();
    }
    value.category = this.categories.find((cat) => cat.id === value.categoryId);

    this.dialogRef.close(value);
  }
}
