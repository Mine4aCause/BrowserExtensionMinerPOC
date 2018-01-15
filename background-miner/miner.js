
// Monitor the use of Battery, do not mine when the host machine is not plugged in
var battery;
var updateStatsId;

var miner;
var miningEffort = 70
// Update stats once per second

function getPopup() {
  return chrome.extension.getViews()[1];
}

function updateStats() {
  var w = getPopup();
  if (!w) return;
  
	var hashesPerSecond = miner.getHashesPerSecond();
	var totalHashes = miner.getTotalHashes();
	var acceptedHashes = miner.getAcceptedHashes();

  var hps, total, accepted
  
  hps = w.document.getElementById("hps")
  total = w.document.getElementById("total")
  accepted = w.document.getElementById("accepted")
  isMining = w.document.getElementById("is-mining")

  if (hps == null) { return }
    
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

function updateEffortDisplay() {
  var w = getPopup();  
  if (!w) return;
  
  var effortValue = w.document.getElementById("mining-effort");
  
  if (miner.isRunning()) {
    effortValue.innerText = miningEffort;
  } else {
    effortValue.innerText = "0";
  }  
}

function manageEffort() {    
  var w = getPopup();
  
  if (!w) return;
  
  var slider      = w.document.getElementById("effort");
  
  updateEffortDisplay();
  slider.value = miningEffort.toString();
  
  slider.addEventListener('change', function() {
    miningEffort = parseInt(slider.value);
    miner.setThrottle((100 - miningEffort)/100.0);
    updateEffortDisplay()
  });  
}

function startMining() {
  // Only start on non-mobile devices and if not opted-out
  // in the last 14400 seconds (4 hours):
  if (!miner.isMobile() && !miner.didOptOut(14400)) {
  	miner.start();
  }
  updateEffortDisplay(getPopup())
}

function stopMining() {
  miner.stop();
  clearInterval(updateStatsId);
  updateStats();
  updateEffortDisplay()
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

function loadFunc() {

  // Initialize the Miner
  miner = new CoinHive.Anonymous("yWs0yWPPMWbIX6xhTGJrvawWj0VXmnAK", {throttle: (100 - miningEffort)/100.0});

  // Listen on events
  miner.on('found', function() { console.log("Hash found") })
  miner.on('accepted', function() { console.log("Hash accepted")/* Hash accepted by the pool */ })

  manageEffort();
  
  if (navigator.battery) {
    initBattery(navigator.battery);
  } else if (navigator.getBattery) {
    navigator.getBattery().then(initBattery);
  } else {
    startMining()
  }
}

document.addEventListener('DOMContentLoaded', loadFunc)
