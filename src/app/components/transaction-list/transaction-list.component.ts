import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { TransactionFormComponent } from '../transaction-form/transaction-form.component';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { Category } from '../../core/models/category.interface';
import { TransactionType, Transaction } from '../../core/models/transaction.interface';
import { StateService } from '../../core/services/state.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, DatePipe, MatButtonModule, MatIconModule, MatSelectModule],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionListComponent implements AfterViewInit {
  transactionType = TransactionType;
  transactionTypes: string[] = Object.values(TransactionType);
  categories$!: Observable<Category[]>;
  private transactions: Transaction[] = [];

  displayedColumns: string[] = ['name', 'amount', 'category', 'transactionDate', 'actions'];
  dataSource!: MatTableDataSource<Transaction>;

  filterValues = {
    transactionType: '',
    category: ''
  };

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private stateService: StateService,
    private dialog: MatDialog,
  ) {
    this.dataSource = new MatTableDataSource(this.transactions);
    this.stateService.getTransactions().pipe(takeUntilDestroyed()).subscribe((transactions: Transaction[]) => {
      this.transactions = transactions;
      this.dataSource.data = this.transactions;
    });
  }

  ngAfterViewInit() {
    this.categories$ = this.stateService.getState('categories');
    this.filterPredicate();
    this.dataSource.sort = this.sort;
  }

  private filterPredicate(): void {
    this.dataSource.filterPredicate = (data: Transaction, filter: string): boolean => {
      const filterValues = JSON.parse(filter);
      const nameMatch = data.transactionType.toLowerCase().includes(filterValues.transactionType.toLowerCase());
      const categoryMatch = data.category.name?.toLowerCase().includes(filterValues.category.toLowerCase());
      return nameMatch && categoryMatch;
    };
  }

  applyFilter() {
    this.filterPredicate();
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }

  clearFilters(): void {
    this.filterValues = {
      transactionType: '',
      category: ''
    };
    this.applyFilter();
  }

  onEdit(transaction: Transaction): void {
    const dialogRef = this.dialog.open(TransactionFormComponent, {
      data: {
        title: 'Edit transaction',
        transaction
      },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe((result: Transaction) => {
      if (result) {
        this.stateService.updateTransaction(result);
      }
    });
  }

  onDelete(transaction: Transaction): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: transaction.name,
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.stateService.removeTransaction(transaction.id);
      }
    });
  }
}
