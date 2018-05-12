'use-strict';

$.factsApp = $.factsApp || {};
$.factsApp.Facts = (() => {
    const _params = {
        URL: 'https://api.chucknorris.io/jokes/random',
        TARGET: '#js-wrapper',
        BUTTON: '.facts-loader > .facts-loader__btn',
        TIMER_BTN: '.js-timer',
        FILTER: '.js-facts-filter',
        COUNTER: '.js-counter',
        FREQUENCY: 5000,
        wrapper: null,
        loader: null,
        timer: null,
        document: null,
        testResponse: null,
        filter: null,
        counter: null
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
        _params.filter = $(_params.FILTER);
        _params.counter = $(_params.COUNTER);

        _invokeAjax(_params, _retrieveData);
        _initRendering();

        _bindCustomNotifications($document, _onDataResponse);
        _bindSliderChange(_params.filter, _params.counter);
        _bindMouseActivatedAjaxEvents(_params.loader);
        _bindTimeActivatedAjaxEvents(_params.timerBtn, _params.FREQUENCY);
    };

    let _initRendering = () => {
        _params.counter.html(_params.filter[0].value)
    }

    let _bindMouseActivatedAjaxEvents = (element) => {
        element.click((event) => {
            if (_params.timer != null) {
                clearInterval(_params.timer);
                _params.timer = null;
            }
            _invokeAjax(_params, _retrieveData);
        });
    };

    let _bindSliderChange = (element, display) => {
        element.on('input', (event) => {
            display.html(event.target.value);
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

        data['value'].length < _params.filter[0].value ? 
            _invokeAjax(_params, _retrieveData) : 
            console.log('No new fetch ', data['value'].length );
    };

    return {
        init: _init
    }
})();
