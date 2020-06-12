export function formatBytes(bytes, decimals) {
  if (bytes === 0) return "0 Bytes";
  let k = 1000;
  let dm = decimals + 1 || 3;
  let sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let i = Math.floor(Math.log(bytes) / Math.log(k));
  //return numeral(parseFloat((bytes / Math.pow(k, i)).toFixed(dm))).format("0.0,") + " " + sizes[i];
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
