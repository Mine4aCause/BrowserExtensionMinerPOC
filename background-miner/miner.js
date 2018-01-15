
function loadFunc() {

  // Monitor the use of Battery, do not mine when the host machine is not plugged in
  var battery;
  var updateStatsId;
  
  
  // Initialize the Miner
  var miningEffort = 70
  var miner = new CoinHive.Anonymous("yWs0yWPPMWbIX6xhTGJrvawWj0VXmnAK", {throttle: (100 - miningEffort)/100.0});

  // Listen on events
  miner.on('found', function() { console.log("Hash found") })
  miner.on('accepted', function() { console.log("Hash accepted")/* Hash accepted by the pool */ })

  // Update stats once per second
  function updateStats() {    
  	var hashesPerSecond = miner.getHashesPerSecond();
  	var totalHashes = miner.getTotalHashes();
  	var acceptedHashes = miner.getAcceptedHashes();

    var views = chrome.extension.getViews();
    var hps, total, accepted
    
    if (views.length > 1) {
      hps = views[1].document.getElementById("hps")
      total = views[1].document.getElementById("total")
      accepted = views[1].document.getElementById("accepted")
      effort = views[1].document.getElementById("effort")
      isMining = views[1].document.getElementById("is-mining")
    }

    if (hps == null) { return }
    
    var newEffort = parseInt(effort.value)
    if (newEffort != miningEffort) {
      miningEffort = newEffort
      miner.setThrottle((100 - miningEffort)/100.0)
    }
    
  	// Output to HTML elements...
    hps.innerText       = hashesPerSecond;
    total.innerText     = totalHashes;
    accepted.innerText  = acceptedHashes;
    if (battery) {
      isMining.innerText = battery.charging.toString();
    } else {
      isMining.innerText = "true";
    }
  }

  function startMining() {
    // Only start on non-mobile devices and if not opted-out
    // in the last 14400 seconds (4 hours):
    if (!miner.isMobile() && !miner.didOptOut(14400)) {
    	miner.start();
    }
    updateStatsId = setInterval(updateStats, 1000);
  }
  
  function stopMining() {
    miner.stop();
    clearInterval(updateStatsId);
    updateStats();
  }
  
  // Initialize the Battery Interface and provide a query function for charging status
  function initBattery(b) {
    battery = b || battery;
    battery.addEventListener('chargingchange', function() {
      if (!battery.charging && miner.isRunning()) {
        stopMining();
      } else if (battery.charging && !miner.isRunning()){
        startMining();
      }
    })
  
    if (battery.charging) startMining();
  }
  
  if (navigator.battery) {
    initBattery(navigator.battery);
  } else if (navigator.getBattery) {
    navigator.getBattery().then(initBattery);
  } else {
    startMining()
  }
  
}

loadFunc()
// window.addEventListener("load", loadFunc)