// ===== CONFIGURATION =====
const GITHUB_TOKEN = undefined;
const REPO_OWNER = "stevenson-space";
const REPO_NAME = "shs";
const BASE_BRANCH = "main";
const THEMES_DIRECTORY = "src/themes";
const IMAGES_DIRECTORY = `${THEMES_DIRECTORY}/assets/header-images`;
const PARTICLES_DIRECTORY = `${THEMES_DIRECTORY}/assets/particles`;

// ===== MAIN FUNCTION =====
function onFormSubmit(e) {
  try {
    Logger.log("Form submitted, processing...");

    const formResponse = e.response;
    const itemResponses = formResponse.getItemResponses();
    const respondentEmail = formResponse.getRespondentEmail();

    const responses = {};
    for (let i = 0; i < itemResponses.length; i++) {
      const itemResponse = itemResponses[i];
      const question = itemResponse.getItem().getTitle();
      const answer = itemResponse.getResponse();
      responses[question] = answer;
    }

    const timestamp = new Date().getTime();
    const formattedTimestamp = new Date().toLocaleString();

    const formData = {
      timestamp: formattedTimestamp,
      githubAccount: getFormField(responses, "If you have a GitHub account, enter it here."),
      wantCredit: getFormField(responses, "Would you like to be credited for your theme?"),
      authorFormat: getFormField(responses, "Enter your first name and first initial of your last name, with a period at the end."),
      gradYear: getFormField(responses, "What are the last two digits of the year you graduate?"),
      themeJsonUrl: getFormField(responses, "Upload the theme.json file"),
      themeName: getFormField(responses, "What should your theme be named?"),
      description: getFormField(responses, "If you want, add a small description for your theme here."),
      headerImagesUrl: getFormField(responses, "If your theme has header images, upload them here."),
      particleImagesUrl: getFormField(responses, "If your theme has particle images, upload them here."),
      screenshotUrl: getFormField(responses, "Include a full page screenshot of the theme"),
      additionalInfo: getFormField(responses, "If you have any additional info to add, include it here."),
    };

    Logger.log(`Theme name: ${formData.themeName}`);
    Logger.log(`Respondent email: ${respondentEmail}`);

    if (!formData.themeName) {
      throw new Error("Theme name is required");
    }
    if (!formData.themeJsonUrl) {
      throw new Error("Theme JSON file is required");
    }
    if (!formData.screenshotUrl) {
      throw new Error("Screenshot is required");
    }

    const authorName = formData.wantCredit === 'No, I\'d like it to display as "Anonymous"'
      ? "Anonymous"
      : `${formData.authorFormat} ('${formData.gradYear})`;

    Logger.log(`Author: ${authorName}`);

    Logger.log("Downloading theme JSON...");
    const themeJsonFileId = extractFileIdFromUrl(formData.themeJsonUrl);
    validateJsonFile(themeJsonFileId);
    const themeJsonContent = downloadDriveFile(themeJsonFileId);
    const themeJson = JSON.parse(themeJsonContent);

    if (!themeJson.metadata) {
      themeJson.metadata = {};
    }

    themeJson.metadata.name = formData.themeName;
    themeJson.metadata.author = authorName;
    if (formData.description) {
      themeJson.metadata.description = formData.description;
    }

    const sanitizedThemeName = formData.themeName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing dashes

    if (!sanitizedThemeName) {
      throw new Error("Theme name must contain at least one alphanumeric character");
    }

    Logger.log("Creating GitHub branch...");
    const baseSha = getBaseBranchSha();
    const newBranch = `theme-${sanitizedThemeName}-${timestamp}`;
    createBranch(newBranch, baseSha);
    Logger.log(`Branch created: ${newBranch}`);

    Logger.log("Uploading theme JSON...");
    const themeJsonPath = `${THEMES_DIRECTORY}/${sanitizedThemeName}.json`;
    uploadFile(
      themeJsonPath,
      JSON.stringify(themeJson, null, 2),
      newBranch,
      `[AUTOMATED] Add ${formData.themeName} theme`,
    );

    let hasUploadedImages = false;

    if (formData.headerImagesUrl) {
      Logger.log("Uploading header images...");
      const headerUrls = formData.headerImagesUrl.split(',').map(url => url.trim()).filter(url => url);
      Logger.log(`Found ${headerUrls.length} header image(s)`);
      for (let i = 0; i < headerUrls.length; i++) {
        const headerFileId = extractFileIdFromUrl(headerUrls[i]);
        const originalFileName = getFileName(headerFileId);
        const fileExtension = originalFileName.substring(originalFileName.lastIndexOf('.'));
        const headerPath = `${IMAGES_DIRECTORY}/${sanitizedThemeName}-header${i + 1}${fileExtension}`;
        const headerContent = downloadDriveFileAsBase64(headerFileId);
        uploadFileBase64(
          headerPath,
          headerContent,
          newBranch,
          `[AUTOMATED] Add header image ${i + 1} for ${formData.themeName}`,
        );
        hasUploadedImages = true;
      }
    }

    if (formData.particleImagesUrl) {
      Logger.log("Uploading particle images...");
      const particleUrls = formData.particleImagesUrl.split(',').map(url => url.trim()).filter(url => url);
      Logger.log(`Found ${particleUrls.length} particle image(s)`);
      for (let i = 0; i < particleUrls.length; i++) {
        const particleFileId = extractFileIdFromUrl(particleUrls[i]);
        const originalFileName = getFileName(particleFileId);
        const fileExtension = originalFileName.substring(originalFileName.lastIndexOf('.'));
        const particlePath = `${PARTICLES_DIRECTORY}/${sanitizedThemeName}-particle${i + 1}${fileExtension}`;
        const particleContent = downloadDriveFileAsBase64(particleFileId);
        uploadFileBase64(
          particlePath,
          particleContent,
          newBranch,
          `[AUTOMATED] Add particle image ${i + 1} for ${formData.themeName}`,
        );
        hasUploadedImages = true;
      }
    }

    Logger.log("Creating pull request...");
    const prBody = createPRBody(formData, authorName, hasUploadedImages);
    const prNumber = createPullRequest(newBranch, formData.themeName, prBody);
    Logger.log(`PR #${prNumber} created`);

    Logger.log("Adding label to PR...");
    addLabelToPR(prNumber, "theme suggestion");

    if (formData.githubAccount && authorName !== "Anonymous") {
      Logger.log(`Assigning PR to @${formData.githubAccount}`);
      assignUserToPR(prNumber, formData.githubAccount);
    }

    if (respondentEmail) {
      Logger.log(`Sending confirmation email to ${respondentEmail}`);
      const prUrl = `https://github.com/${REPO_OWNER}/${REPO_NAME}/pull/${prNumber}`;
      sendConfirmationEmail(respondentEmail, formData.themeName, prUrl);
    }

    Logger.log("✓ PR created successfully!");
  } catch (error) {
    console.error("Error: " + error);
    console.error("Stack trace: " + error.stack);
  }
}

