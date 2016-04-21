/**
 * @file px2em.js ≈‰÷√Œƒº˛
 *
 * @author luobata(batayao@sohu-inc.com)
 */
(function () {
    var emConfig = {
        baseUrl: {
            file: [
                '../output/'
            ],
            ignore: [
            ]
        },
        options: {
            'encoding': 'UTF-8',
            'flag': 'r'
        },
        regrex: {
            file: '.css',
            img: ['.png', '.jpg', '.gif'],
            px: 12,
            fixNumber: 9,
            type: 'rem',
            cssClass: 'em'
        },
        uploadOpts: {
            host: "192.168.106.139",
            port: "8078",
            method: "POST",
            path: "/image/uploadImgScale?&scale=0.5&temp=true"
        }
    };

    var em = require('./em');
    em(emConfig);
})();
