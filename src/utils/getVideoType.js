export const getVideoType = (url = "") => {
  // Remove query parameters and URL hashes before reading the extension.
  const cleanUrl = url.split(/[?#]/)[0];
  const ext = cleanUrl.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "mp4":
      return "video/mp4";
    case "webm":
      return "video/webm";
    case "ogg":
    case "ogv":
      return "video/ogg";
    case "mov":
      return "video/quicktime";
    default:
      return undefined;
  }
};

