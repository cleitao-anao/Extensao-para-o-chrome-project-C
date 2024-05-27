chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ blockImages: false, blockVideos: false });
  applyBlockingRules(false, false);
});

chrome.storage.onChanged.addListener((changes) => {
  chrome.storage.local.get(['blockImages', 'blockVideos'], function(data) {
      applyBlockingRules(data.blockImages, data.blockVideos);
  });
});

function applyBlockingRules(blockImages, blockVideos) {
  const rules = [];

  if (blockImages) {
      rules.push({
          id: 1,
          priority: 1,
          action: { type: 'block' },
          condition: {
              urlFilter: '*',
              resourceTypes: ['image']
          }
      });
  }

  if (blockVideos) {
      rules.push({
          id: 2,
          priority: 1,
          action: { type: 'block' },
          condition: {
              urlFilter: '*',
              resourceTypes: ['video']
          }
      });
  }

  chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1, 2],
      addRules: rules
  });
}
