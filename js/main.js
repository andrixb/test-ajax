'use-strict';

var $document = $(document); 

$document.ready(() => {
    let $wait = $('.wait');

    $.factsApp.Facts.init();
    
    $document.ajaxStart(() => $wait.show());
    $document.ajaxStop(() => $wait.hide());
});
