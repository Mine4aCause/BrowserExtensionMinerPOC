
"use strict";

var BP = chrome.extension.getBackgroundPage();

document.addEventListener('DOMContentLoaded', function() {
  BP.manageEffort();
  BP.updateStatsId = setInterval(function() {
    BP.updateStats()
  }, 1000);  
})

window.onunload = function() {
  clearInterval(BP.updateStatsId);
}
