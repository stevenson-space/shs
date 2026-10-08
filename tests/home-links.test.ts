import { describe, expect, it } from "vitest";
import { hostOf, kindOf, normalizeUrl } from "../src/components/home/linkCheck";

describe("normalizeUrl", () => {
  it.each([
    ["https://forms.gle/abc123", "https://forms.gle/abc123"],
    ["forms.gle/abc123", "https://forms.gle/abc123"],
    ["  docs.google.com/forms/d/e/xyz/viewform  ", "https://docs.google.com/forms/d/e/xyz/viewform"],
    ["http://example.org", "http://example.org/"],
    ["www.d125.org", "https://www.d125.org/"],
    ["booking.d125.org:8443/ilc", "https://booking.d125.org:8443/ilc"],
  ])("accepts %s", (input, expected) => {
    expect(normalizeUrl(input)).toBe(expected);
  });

  it.each([
    "javascript:alert(1)",
    "javascript:1",
    "localhost:3000",
    "JavaScript:alert(document.cookie)",
    "data:text/html,<script>alert(1)</script>",
    "file:///C:/Windows",
    "vbscript:msgbox",
    "https://hello",
    "not a link",
    "https://user:pass@evil.example.com",
    "",
  ])("refuses %s", (input) => {
    expect(normalizeUrl(input)).toBeNull();
  });
});

describe("hostOf and kindOf", () => {
  it("shows a short host name", () => {
    expect(hostOf("https://www.d125.org/students")).toBe("d125.org");
  });

  it.each([
    ["https://forms.gle/abc", "form"],
    ["https://docs.google.com/forms/d/e/x/viewform", "form"],
    ["https://classroom.google.com/c/123", "classroom"],
    ["https://docs.google.com/document/d/1", "doc"],
    ["https://calendar.google.com/calendar/u/0/r", "calendar"],
    ["https://www.youtube.com/watch?v=1", "video"],
    ["https://shsmaps.com", "link"],
  ])("%s is a %s", (url, kind) => {
    expect(kindOf(url)).toBe(kind);
  });
});
