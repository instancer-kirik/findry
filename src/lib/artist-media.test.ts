import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  isExternalStreamingPage,
  safeUploadFilename,
  splitCommaValues,
  validateHttpUrl,
  validateMediaFile,
} from "./artist-media";

const makeFile = (name: string, type: string, size = 100) =>
  new File([new Uint8Array(size)], name, { type });

describe("artist intro media", () => {
  it("accepts only complete HTTP links", () => {
    assert.equal(validateHttpUrl("https://example.com/demo.mp3"), null);
    assert.match(validateHttpUrl("javascript:alert(1)") ?? "", /http/);
    assert.match(validateHttpUrl("not a url") ?? "", /valid URL/);
  });

  it("rejects the wrong file kind and files over 50 MB", () => {
    assert.equal(validateMediaFile(makeFile("demo.mp3", "audio/mpeg"), "audio"), null);
    assert.match(validateMediaFile(makeFile("demo.mp3", "audio/mpeg"), "image") ?? "", /image/);
    assert.match(validateMediaFile(makeFile("large.wav", "audio/wav", 50 * 1024 * 1024 + 1), "audio") ?? "", /50 MB/);
  });

  it("sends streaming pages to their own player", () => {
    assert.equal(isExternalStreamingPage("https://soundcloud.com/artist/demo"), true);
    assert.equal(isExternalStreamingPage("https://cdn.example.com/demo.mp3"), false);
  });

  it("deduplicates tags and keeps upload extensions safe", () => {
    assert.deepEqual(splitCommaValues("ambient, drone, ambient, , field recording"), ["ambient", "drone", "field recording"]);
    assert.equal(safeUploadFilename("My Demo.MP3!"), "mp3");
  });
});
