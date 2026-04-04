const { execSync } = require("child_process");
const fs = require("fs");

const QUEUE_FILE = "queue.txt";

function processQueue() {
  if (!fs.existsSync(QUEUE_FILE)) {
    console.log("No queue file found");
    return;
  }

  const urls = fs.readFileSync(QUEUE_FILE, "utf-8")
    .split("\n")
    .filter(Boolean);

  if (urls.length === 0) {
    console.log("Queue empty");
    return;
  }

  const url = urls[0];
  console.log("Downloading:", url);

  try {
    execSync(`./yt-dlp -f best -o "/tmp/%(title)s.%(ext)s" ${url}`, {
      stdio: "inherit"
    });
    console.log("Download complete");
  } catch (err) {
    console.log("Error downloading:", err.message);
  }

  // remove processed URL
  urls.shift();
  fs.writeFileSync(QUEUE_FILE, urls.join("\n"));
}

// run every 15 seconds
setInterval(processQueue, 15000);