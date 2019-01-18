importScripts("https://cdnjs.cloudflare.com/ajax/libs/stellar-sdk/0.8.0/stellar-sdk.js");

onmessage = function(e) {
    var suffix = e.data;

    console.log("Generation started at " + new Date());

    pair = StellarSdk.Keypair.generate();

    var st = new Date().getTime();
    while(true) {
        if(pair.publicKey().endsWith(("" + suffix).toUpperCase())) {
            break;
        }
        pair = StellarSdk.Keypair.generate();
    }
    var end =  new Date().getTime();

    console.log("Generation completed after " + (end-st) + "ms");
    
    postMessage([pair.secret(), pair.publicKey(), (end-st)]);
}

