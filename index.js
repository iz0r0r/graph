angular.module('app', []);

angular.module('app')
  .controller('reportGraphController', function($scope) {

    this.scope_ = $scope;

    this.inputGraphData_ = [{
      startDate: new Date('04-01-2017'),
      endDate: new Date()
    }];

    this.showKPI1Scale_ = 1;

    this.showKPI2Scale_ = -1;

    this.previousSheetNumber_ = -1;

    this.showtoolTip_ = false;

    this.graphData = {
      sheetPlotPoints: {
        KPI1: {
          1: [],
          7: [],
          14: [],
          30: [],
          90: []
        },
        KPI2: {
          1: [],
          7: [],
          14: [],
          30: [],
          90: []
        }
      },
      chartScale: 1,
      chartType: 1
    };

    this.axisGrid_ = '';
    this.xAxisNames_ = '';
    this.xAxisNamesObject_ = [];
    this.xAxisDateTextArray_ = [];
    this.xItemsScaleNeedlePath_ = '';
    this.yItemsScaleKpi1 = '';
    var pathTextKPI1 = 'M43,30';
    var pathTextKPI2 = 'M1183,30';
    var axisGrid = 'M43,30';
    var textYAxis = [];
    for (var i = 0; i < 10; i++) {
      pathTextKPI1 += 'h-4M43,' + (30 + 327 * (i + 1) / 10);
      pathTextKPI2 += 'h4M1183,' + (30 + 327 * (i + 1) / 10);
      axisGrid += 'h1140M43,' + (30 + 327 * (i + 1) / 10);
      textYAxis.push({
        y: (33 + 327 * (i) / 10),
        text: 10 - i
      });
    }
    this.itemsYAxisText_ = textYAxis;
    this.yItemsScaleKpi1 = pathTextKPI1 + 'v-328';
    this.yItemsScaleKpi2 = pathTextKPI2 + 'v-328';
    this.axisGrid_ = axisGrid;
    this.linePath1_ = '';
    this.linePath2_ = '';
    this.barPath1_ = '';
    this.barPath2_ = '';
    this.lineChartCircles1_ = '';
    this.lineChartCircles2_ = '';
    this.selectedCHCircles_ = '';
    this.plotItemsData_ = [];
    this.selectedCirclesText_ = [];
    this.selectedTaskCircles_ = '';
    this.needleGap_ = 0;
    this.transformObj_ = '';


    this.plotDateAxis = function(dates, scale) {
      var minDate = new Date();
      var maxDate = new Date();
      var totalDays = 0;
      for (var i = 0; i < dates.length; i++) {
        var date = dates[i];
        if (minDate > date.startDate) {
          minDate = date.startDate;
        }
        if (maxDate < date.endDate) {
          maxDate = date.endDate;
        }
        var timeDiff =
          Math.abs(date.startDate.getTime() - date.endDate.getTime()) +
          86400000;
        totalDays += Math.ceil(timeDiff / (1000 * 3600 * 24));
      }
      this.plotXAxisNames(totalDays, dates, scale);
    };


    this.plotXAxisNames = function(totalDays, dates, scaleDays) {
      var xAxisNamesPath = 'M43,356';
      var totalLength = 43;
      this.xAxisNamesObject_ = [];
      this.xAxisDateTextArray_ = [];
      this.xItemsScaleNeedlePath_ = '';
      this.linePath1_ = '';
      this.linePath2_ = '';
      this.barPath1_ = '';
      this.barPath2_ = '';
      this.lineChartCircles1_ = '';
      this.lineChartCircles2_ = '';
      this.plotItemsData_ = [];
      this.selectedCHCircles_ = '';
      this.selectedCirclesText_ = [];
      this.selectedTaskCircles_ = '';
      var emptySpace = 1 / (totalDays + dates.length - 1) * 1140 * scaleDays;
      for (var i = 0; i < dates.length; i++) {
        var date = dates[i];
        var timeDiff =
          Math.abs(date.startDate.getTime() - date.endDate.getTime());
        var dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
        var xPoint =
          dayDiff / totalDays * (1140 - emptySpace * (dates.length - 1));
        xAxisNamesPath += 'h' + xPoint + 'm' + emptySpace + ',0';

        this.xAxisNamesObject_.push({
          x: totalLength - 70 + xPoint / 2,
          text: date.startDate.toLocaleDateString(
              'IST', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }) +
            ' - ' +
            date.endDate.toLocaleDateString(
              'IST', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })
        });
        this.xAxisDateTextArray_.push(this.getTextItems(
          scaleDays, date, totalLength, totalLength + xPoint));
        totalLength += xPoint + emptySpace;
      }
      this.xAxisNames_ = xAxisNamesPath;
    };

    this.getTextItems = function(scaleDays, date, startPoint, endPoint) {
      var items = [];
      var linePath1 = '';
      var barPath1 = '';
      var linePath2 = '';
      var barPath2 = '';
      var lineCircle1 = '';
      var lineCircle2 = '';
      var timeDiff = Math.abs(date.startDate.getTime() - date.endDate.getTime()) +
        scaleDays * 86400000;
      var needlePath = '';
      var needleGap = (endPoint - startPoint) * (scaleDays * 86400000) / timeDiff;
      var index = 0;
      for (var i = date.startDate.getTime(); i <= date.endDate.getTime(); i += scaleDays * 86400000) {
        var IterateDate = new Date(i);
        var needleText;
        if (scaleDays == 1) {
          needleText = IterateDate.toLocaleDateString('IST', {
            day: 'numeric'
          });
        } else if (scaleDays == 7 || scaleDays == 14) {
          needleText = IterateDate.toLocaleDateString(
            'IST', {
              day: 'numeric',
              month: 'numeric'
            });
        } else {
          needleText = IterateDate.toLocaleDateString('IST', {
            month: 'long'
          });
        }
        var obj = {
          text: needleText,
          x: startPoint + (needleGap / 2) +
            (((endPoint - startPoint) * (i - date.startDate.getTime())) /
              timeDiff),
        };
        var yPoint1 = (30 + 327 * this.getLineData(date, index, 'KPI1') / 10);
        if (i == date.startDate.getTime()) {
          linePath1 = 'M' + (obj.x) + ',' + yPoint1;
        } else {
          linePath1 += 'L' + (obj.x) + ',' + yPoint1;
        }
        lineCircle1 += 'M' + (obj.x + 4) + ',' + yPoint1 + ' A 4 4 0 1 1 ' +
          (obj.x + 3.999998) + ',' + (yPoint1 - 0.003999999);
        if (yPoint1 != 357) {
          var xPoint1 = obj.x - ((needleGap - 6) / 2);
          var widthBar = needleGap - 6;
          if (this.showKPI2Scale_ != -1) widthBar = ((needleGap - 6) / 2);
          barPath1 += 'M' + xPoint1 + ',356v-' + (356 - yPoint1) + 'h' +
            widthBar + 'v' + (356 - yPoint1);
        }

        var yPoint2 = (30 + 327 * this.getLineData(date, index, 'KPI2') / 10);
        if (i == date.startDate.getTime()) {
          linePath2 = 'M' + (obj.x) + ',' + yPoint2;
        } else {
          linePath2 += 'L' + (obj.x) + ',' + yPoint2;
        }
        lineCircle2 += 'M' + (obj.x + 4) + ',' + yPoint2 + ' A 4 4 0 1 1 ' +
          (obj.x + 3.999998) + ',' + (yPoint2 - 0.003999999);
        if (yPoint2 != 357) {
          var xPoint2 = (obj.x - ((needleGap - 6) / 2));
          var widthBar = (needleGap - 6);
          if (this.showKPI1Scale_ != -1) {
            widthBar = ((needleGap - 6) / 2);
            xPoint2 = obj.x;
          }
          barPath2 += 'M' + xPoint2 + ',356v-' + (356 - yPoint2) + 'h' +
            widthBar + 'v' + (356 - yPoint2);
        }
        obj['y1'] = yPoint1;
        obj['y2'] = yPoint2;
        obj['time'] = i;
        obj['index'] = index;
        items.push(obj);
        needlePath += 'M' + (obj.x) + ',356v4';
        this.plotItemsData_.push({
          x: obj.x,
          y1: yPoint1,
          y2: yPoint2,
          time: i
        });
        index++;
      }
      this.linePath1_ += linePath1;
      this.barPath1_ += barPath1;
      this.linePath2_ += linePath2;
      this.barPath2_ += barPath2;
      this.lineChartCircles1_ += lineCircle1;
      this.lineChartCircles2_ += lineCircle2;
      this.xItemsScaleNeedlePath_ += needlePath;
      this.needleGap_ = needleGap;
      return items;
    };

    this.getLineData = function(IterateDate, index, KPI) {
      var data = 0;
      if (this.graphData.sheetPlotPoints[KPI][this.graphData.chartScale].length -
        1 >
        index) {
        data =
          this.graphData.sheetPlotPoints[KPI][this.graphData.chartScale][index];
      } else {
        data = parseInt(Math.random() * 10, 10);
        this.graphData.sheetPlotPoints[KPI][this.graphData.chartScale].push(data);
      }
      return data + 1;
    };


    this.plotChItems = function() {
      var chItemsPath = '';
      var taskItemsPath = '';
      var textArraySelected = [];
      for (var i = 0; i < this.selectedItems.length; i++) {
        var data = this.selectedItems[i].data;
        var startTime = this.plotItemsData_[0].time;
        for (var j = 1; j < this.plotItemsData_.length - 1; j++) {
          var endTime = this.plotItemsData_[j].time;
          var date;
          if (this.selectedItems[i].type == 'change_history')
            date = (new Date(data.date)).getTime();
          else
            date = (new Date(data.creation_date)).getTime();
          if (date > startTime && date <= endTime) {
            var yPoint = this.showKPI2Scale_ == -1 ?
              this.plotItemsData_[j].y1 :
              this.showKPI1Scale_ == -1 ?
              this.plotItemsData_[j].y2 :
              this.plotItemsData_[j].y2 < this.plotItemsData_[j].y1 ?
              this.plotItemsData_[j].y2 :
              this.plotItemsData_[j].y1;
            var xPoint = this.plotItemsData_[j].x;
            var item = textArraySelected.filter(function(item) {
              return item.x == xPoint - 1;
            });
            yPoint = item.length == 0 ? yPoint : yPoint - (item.length * 35);
            if (yPoint < 25) {
              var highestY = item.reduce(function(a, b) {
                return a.y > b.y ? a : b;
              });
              yPoint = highestY.y + 70;
            }
            textArraySelected.push({
              x: xPoint - 1,
              y: yPoint - 34,
              text: i + 1
            });
            var path = 'M' + (xPoint - 2) + ',' + (yPoint - 25) +
              ' A 15 15 0 1 1 ' + (xPoint - 2 + .001) + ',' +
              (yPoint - 25 + 0.0001);
            if (this.selectedItems[i].type == 'change_history')
              chItemsPath += path;
            else
              taskItemsPath += path;
          }
          startTime = endTime;
        }
      }
      this.selectedCHCircles_ = chItemsPath;
      this.selectedTaskCircles_ = taskItemsPath;
      this.selectedCirclesText_ = textArraySelected;
    };


    this.createDataPoint = function(item) {
      this.plotChItems();
    };

    this.showTooltip = function(item) {
      this.showtoolTip_ = true;
      var date = new Date(item.time);
      this.transformObj_ = {
        kpi1: {
          text: 10 - this.getLineData(date, item.index, 'KPI1'),
          transformMatrix_: {
            transform: 'translate(' + (item.x - 336) + 'px,' + (item.y1 - 121) + 'px)'
          },
        },
        kpi2: {
          text: 10 - this.getLineData(date, item.index, 'KPI2'),
          transformMatrix_: {
            transform: 'translate(' + (item.x - 336) + 'px,' + (item.y2 - 121) + 'px)'
          }
        },
        date: date.toLocaleDateString(
          'IST', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
      };
    };


    this.plotDateAxis(this.inputGraphData_, 1);
  });