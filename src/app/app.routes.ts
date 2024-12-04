import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'transactions',
        loadComponent: () =>
            import('./pages/transactions-page/transactions-page.component').then(
                (m) => m.TransactionsPageComponent
            ),
    },
    { path: '', pathMatch: 'full', redirectTo: 'transactions' },
];