// ===== HELPER FUNCTIONS =====

function getFormField(responses, fieldName) {
  if (!responses) {
    throw new Error("Form responses are undefined");
  }
  if (!responses[fieldName]) {
    Logger.log(`Warning: Field "${fieldName}" not found in form responses`);
    return "";
  }
  const value = responses[fieldName];
  if (Array.isArray(value)) {
    return value.map(v => String(v).trim()).join(', ');
  }
  return typeof value === 'string' ? value.trim() : String(value).trim();
}

function extractFileIdFromUrl(url) {
  if (!url) {
    throw new Error("URL is required");
  }
  const match = url.match(/[-\w]{25,}/);
  if (!match) {
    throw new Error(`Invalid Google Drive URL: ${url}. Could not extract file ID.`);
  }
  return match[0];
}

function downloadDriveFile(fileId) {
  const file = DriveApp.getFileById(fileId);
  return file.getBlob().getDataAsString();
}

function downloadDriveFileAsBase64(fileId) {
  const file = DriveApp.getFileById(fileId);
  const blob = file.getBlob();
  return Utilities.base64Encode(blob.getBytes());
}

function getFileName(fileId) {
  const file = DriveApp.getFileById(fileId);
  return file.getName();
}

function validateJsonFile(fileId) {
  const file = DriveApp.getFileById(fileId);
  const fileName = file.getName();
  const mimeType = file.getMimeType();

  if (!fileName.toLowerCase().endsWith('.json')) {
    throw new Error(`Invalid file type: ${fileName}. Theme file must be a .json file.`);
  }

  const validMimeTypes = ['application/json', 'text/plain', 'application/octet-stream'];
  if (!validMimeTypes.includes(mimeType)) {
    throw new Error(`Invalid MIME type: ${mimeType}. Expected a JSON file.`);
  }
}

