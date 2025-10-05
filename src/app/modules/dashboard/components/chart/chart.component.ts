import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartStore } from './chart.store';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ChartStore],
})
export class ChartComponent {
  readonly store = inject(ChartStore);

  constructor() {
    this.store.loadExpenses();
  }
}
