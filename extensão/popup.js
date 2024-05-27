document.addEventListener('DOMContentLoaded', function() {
  const blockImagesCheckbox = document.getElementById('blockImages');
  const blockVideosCheckbox = document.getElementById('blockVideos');
  const reduceQualityCheckbox = document.getElementById('reduceQuality');
  const carbonReductionText = document.getElementById('carbonReduction');

  // Load extension settings and calculate carbon reduction
  chrome.storage.local.get(['blockImages', 'blockVideos', 'reduceQuality'], function(data) {
      blockImagesCheckbox.checked = data.blockImages;
      blockVideosCheckbox.checked = data.blockVideos;
      reduceQualityCheckbox.checked = data.reduceQuality;
      calculateCarbonReduction(data);
  });

  // Event listeners for checkboxes
  blockImagesCheckbox.addEventListener('change', function() {
      chrome.storage.local.set({ blockImages: blockImagesCheckbox.checked });
  });

  blockVideosCheckbox.addEventListener('change', function() {
      chrome.storage.local.set({ blockVideos: blockVideosCheckbox.checked });
  });

  reduceQualityCheckbox.addEventListener('change', function() {
      chrome.storage.local.set({ reduceQuality: reduceQualityCheckbox.checked });
  });

  // Listen for changes in extension settings and recalculate carbon reduction
  chrome.storage.onChanged.addListener(function(changes) {
      chrome.storage.local.get(['blockImages', 'blockVideos', 'reduceQuality'], function(data) {
          calculateCarbonReduction(data);
      });
  });

  // Function to calculate carbon reduction
  function calculateCarbonReduction(data) {
      const blockedImages = data.blockImages ? 1 : 0;
      const blockedVideos = data.blockVideos ? 1 : 0;
      const reduceQuality = data.reduceQuality ? 1 : 0;
      const carbonReduction = (blockedImages * 20 + reduceQuality * 5 + blockedVideos * 50); // Assuming 10g reduction per image and 50g per video, with 5g reduction for reduced quality images
      carbonReductionText.textContent = `Redução carbono: ${carbonReduction}g`;
  }
});