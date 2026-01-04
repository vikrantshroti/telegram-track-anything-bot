import crypto from "crypto";
import { loadTrackers, saveTrackers } from "./store.js";

export function addTracker(data) {
  const trackers = loadTrackers();

  const tracker = {
    id: crypto.randomUUID(),
    chatId: data.chatId,
    url: data.url,
    type: data.type,
    keyword: data.keyword || null,
    lastHash: data.lastHash || null,
    lastKeywordState: data.lastKeywordState ?? null,
    lastPrice: data.lastPrice || null,
    createdAt: new Date().toISOString(),
    lastCheckedAt: null,
  };

  trackers.push(tracker);
  saveTrackers(trackers);
  return tracker;
}

export function getUserTrackers(chatId) {
  return loadTrackers().filter((t) => t.chatId === chatId);
}

export function getAllTrackers() {
  return loadTrackers();
}

export function updateTracker(tracker) {
  const trackers = loadTrackers().map((t) =>
    t.id === tracker.id ? tracker : t
  );
  saveTrackers(trackers);
}

export function removeTracker(chatId, id) {
  let trackers = loadTrackers();
  const before = trackers.length;

  trackers = trackers.filter((t) => !(t.chatId === chatId && t.id === id));

  saveTrackers(trackers);
  return trackers.length < before;
}
