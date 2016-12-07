
var $ = document.querySelectorAll.bind(document);

var valueToPoint = function (value, index, total) {

        var x = 0,
            y = -value * 0.8,
            angle = Math.PI * 2 / total * index,
            cos = Math.cos(angle),
            sin = Math.sin(angle),
            tx = x * cos - y * sin + 135,
            ty = x * sin + y * cos + 100;

        return {
            x: tx,
            y: ty
        };

    },

slide = function (v) {
    anime({
        targets: ['.info.outer > .cell'],
        translateX: v + 'px',
        duration: function () {
            return 1500 * Math.abs(v - anime.getValue($('.info.outer > .cell')[0], 'translateX').replace('px', '')) / app.ww;
        },
    });
},

slideUpDown = function (t) {

        var value = Number(anime.getValue($(t)[0], 'translateY').toString().replace('px', '')),
            max = $(t)[0].parentElement.clientHeight - $(t)[0].clientHeight;

        if (value > 0) value = 0;
        else if (value < max) value = max;

        anime({
            targets: [t],
            translateY: value + 'px',
            duration: 500,
        });

    },

digitPad = function (symbol, val, len) {
    var str = String(val);
    while (str.length < len) {
        str = symbol + str;
    }
    return str;
};