function getBaseBranchSha() {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/refs/heads/${BASE_BRANCH}`;
  const response = UrlFetchApp.fetch(url, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    },
  });
  return JSON.parse(response.getContentText()).object.sha;
}

function createBranch(branchName, baseSha) {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/refs`;
  UrlFetchApp.fetch(url, {
    method: "post",
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    payload: JSON.stringify({
      ref: `refs/heads/${branchName}`,
      sha: baseSha,
    }),
  });
}

function uploadFile(path, content, branch, commitMessage) {
  const encodedContent = Utilities.base64Encode(content);
  uploadFileBase64(path, encodedContent, branch, commitMessage);
}

function uploadFileBase64(path, base64Content, branch, commitMessage) {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;

  UrlFetchApp.fetch(url, {
    method: "put",
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    payload: JSON.stringify({
      message: commitMessage,
      content: base64Content,
      branch: branch,
    }),
  });
}

function createPRBody(formData, authorName, hasUploadedImages) {
  let body = `# Theme Submission: ${formData.themeName}\n\n`;
  body += `## Metadata\n`;
  body += `- **Name:** ${formData.themeName}\n`;
  body += `- **Description:** ${formData.description || "None"}\n`;
  body += `- **Author:** ${authorName}\n`;
  body += `- **GitHub:** ${formData.githubAccount ? `@${formData.githubAccount}` : "None Provided"}\n`;
  body += `- **Timestamp:** ${formData.timestamp}\n`;
  body += `- **Additional Info:** ${formData.additionalInfo ? "Yes, on Google Forms" : "None"}\n`;
  body += `\n`;

  if (authorName === "Anonymous") {
    body += `> Since the author chose to remain anonymous, reviewers should check the Google Form for an email to contact them for edits.\n\n`;
  }

  if (hasUploadedImages) {
    body += `> This theme contains uploaded images. Please rename files and fix paths before merging.\n\n`;
  }

  body += `## Screenshot\n`;
  const screenshotFileId = extractFileIdFromUrl(formData.screenshotUrl);
  body += `![Theme Screenshot](https://drive.google.com/uc?id=${screenshotFileId})\n\n`;

  body += `---\n`;
  body += `*This PR was automatically generated from a Google Form submission.*`;

  return body;
}

function createPullRequest(headBranch, themeName, body) {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/pulls`;

  const response = UrlFetchApp.fetch(url, {
    method: "post",
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    payload: JSON.stringify({
      title: `Theme: ${themeName}`,
      head: headBranch,
      base: BASE_BRANCH,
      body: body,
    }),
  });

  const prData = JSON.parse(response.getContentText());
  return prData.number;
}

function addLabelToPR(prNumber, label) {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues/${prNumber}/labels`;

  UrlFetchApp.fetch(url, {
    method: "post",
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    payload: JSON.stringify({
      labels: [label],
    }),
  });
}

function assignUserToPR(prNumber, githubUsername) {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues/${prNumber}/assignees`;

  UrlFetchApp.fetch(url, {
    method: "post",
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    payload: JSON.stringify({
      assignees: [githubUsername],
    }),
  });
}

function sendConfirmationEmail(recipientEmail, themeName, prUrl) {
  const subject = "Theme Submission Received - stevenson.space";
  const body = `Thank you for submitting a theme to stevenson.space!

Your theme "${themeName}" has been received and a pull request has been created.

To see the progress of your suggestion, view the pull request on GitHub:
${prUrl}

---
This is an automated message. Please do not reply to this email.`;

  MailApp.sendEmail({
    to: recipientEmail,
    subject: subject,
    body: body,
    name: "stevenson.space Theme Submissions",
    noReply: true
  });
}
