// Function for downloading data from the JavaScript environment (NOT from a
// URL) to a file on the user's device.
//
// data:      JavaScript Object/String/Array/Value that will be the contents of
//            the file. There is a file size limit on this variable but it
//            varies by browser.
// filename:  Name of file to download. If blank or missing will default to
//            "dashboard-download-TIMESTAMP" with extension based on MIME type.
// mimeType:  MIME type of the file to download. Defaults to "text/plain".
// encoding:  Character encoding set for the file to download. Defaults to
//            "utf-8".
function Downloader(data, filename, mimeType, encoding) {
  if (mimeType === undefined) {
    mimeType = "text/plain";
  }

  if (encoding === undefined) {
    encoding = "utf-8";
  }

  if (filename === "" || filename === undefined) {
    filename = "dashboard-download-" + (new Date()).valueOf();
  }

  var element = document.createElement("a");
  document.body.appendChild(element);
  element.href = `data:${mimeType};charset=${encoding},${encodeURI(data)}`;
  element.target = "_blank";
  element.download = filename;
  element.click();
  document.body.removeChild(element);
}

export default Downloader;
