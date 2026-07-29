const fs = require("fs");
const path = require("path");
const vm = require("vm");

const dataPath = path.join(__dirname, "..", "data.js");
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(dataPath, "utf8"), context, { filename: dataPath });
const data = context.window.SECUREPATH_DATA;
const errors = [];
const videos = data.RESOURCES.filter((resource) => resource.type === "视频" && resource.directUrl && !resource.searchEntry);
const byNode = new Map();
for (const resource of videos) {
  if (!byNode.has(resource.nodeId)) byNode.set(resource.nodeId, []);
  byNode.get(resource.nodeId).push(resource);
  if (/\/search(?:_result)?(?:\/|\?|$)/i.test(resource.directUrl) || /[?&](keyword|q)=/i.test(resource.directUrl)) errors.push(`${resource.id}: search URL used as formal video`);
  if (resource.platform === "哔哩哔哩" && !/^https:\/\/www\.bilibili\.com\/video\/BV[0-9A-Za-z]+\/?(?:\?p=\d+)?$/.test(resource.directUrl)) errors.push(`${resource.id}: invalid Bilibili direct URL`);
  if (resource.platform === "抖音" && !/^https:\/\/(?:www\.|jingxuan\.)?douyin\.com\/(?:m\/video|video)\/\d+/.test(resource.directUrl)) errors.push(`${resource.id}: invalid Douyin direct URL`);
  if (resource.platform === "小红书" && !/^https:\/\/www\.xiaohongshu\.com\/explore\/[0-9a-f]{24}/i.test(resource.directUrl)) errors.push(`${resource.id}: invalid Xiaohongshu direct URL`);
  for (const key of ["creator", "directUrl", "duration", "publishedAt", "verifiedAt", "accessMode", "availability"]) if (!resource[key]) errors.push(`${resource.id}: missing ${key}`);
}
for (const node of data.NODES) {
  const count = (byNode.get(node.id) || []).length;
  if (count < 2 || count > 3) errors.push(`${node.id}: ${count} direct videos (expected 2–3)`);
}
const urls = videos.map((resource) => resource.directUrl);
const duplicateUrls = [...new Set(urls.filter((url, index) => urls.indexOf(url) !== index))];
if (duplicateUrls.length) errors.push(`duplicate direct URLs: ${duplicateUrls.join(", ")}`);
const counts = videos.reduce((map, resource) => map.set(resource.platform, (map.get(resource.platform) || 0) + 1), new Map());
console.log(`Direct videos: ${videos.length}`);
console.log(`Nodes covered: ${byNode.size}/${data.NODES.length}`);
console.log(`Platforms: ${[...counts.entries()].map(([platform, count]) => `${platform}=${count}`).join(", ")}`);
console.log(`Discovery entries (not counted): ${data.RESOURCES.filter((resource) => resource.searchEntry).length}`);
if (errors.length) {
  console.error(`Validation failed (${errors.length}):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log("Validation passed: every node has 2–3 direct works, URL formats are concrete, and direct URLs are unique.");
}
