import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from '../models/category.interface';
import { Transaction } from '../models/transaction.interface';
import { LocalStorageService } from './local-storage.service';
import { StorageKeys } from '../enums/storage-keys.enum';

interface AppState {
  categories: Category[];
  transactions: Transaction[];
};

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private state: AppState = {
    categories: [
      {
        name: 'Groceries',
        id: '1',
      },
      {
        name: 'Salary',
        id: '2',
      },
      {
        name: 'Entertainment',
        id: '3',
      },
      {
        name: 'Investments',
        id: '4',
      }
    ],
    transactions: [],
  };

  private stateSubject!: BehaviorSubject<AppState>;
  private transactionsSubject!: BehaviorSubject<Transaction[]>;

  constructor(
    private localStorageService: LocalStorageService
  ) {
    this.initData();
    this.transactionsSubject.subscribe(transactions => {
      this.localStorageService.setItem<Transaction[]>(StorageKeys.TRANSACTIONS, transactions);
    });
  }

  private initData() {
    const data = this.localStorageService.getItem<Transaction[]>(StorageKeys.TRANSACTIONS);
    if (data) {
      this.transactionsSubject = new BehaviorSubject<Transaction[]>(data);
      this.state.transactions = data;
    } else {
      this.transactionsSubject = new BehaviorSubject<Transaction[]>([]);
    }
    this.stateSubject = new BehaviorSubject<AppState>(this.state);
  }

  getState<K extends keyof AppState>(key: K): Observable<AppState[K]> {
    return new Observable((observer) => {
      observer.next(this.state[key]);
      observer.complete();
    });
  }

  getTransactions(): Observable<Transaction[]> {
    return this.transactionsSubject.asObservable();
  }

  setState<K extends keyof AppState>(key: K, value: AppState[K]): void {
    this.state[key] = value;

    if (key === 'transactions') {
      this.transactionsSubject.next(value as Transaction[]);
    }

    this.stateSubject.next(this.state);
  }

  addTransaction(transaction: Transaction): void {
    this.state.transactions.push(transaction);
    this.transactionsSubject.next(this.state.transactions);
    this.stateSubject.next(this.state);
  }

  removeTransaction(transactionId: string): void {
    this.state.transactions = this.state.transactions.filter(
      (transaction) => transaction.id !== transactionId
    );
    this.transactionsSubject.next(this.state.transactions);
    this.stateSubject.next(this.state);
  }

  updateTransaction(updatedTransaction: Transaction): void {
    const index = this.state.transactions.findIndex(
      (transaction) => transaction.id === updatedTransaction.id
    );
    if (index !== -1) {
      this.state.transactions[index] = { ...this.state.transactions[index], ...updatedTransaction };
      this.transactionsSubject.next(this.state.transactions);
      this.stateSubject.next(this.state);
    }
  }
}
