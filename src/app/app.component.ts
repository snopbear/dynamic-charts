import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import type { EChartsOption } from 'echarts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  updateOptions!: EChartsOption;
  options: EChartsOption = {
    title: {
      text: 'Dynamic Data + Time Axis',
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        params = params[0];
        return params.value[0];
      },
      axisPointer: {
        animation: false,
      },
    },
    xAxis: {
      type: 'time',
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
      splitLine: {
        show: false,
      },
    },
    series: [
      {
        name: 'Mocking Data',
        type: 'line',
        showSymbol: false,
        data: [],
      },
    ],
  };

  private data: DataT[] = [];
  private timer?: any;

  response: any;
  initial = 50;
  iterator = this.initial;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('../assets/timez.json').subscribe((res: any) => {
      const { data } = res; 
      this.response = data.slice(0, this.initial);
      this.data = [...this.response];
    });

    this.timer = setInterval(() => {
      const newData = this.response.slice(this.iterator, ++this.iterator);
      this.data.shift();
      this.data.push(...newData);
      this.updateOptions = {
        series: [
          {
            data: this.data,
          },
        ],
      };
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
}

type DataT = {
  name: string;
  value: [string, number];
};
