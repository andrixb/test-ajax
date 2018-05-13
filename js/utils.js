'use-strict';

$.factsApp = $.factsApp || {};

$.factsApp.Utils = (() => {
    const _params = {};

    let _init = (config) => {
       _params.url = config.URL;
    };

    let _ajaxRequest = (cb) => {
        $.ajax(_params)
            .done(cb)
            .fail(() => console.log('Error'));
    };

    return {
        init: _init,
        ajaxRequest: _ajaxRequest
    }
})();
