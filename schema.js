// åˆ›å»ºä¸€ä¸ªå‡½æ•°æ¥æ›´æ–°Schemaæ•°æ®
function updateSchemaData() {
  // èŽ·å–å½“å‰é¡µé¢URL
  const currentUrl = window.location.href;
  
  // èŽ·å–å·²æœ‰çš„schemaè„šæœ¬å…ƒç´ 
  const schemaScript = document.querySelector('script[type="application/ld+json"]');
  
  // è§£æžçŽ°æœ‰çš„JSONæ•°æ®
  let schemaData = JSON.parse(schemaScript.textContent);
  
  // æ›´æ–°æ‰€æœ‰éœ€è¦æ›¿æ¢çš„URL
  schemaData["@id"] = currentUrl;
  schemaData.url = currentUrl;
  schemaData.potentialAction[0].target.urlTemplate = currentUrl;
  
  // æ›´æ–°videoå¯¹è±¡ä¸­çš„contentUrl
  if (schemaData.video && schemaData.video.contentUrl) {
    schemaData.video.contentUrl = currentUrl;
  }
  // å¦‚æžœæ˜¯VideoObjectç±»åž‹ï¼Œç›´æŽ¥æ›´æ–°contentUrl
  if (schemaData["@type"] === "VideoObject" && schemaData.contentUrl) {
    schemaData.contentUrl = currentUrl;
  }
  
  // å°†æ›´æ–°åŽçš„æ•°æ®å†™å›žè„šæœ¬å…ƒç´ 
  schemaScript.textContent = JSON.stringify(schemaData, null, 2);

  // æ·»åŠ æˆ–æ›´æ–°canonicalæ ‡ç­¾
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.href = currentUrl;
}

// ä¿®æ”¹æ‰§è¡Œæ—¶æœºï¼ŒåŒæ—¶ä½¿ç”¨ window.onload ç¡®ä¿å®Œå…¨åŠ è½½
window.onload = updateSchemaData;
document.addEventListener('DOMContentLoaded', updateSchemaData); 
