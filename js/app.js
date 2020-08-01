


var root = new Vue({
    el: "#root",
    data: {
        values: null,
        xAxis: [],
        yAxis: []
    },
    methods: {
        load: function () {
            let minDate = '2020-07-01';
            let speedtest = [];
            fetch('https://s3-ap-southeast-2.amazonaws.com/speedtest.damitha.xyz/data/30day-matrix.json')
                .then(response => response.json())
                .then(d => {
                    let maxDate = moment();
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

            this.values = speedtest;
        },
        draw: function (minDate, maxDate, maxHours, date, hour, value) {
            let margin = 25;
            let svgWidth = 600;
            let svgHeight = 300;
            let startX = margin
            let startY = margin
            let daysToRender = moment(maxDate).diff(moment(minDate), 'days') + 2
            let w = (svgWidth - (2 * margin)) / daysToRender
            let h = (svgHeight - (2 * margin)) / maxHours
            //  console.log((moment(date).diff(moment(minDate), 'days') + 1))
            let x = startX + (moment(date).diff(moment(minDate), 'days') + 1) * w;
            let y = startY + Number(hour.replace(":00", "")) * h;
            // console.log(hour)
            var alpha = 1 - ((value - 5) / 45);
            return {
                x: x,
                y: y,
                w: w,
                h: h,
                t: `${value} Mbps on ${moment(date).format('DD-MM-YYYY')} ${hour}`,
                fill: ( moment(date).isAfter(moment("2020-07-29T10:00:00"))) ? `rgba(33,171,205,${alpha})` : `rgba(230,85,13,${alpha})`
            }
        },
drawXaxis: function (minDate, maxDate) {
    let margin = 25;
    let svgWidth = 600;
    let svgHeight = 300;
    let startX = margin
    let startY = margin
    let daysToRender = moment(maxDate).diff(moment(minDate), 'days') + 2
    let w = (svgWidth - (2 * margin)) / daysToRender
    for (let i = 0; i < daysToRender + 1; i++) {
        let x = startX + i * w + (w / 2);
        if (i % 5 == 0) {
            this.xAxis.push({
                x: x,
                y: svgHeight - margin * 0.8,
                x2: x,
                y2: svgHeight - margin * 0.6,
                tx: x - 10,
                ty: svgHeight - margin * 0.1,
                text: moment(minDate).add(i - 1, 'days').format('DD MMM')
            })
        }

    }
},
drawYaxis: function (hours) {
    let margin = 25;
    let svgWidth = 600;
    let svgHeight = 300;
    let startX = margin
    let startY = margin
    let h = (svgHeight - (2 * margin)) / hours
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
}

    }

})


root.load()

