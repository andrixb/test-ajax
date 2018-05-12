'use-strict';

$.factsApp = $.factsApp || {};
$.factsApp.Facts = (() => {
    const _params = {
        URL: 'https://api.chucknorris.io/jokes/random',
        TARGET: '#js-wrapper',
        BUTTON: '.facts-loader > .facts-loader__btn',
        TIMER_BTN: '.js-timer',
        FREQUENCY: 5000,
        wrapper: null,
        loader: null,
        timer: null,
        document: null,
        testResponse: null
    };

    let _templateFact = (data) => {
        return `
            <div class="facts-text"> 
                <h1>${data['value']}</h1>
                <img src="${data['icon_url']}" alt="Image" />
            </div>
        `;
    };

    let _init = () => {
        _params.wrapper = $(_params.TARGET);
        _params.loader = $(_params.BUTTON);
        _params.timerBtn = $(_params.TIMER_BTN);

        _invokeAjax(_params, _retrieveData);

        _bindCustomNotifications($document, _onDataResponse);
        _bindMouseActivatedAjaxEvents(_params.loader);
        _bindTimeActivatedAjaxEvents(_params.timerBtn, _params.FREQUENCY);
    };

    let _bindMouseActivatedAjaxEvents = (element) => {
        element.click((event) => {
            if (_params.timer != null) {
                clearInterval(_params.timer);
                _params.timer = null;
            }
            _invokeAjax(_params, _retrieveData);
        });
    };

    let _bindTimeActivatedAjaxEvents = (element, time) => {
        element.click((event) => {
            _params.timer = setInterval(() => {
                _invokeAjax(_params, _retrieveData);
            }, time);
        });
    };

    let _bindCustomNotifications = (element, cb) => {
        element.on('data:changed', (event, data) => cb(event, data));
    };

    let _invokeAjax = (params, cb) => {
        $.factsApp.Utils.init(params); // init is always overwritten if url changes every time
        $.factsApp.Utils.ajaxRequest(cb);
    }

    let _retrieveData = (data) => {
        if (data) {
            _params.wrapper.html(_templateFact(data));
            _params.testResponse = data;
            _notifyDataResponse(data);
        }
    };

    let _notifyDataResponse = (data) => {
        $document.trigger('data:changed', [data]);
    };

    let _onDataResponse = (event, data) => {
        console.log('Data have changed: ', data);

        data['value'].length < 100 ? 
            _invokeAjax(_params, _retrieveData) : 
            console.log('No new fetch ', data['value'].length );
    };

    return {
        init: _init
    }
})();
