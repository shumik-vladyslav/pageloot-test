import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { BalanceComponent } from '../../components/balance/balance.component';
import { TransactionFormComponent } from '../../components/transaction-form/transaction-form.component';
import { TransactionListComponent } from '../../components/transaction-list/transaction-list.component';
import { StateService } from '../../core/services/state.service';
import { Transaction } from '../../core/models/transaction.interface';

@Component({
  selector: 'app-transactions-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    TransactionListComponent,
    BalanceComponent
  ],
  templateUrl: './transactions-page.component.html',
  styleUrl: './transactions-page.component.scss'
})
export class TransactionsPageComponent {
  constructor(
    private dialog: MatDialog,
    private stateService: StateService
  ) { }

  public openTransactionDialog(): void {
    const dialogRef = this.dialog.open(TransactionFormComponent, {
      data: { title: 'Add transaction' },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe((result: Transaction) => {
      if (result) {
        this.stateService.addTransaction(result);
      }
    });
  }
}
