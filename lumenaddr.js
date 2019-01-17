
function clearTooltip(e) {
    e.currentTarget.setAttribute('class','btn btn-outline-secondary');
    e.currentTarget.removeAttribute('aria-label');
}
function showTooltip(elem,msg) {
    elem.setAttribute('aria-label',msg);
    elem.setAttribute('class','btn btn-outline-secondary tooltipped tooltipped-s');
}

function fallbackMessage(action) {
    var actionMsg='';
    var actionKey=(action==='cut'?'X':'C');
    if(/iPhone|iPad/i.test(navigator.userAgent)){actionMsg='No support :(';}
    else if(/Mac/i.test(navigator.userAgent)){actionMsg='Press ⌘-'+ actionKey+' to '+ action;}
    else{actionMsg='Press Ctrl-'+ actionKey+' to '+ action;}
    return actionMsg;
}

$(window).ready(function() {
    var btns=document.querySelectorAll('.btn.btn-outline-secondary');
    for(var i=0;i<btns.length;i++){
        btns[i].addEventListener('mouseleave',clearTooltip);
        btns[i].addEventListener('blur',clearTooltip);
    }

    var clipboard = new Clipboard('.btn.btn-outline-secondary');
    clipboard.on('success', function(e) {
        e.clearSelection();
        showTooltip(e.trigger,'Copied!');
        console.log(e.trigger);
    });

    clipboard.on('error', function(e) {
        showTooltip(e.trigger,fallbackMessage(e.action))
    });

    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        $("#mobile-alert").show();
    }

    $("#suffix").keyup(function() {
        if(this.value.length >= 4) {
            $("#suffixbadge").css("visibility", "visible");
            if(this.value.length == 4) {
                $("#suffixbadge").removeClass("badge badge-danger").addClass("badge badge-warning");
                $("#suffixbadge").text("Will take 30-120 min to compute addresses");
            } else {
                $("#suffixbadge").removeClass("badge badge-warning").addClass("badge badge-danger");
                $("#suffixbadge").text("Will take more than 2 hours to compute addresses");
            }
        } else {
            $("#suffixbadge").css("visibility", "hidden");
        }
    });
});

function generateInUiThread(suffix) {
   var pr = document.getElementById("privateKey");
   var pp = document.getElementById("publicKey");

    var st = new Date().getTime();
    var pair = StellarSdk.Keypair.random();
    while(true) {
        if(pair.publicKey().endsWith(suffix)) {
            break;
        }
        pair = StellarSdk.Keypair.random();
    }
    var end =  new Date().getTime();

    pr.value = pair.secret();
    pp.value = pair.publicKey();

    $('#timebadge').text("Took " + Number(((end-st)/1000.0).toFixed(2)) + " sec to compute");
}

function generateInWorkerThread(suffix) {
    try {
        var worker = new Worker("./worker.js");

        $('#generatebutton').prop('disabled', true);
        $('#progressbar').show();

        worker.onmessage = function(e) {
            var pr = document.getElementById("privateKey");
            var pp = document.getElementById("publicKey");

            pr.value = e.data[0];
            pp.value = e.data[1];

            var time = e.data[2];

            $('#generatebutton').prop('disabled', false);
            $('#progressbar').hide();

            $('#timebadge').text("Took " + Number((time/1000.0).toFixed(2)) + " sec to compute");
            $('#timebadge').show();

            worker.terminate();
        }
        worker.postMessage(suffix);
        return true;
    } catch(e) {
        return false;
    }
}

function generate() {
    var suffix = document.getElementById("suffix").value;
    if(window.Worker) {
        if(!generateInWorkerThread(suffix)) {
            //some problem institiating worker js
            generateInUiThread(suffix);
        }
    } else {
        generateInUiThread(suffix);
    }
}

/*!
 * IE10 viewport hack for Surface/desktop Windows 8 bug
 * Copyright 2014 Twitter, Inc.
 * Licensed under the Creative Commons Attribution 3.0 Unported License. For
 * details, see http://creativecommons.org/licenses/by/3.0/.
 */

// See the Getting Started docs for more information:
// http://getbootstrap.com/getting-started/#support-ie10-width

(function () {
  'use strict';
  if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
    var msViewportStyle = document.createElement('style')
    msViewportStyle.appendChild(
      document.createTextNode(
        '@-ms-viewport{width:auto!important}'
      )
    )
    document.querySelector('head').appendChild(msViewportStyle)
  }
})();
