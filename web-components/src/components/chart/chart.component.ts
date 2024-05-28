import BaseElement from '../../internals/baseElement/baseElement';
import { html, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import styles from './chart.css?inline';
import type Highcharts from 'highcharts/es-modules/masters/highcharts.src';

export type ChartOptions =
  | Highcharts.SeriesOptionsRegistry['SeriesBarOptions']
  | Highcharts.SeriesOptionsRegistry['SeriesColumnOptions']
  | Highcharts.SeriesOptionsRegistry['SeriesPieOptions'];

const SERIES_PROPERTY: keyof Chart = 'series';

const DEFAULT_OPTIONS: Partial<Highcharts.Options> = {
  credits: {
    enabled: false,
  },
  title: undefined,
  chart: {
    styledMode: true,
  },
  tooltip: {
    enabled: false,
  },
};

/**
 * @property series - Pass the data series to be plotted
 */
@customElement('dss-chart')
export default class Chart extends BaseElement {
  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property({ type: Array })
  series!: ChartOptions[];

  @query('.chart-container')
  private container!: HTMLDivElement;

  private chart?: Highcharts.Chart;

  protected render() {
    return html`
      <div class="chart-container" data-chromatic="ignore"></div>
    `;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.chart?.destroy();
  }

  protected updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (changedProperties.has(SERIES_PROPERTY)) {
      const currentType = this.series[0].type;
      const previousType = changedProperties.get(SERIES_PROPERTY)?.[0].type;
      if (currentType !== previousType) {
        this.initializeChartWithType(currentType);
      } else {
        this.chart?.update({ series: this.series });
      }
    }
  }

  private async initializeChartWithType(type: ChartOptions['type']) {
    const { default: highcharts } = await import('highcharts/es-modules/masters/highcharts.src.js');
    await import('highcharts/es-modules/masters/modules/accessibility.src.js');
    if (type === 'pie') {
      this.initializePieChart(highcharts);
    } else if (type === 'column') {
      this.initializeColumnChart(highcharts);
    } else if (type === 'bar') {
      this.initializeBarChart(highcharts);
    }
  }

  private initializeBarChart(highcharts: typeof Highcharts) {
    this.chart = highcharts.chart(
      this.container,
      {
        ...DEFAULT_OPTIONS,
        legend: {
          enabled: false,
        },
        chart: {
          spacingRight: 32,
        },
        xAxis: {
          type: 'category',
          className: 'dss-bar-axis-labels',
          labels: {
            useHTML: true,
          },
        },
        yAxis: {
          title: undefined,
          opposite: true,
          className: 'highcharts-y-axis-labels',
        },
        series: this.series,
      },
    );
  }

  private initializeColumnChart(highcharts: typeof Highcharts) {
    this.chart = highcharts.chart(
      this.container,
      {
        ...DEFAULT_OPTIONS,
        legend: {
          enabled: false,
        },
        xAxis: {
          type: 'category',
          className: 'dss-column-axis-labels',
          labels: {
            useHTML: true,
          },
        },
        yAxis: {
          title: undefined,
          className: 'highcharts-y-axis-labels',
        },
        series: this.series,
      },
    );
  }

  private initializePieChart(highcharts: typeof Highcharts) {
    this.chart = highcharts.chart(
      this.container,
      {
        ...DEFAULT_OPTIONS,
        legend: {
          align: 'right',
          verticalAlign: 'middle',
          layout: 'vertical',
          itemMarginBottom: 10,
          symbolHeight: 32,
          symbolWidth: 32,
          symbolPadding: 16,
          symbolRadius: '50%' as any, // wrong typing by highcharts, radius can also be a string value
          useHTML: true,
        },
        plotOptions: {
          pie: {
            showInLegend: true,
            dataLabels: {
              enabled: false,
            },
            states: {
              hover: {
                halo: null,
              },
            },
          },
        },
        series: this.series,
      },
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-chart': Chart;
  }
}
