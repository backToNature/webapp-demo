/**
 * @file px2em.js ≈‰÷√Œƒº˛
 *
 * @author luobata(batayao@sohu-inc.com)
 */
var emConfig = {
    baseUrl: {
        file: [
            './build/resource'
        ],
        ignore: [
            './build/resource/css',
            './build/resource/medv.plugin'
        ]
    },
    options: {
        'encoding': 'UTF-8',
        'flag': 'r'
    },
    regrex: {
        file: '.css',
        px: 14,
        fixNumber: 9,
        cssClass: 'em'
    }
};

module.exports = emConfig;
