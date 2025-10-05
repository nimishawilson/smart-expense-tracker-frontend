
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BAR_CHART_COLOR_PALETTE } from '../../constants/colors.constant';

export interface BarChartData {
  name: string;
  value: number;
}

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarChartComponent {
  data = input.required<BarChartData[]>();

  private assignedCategoryColors = new Map<string, string>();
  private colorIndex = 0;

  maxValue = computed(() => {
    const data = this.data();
    if (!data || data.length === 0) {
      return 0;
    }
    return Math.max(...data.map(item => item.value));
  });

  yAxisLabels = computed(() => {
    const max = this.maxValue();
    const labels: number[] = [];
    const numLabels = 5; // Number of labels to display
    const step = max / (numLabels - 1);

    for (let i = 0; i < numLabels; i++) {
      labels.push(Math.round(i * step));
    }
    return labels.reverse(); // Display from max to 0
  });

  getBarHeight(value: number): string {
    const max = this.maxValue();
    if (max === 0) {
      return '0%';
    }
    const height = (value / max) * 100;
    return `${height}%`;
  }

  getBarColor(category: string): string {
    if (!this.assignedCategoryColors.has(category)) {
      const color = BAR_CHART_COLOR_PALETTE[this.colorIndex % BAR_CHART_COLOR_PALETTE.length];
      this.assignedCategoryColors.set(category, color);
      this.colorIndex++;
    }
    return this.assignedCategoryColors.get(category)!;
  }
}
