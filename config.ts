function getUrl() {
  if (process.client) {
    return `${window.location.protocol}//${window.location.host}/api/v2/`
  } else {
    return "http://localhost:3000/api/v2/";
  }
}

export default {
    api_url: getUrl()
}