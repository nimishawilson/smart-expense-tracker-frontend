
import { computed } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { Expense } from '../../../../shared/interfaces/expense.model';
import { of, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// --- Mock Service ---
// In a real app, this would be in its own file (e.g., 'expense.service.ts')
// and injected into the store.
const MOCK_EXPENSES: Expense[] = [
  { id: '1', amount: 50, category: 'Food', date: new Date('2025-10-01') },
  { id: '2', amount: 200, category: 'Transport', date: new Date('2025-10-02') },
  { id: '3', amount: 75, category: 'Shopping', date: new Date('2025-10-03') },
  { id: '4', amount: 120, category: 'Food', date: new Date('2025-10-04') },
  { id: '5', amount: 30, category: 'Utilities', date: new Date('2025-10-05') },
  { id: '6', amount: 30, category: 'Misc', date: new Date('2025-10-05') },
];

const expenseService = {
  getExpenses: () => timer(1000).pipe(switchMap(() => of(MOCK_EXPENSES))),
};

// --- State ---
type ChartState = {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  chartType: 'bar' | 'pie' | 'line';
  dateRange: { start: Date | null; end: Date | null };
};

const initialState: ChartState = {
  expenses: [],
  loading: false,
  error: null,
  chartType: 'bar',
  dateRange: { start: null, end: null },
};

// --- Store ---
export const ChartStore = signalStore(
  withState(initialState),
  withComputed(({ expenses, loading }) => ({
    // Example computed signal: group expenses by category for the chart
    expensesByCategory: computed(() => {
      const categoryMap = expenses().reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      }, {} as { [key: string]: number });

      return Object.keys(categoryMap).map(category => ({
        name: category,
        value: categoryMap[category],
      }));
    }),
    // Make the loading signal available as 'isLoading'
    isLoading: loading,
  })),
  withMethods((store) => ({
    // Method to load expenses, simulating an async call
    loadExpenses: async () => {
      patchState(store, { loading: true, error: null });
      expenseService.getExpenses().subscribe({
        next: (expenses) => {
          patchState(store, { expenses, loading: false });
        },
        error: (err) => {
          patchState(store, { error: 'Failed to load expenses.', loading: false });
        },
      });
    },
    // Method to update the chart type
    updateChartType: (chartType: 'bar' | 'pie' | 'line') => {
      patchState(store, { chartType });
    },
    // Method to update the date range
    updateDateRange: (dateRange: { start: Date; end: Date }) => {
      patchState(store, { dateRange });
    },
  }))
);
