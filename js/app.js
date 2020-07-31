

Vue.component('svg-path', {
    props: {
        speedtest: Object
    },
    template: `
    <a>
    <g> :d="draw(speedtest.minDate, speedtest.maxHours, speedtest.date, speedtest.hour , speedtest.value)"
    </g>
    </a>
    `,
    methods: {
        draw: function (minDate, maxHours, date, hour, value) {
            let margin = 10;
            let svgWidth = 500;
            let svgHeight = 300;
            let startX = margin
            let startY = margin
            let daysToRender = c
            let w = svgWidth - (2 * margin) / daysToRender
            let h = svgHeight - (2 * margin) / maxHours
            let x = startX + (moment(minDate).diff(moment(date), 'days') + 1) * W;
            let y = startY + hour * w;
            return `<rect x="${x}" y="${y}" width="${w}" height="${h}" " fill="pink" stroke="black"/>`;
        }
    }
})


var root = new Vue({
    el: "#root",
    data: {
        values: null,
    },
    methods: {

        load: function () {
            let speedtest = [];
            fetch('https://s3-ap-southeast-2.amazonaws.com/speedtest.damitha.xyz/data/30day-matrix.json')
                .then(response => response.json())
                .then(d => {

                    let minDate = '01-07-2020';
                    let maxHours = 24;
                    d.data.forEach(result => {
                        speedtest.push({
                            minDate: minDate,
                            maxHours: maxHours,
                            date: result.x,
                            hour: result.y,
                            value: result.v
                        })
                    });
                })
            this.values = speedtest

        }
    }

})

root.load()

