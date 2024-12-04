import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction, TransactionType } from '../../core/models/transaction.interface';
import { StateService } from '../../core/services/state.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-balance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './balance.component.html',
  styleUrl: './balance.component.scss'
})
export class BalanceComponent {
  transactions!: Transaction[];
  summ = 0;

  constructor(
    private stateService: StateService
  ) {
    this.stateService.getTransactions().pipe(takeUntilDestroyed()).subscribe((transactions: Transaction[]) => {
      this.transactions = transactions;
      this.summing();
    });
  }

  summing() {
    this.summ = this.transactions?.reduce((sum, transaction) => {
      const amount = transaction.transactionType === TransactionType.EXPENSE ? transaction.amount * -1 : transaction.amount;
      return sum + amount;
    }, 0) ?? 0;
  }
}
