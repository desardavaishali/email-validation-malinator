```markdown
# Email Validation Project

This project validates emails using the Mailinator (free) service. It includes functionality to fetch and validate emails based on their content.

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
- [Test Data](#test-data)
- [Postman Collection](#postman-collection)
- [Configuration](#configuration)



## Introduction

### Why Use Mailinator?

Mailinator provides a robust and reliable API for temporary email services, allowing you to test email-related functionalities efficiently. Here are some reasons why Mailinator is preferred over scraping:

- **Reliability:** Mailinator's API offers a stable and consistent way to interact with temporary email services, reducing the likelihood of broken or unreliable scraping.
- **Compliance:** Scraping email content can violate terms of service of various email providers and may lead to legal issues. Mailinator provides a legitimate API for accessing emails, ensuring compliance with its usage policies.
- **Ease of Use:** Mailinator’s API simplifies the process of fetching and validating emails with well-defined endpoints and authentication mechanisms, whereas scraping requires handling HTML parsing, dealing with dynamic content, and maintaining complex scraping scripts.

### About Mailinator’s Postman Collection

Mailinator provides a Postman collection that includes various endpoints for interacting with their API. This collection allows users to test and explore Mailinator’s API responses conveniently. You can use the Postman collection to understand the API’s capabilities and tailor your implementation accordingly.

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/desardavaishali/email-validation-malinator.git
   cd email-validation-project
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

## Usage

To run the email validation script:

```sh
npm run start
```

To run the tests:

```sh
npm test
```

## Test Data

Place your test data in a file named `testData.json` in the root directory. Example structure:

```json
{
  "loginUserName": "testuser@example.com"
}
```

## Postman Collection

Mailinator provides a Postman collection for testing their API. You can import the collection into Postman to explore and test the API endpoints used in this project. This collection includes:

- **Get Inboxes:** Retrieve a list of inboxes.
- **Get Messages:** Fetch messages from a specific inbox.
- **Get Message Content:** Retrieve the content of a specific message.

To use the Postman collection:

1. Download the Postman collection from Mailinator's [Postman Collection](https://www.mailinator.com/postman-collection) page.
2. Import the collection into Postman.
3. Configure the collection with your Mailinator API key.
4. Explore and test the various endpoints.

## Configuration

Before running the project, you need to configure your Mailinator API details:

1. **API Key:** Obtain your API key from your Mailinator account settings.
2. **Domain Name:** Specify the domain name you are using in Mailinator.
3. **Inbox Name:** Provide the inbox name you want to use.

Update these values in your `emailValidation.ts` file:

```typescript
const apiKey = 'your_api_key';  // Replace with your Mailinator API key
const inboxName = 'your_inbox_name';  // Replace with your inbox name
const domains = 'your_domain';  // Replace with your Mailinator domain
```

Make sure to replace the placeholders with your actual Mailinator details.
