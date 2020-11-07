


var root = new Vue({
    el: "#root",
    data: {
        values: null,
        legendHeight: 50,
        svgWidth: 600,
        svgHeight: 330,
        margin: 25,
        legend: [],
        legendText: [],
        xAxis: [],
        yAxis: []
    },
    methods: {
        load: function () {
            let minDate = moment().subtract(4, "month");
            let speedtest = [];
            fetch('https://s3-ap-southeast-2.amazonaws.com/speedtest.damitha.xyz/data/30day-matrix.json')
                .then(response => response.json())
                .then(d => {
                    let maxDate = moment()
                    let maxHours = 24;
                    d.data.forEach(result => {
                        let v = this.draw(minDate, maxDate, maxHours, result.x, result.y, result.v)
                        speedtest.push(
                            v
                        )
                    });
                })
            this.drawXaxis(minDate, moment());
            this.drawYaxis(24);
            this.drawLegend(9, minDate, moment())

            this.values = speedtest;
        },
        draw: function (minDate, maxDate, maxHours, date, hour, value) {
            let margin = this.margin;
            let svgWidth = this.svgWidth;
            let svgHeight = this.svgHeight;
            let startX = margin
            let startY = (margin * 0.9) + this.legendHeight
            let daysToRender = moment(maxDate).diff(moment(minDate), 'days') + 1
            let w = (svgWidth - (2 * margin)) / daysToRender
            let h = (svgHeight - (this.legendHeight) - (2 * margin)) / maxHours
            let x = startX + (moment(date).diff(moment(minDate), 'days') + 1) * w;
            let y = startY + Number(hour.replace(":00", "")) * h;
            // console.log(hour)
            var alpha = 1 - ((value - 3) / 45);
            return {
                x: x,
                y: y,
                tx: x + w / 4,
                ty: y + w / 2.3,
                w: w,
                h: h,
                t: `${value}`,
                fill: (moment(date).isAfter(moment("2020-07-29T10:00:00"))) ? `rgba(33,171,205,${alpha})` : `rgba(230,85,13,${alpha})`
            }
        },
        drawXaxis: function (minDate, maxDate) {
            let margin = this.margin;
            let svgWidth = this.svgWidth;
            let svgHeight = this.svgHeight;
            let startX = margin
            let daysToRender = moment(maxDate).diff(moment(minDate), 'days') + 1
            let w = (svgWidth - (2 * margin)) / daysToRender
            for (let i = 0; i < daysToRender + 1; i++) {
                let x = startX + i * w + (w / 2);
                if (i % 10 == 0) {
                    this.xAxis.push({
                        x: x,
                        y: svgHeight - margin * 0.8,
                        x2: x,
                        y2: svgHeight - margin * 0.6,
                        tx: x - 10,
                        ty: svgHeight - margin * 0.1,
                        text: moment(minDate).add(i, 'days').format('DD MMM')
                    })
                }

            }
        },
        drawYaxis: function (hours) {
            let margin = this.margin;
            let svgWidth = this.svgWidth;
            let svgHeight = this.svgHeight;
            let startY = margin + this.legendHeight;
            let h = (svgHeight - this.legendHeight - (2 * margin)) / hours
            for (let i = 0; i < hours; i++) {
                let y = startY + i * h + (h / 2);
                if (i % 3 == 0) {
                    this.yAxis.push({
                        x: svgWidth - margin * 0.96,
                        y: y,
                        x2: svgWidth - margin * 0.9,
                        y2: y,
                        tx: svgWidth - margin * 0.88,
                        ty: y + 3,
                        text: `${i}:00`
                    })
                }

            }
        },
        drawLegend: function (interval, minDate, maxDate) {
            let margin = this.margin;
            let svgWidth = this.svgWidth;
            let svgHeight = this.svgHeight;
            let startY = margin;
            //   let daysToRender = moment(maxDate).diff(moment(minDate), 'days') + 1
            let daysToRender = 30

            let w = (svgWidth - (2 * margin)) / daysToRender
            let legendLength = w * interval;
            let startX = ((svgWidth - (2 * margin)) - legendLength) / 2;
            let val = 5;
            let h = (svgHeight - (2 * margin)) / 24
            for (let i = 0; i < interval; i++) {

                let x = startX + (w * i)
                var alpha = 1 - ((val - 3) / 45);
                this.legend.push({
                    x: x,
                    y: margin * 0.6,
                    w: w,
                    h: h,
                    t: `${val}`,
                    fill: `rgba(33,171,205,${alpha})`
                })
                this.legend.push({
                    x: x,
                    y: margin * 0.6 + h,
                    w: w,
                    h: h,
                    t: `${val}`,
                    fill: `rgba(230,85,13,${alpha})`
                })
                this.legendText.push({
                    tx: x + w * (0.33),
                    ty: (margin * 0.6) + 3 * h,
                    text: `${Math.floor(val)}`
                })
                this.legendText.push({
                    tx: x + w * (0.33),
                    ty: (margin * 0.6) + 3 * h,
                    text: `${Math.floor(val)}`
                })
                val = val + 5
            }
            this.legendText.push({
                tx: startX - 50,
                ty: (margin * 0.5) + h,
                text: `Uniti Wireless`
            })
            this.legendText.push({
                tx: startX - 30,
                ty: (margin * 0.5) + 2 * h,
                text: `iPrimus`
            })
            this.legendText.push({
                tx: startX + legendLength,
                ty: (margin * 0.6) + 3 * h,
                text: ` (Mbps)`
            })

        }


    }

})


root.load()

