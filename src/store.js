import fs from "fs";
import path from "path";

const filePath = path.resolve("data/trackers.json");

export function loadTrackers() {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export function saveTrackers(trackers) {
  fs.writeFileSync(filePath, JSON.stringify(trackers, null, 2));
}
