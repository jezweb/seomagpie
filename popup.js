import { initializeTabs } from "./sections/tabs.js";
import { loadSummary } from "./sections/summary.js";
import { loadHeaders } from "./sections/headers.js";
import { loadImages } from "./sections/images.js";
import { loadLinks } from "./sections/links.js";
import { loadSocial } from "./sections/social.js";
import { loadTools } from "./sections/tools.js";

function getPageData() {
  const issues = [];

  // Check title
  const title = document.title;
  if (!title || title.length < 10 || title.length > 60) {
    issues.push({
      type: "title",
      message: "Title length should be between 10-60 characters",
      severity: "warning",
    });
  }

  // Check meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription || !metaDescription.content) {
    issues.push({
      type: "meta",
      message: "Missing meta description",
      severity: "error",
    });
  } else if (
    metaDescription.content.length < 50 ||
    metaDescription.content.length > 160
  ) {
    issues.push({
      type: "meta",
      message: "Meta description length should be between 50-160 characters",
      severity: "warning",
    });
  }

  // Check headings
  if (!document.querySelector("h1")) {
    issues.push({
      type: "heading",
      message: "Missing H1 heading",
      severity: "error",
    });
  }

  // Check images
  const images = Array.from(document.images);
  const imagesWithoutAlt = images.filter((img) => !img.alt).length;
  if (imagesWithoutAlt > 0) {
    issues.push({
      type: "image",
      message: `${imagesWithoutAlt} images missing alt text`,
      severity: "error",
    });
  }

  // Check links
  const links = Array.from(document.links);
  const linksWithoutText = links.filter(
    (link) => !link.textContent.trim()
  ).length;
  if (linksWithoutText > 0) {
    issues.push({
      type: "link",
      message: `${linksWithoutText} links without text`,
      severity: "error",
    });
  }

  // Extract and analyze keywords
  const bodyText = document.body.innerText.toLowerCase();
  const metaKeywords =
    document.querySelector('meta[name="keywords"]')?.content?.toLowerCase() ||
    "";
  const h1Text = document.querySelector("h1")?.innerText.toLowerCase() || "";

  // Create word frequency map
  const words = bodyText.split(/\W+/);
  const wordFrequency = {};
  words.forEach((word) => {
    if (word.length > 3) {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    }
  });

  // Sort keywords by frequency
  const keywords = Object.entries(wordFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word, frequency]) => ({
      word,
      frequency,
      inTitle: title.toLowerCase().includes(word),
      inMetaDescription:
        metaDescription?.content.toLowerCase().includes(word) || false,
      inH1: h1Text.includes(word),
      inMetaKeywords: metaKeywords.includes(word),
    }));

  return {
    title,
    description: metaDescription?.content,
    h1Count: document.querySelectorAll("h1").length,
    imageCount: images.length,
    imagesWithoutAlt,
    linkCount: links.length,
    linksWithoutText,
    keywords,
    issues,
  };
}

function calculateSEOScore(pageData) {
  let score = 100;
  score -= pageData.issues.length * 10;

  const keywordScore = pageData.keywords.reduce((score, keyword) => {
    let keywordScore = 0;
    if (keyword.inTitle) keywordScore += 2;
    if (keyword.inMetaDescription) keywordScore += 2;
    if (keyword.inH1) keywordScore += 1;
    if (keyword.inMetaKeywords) keywordScore += 1;
    return score + keywordScore;
  }, 0);

  score += Math.min(20, keywordScore);

  return Math.max(0, Math.min(100, score));
}

function getStatusClass(value) {
  if (value >= 80) return "card-good";
  if (value >= 60) return "card-warning";
  return "card-error";
}

function updateMetrics(score, issues, keywords) {
  const seoScoreElement = document.getElementById("seo-score");
  const issuesCountElement = document.getElementById("issues-count");
  const keywordsElement = document.getElementById("keywords-list");
  const issuesElement = document.getElementById("issues-list");
  const seoScoreCard = seoScoreElement.closest(".metric-card");
  const issuesCard = issuesCountElement.closest(".metric-card");

  seoScoreElement.textContent = score;
  seoScoreCard.className = "metric-card " + getStatusClass(score);

  const issueCount = issues.length;
  issuesCountElement.textContent = issueCount;
  issuesCard.className = "metric-card " + getStatusClass(100 - issueCount * 20);

  // Update issues list
  if (issuesElement && issues.length > 0) {
    issuesElement.innerHTML = issues
      .map(
        (issue) => `
      <div class="issue-item ${issue.severity}">
        <span class="issue-icon">
          ${issue.severity === "error" ? "❌" : "⚠️"}
        </span>
        <span class="issue-message">${issue.message}</span>
        <span class="issue-type">${issue.type}</span>
      </div>
    `
      )
      .join("");
  } else if (issuesElement) {
    issuesElement.innerHTML =
      '<div class="no-issues">No issues found! 🎉</div>';
  }

  // Update keywords list
  if (keywordsElement) {
    keywordsElement.innerHTML = keywords
      .map(
        (kw) => `
      <div class="keyword-item">
        <span class="keyword-word">${kw.word}</span>
        <span class="keyword-freq">(${kw.frequency})</span>
        <div class="keyword-usage">
          ${kw.inTitle ? '<span class="badge">Title</span>' : ""}
          ${kw.inMetaDescription ? '<span class="badge">Meta</span>' : ""}
          ${kw.inH1 ? '<span class="badge">H1</span>' : ""}
          ${kw.inMetaKeywords ? '<span class="badge">Keywords</span>' : ""}
        </div>
      </div>
    `
      )
      .join("");
  }
}

async function analyzePage() {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: getPageData,
    });

    const pageData = results[0].result;
    const score = calculateSEOScore(pageData);
    updateMetrics(score, pageData.issues, pageData.keywords);
  } catch (error) {
    console.error("Error analyzing page:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializeTabs();
  analyzePage();
  chrome.runtime.sendMessage({ action: "getSummaryData" }, loadSummary);
  chrome.runtime.sendMessage({ action: "analyzePage" }, (response) => {
    if (response) {
      loadHeaders(response.headers);
      loadImages(response.images);
      loadLinks(response.links);
      loadSocial(response.social);
      loadTools(response.url);
    } else {
      console.error("No data received");
    }
  });
});
