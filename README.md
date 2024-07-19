# Northcoders News API

## Overview

This Northcoders News API provides progrmattic access to data for a news application. This API allows users to interact with topics, articles, comments and users.

[Hosted Version](https://nc-bc-news.onrender.com)


## Getting Started

To get a local copy of this project up and running, follow these steps:

### Prerequisites

- Node.js
- PostgreSQL

### Installation

1. Clone the repo:
   ```bash
   git clone <repo_url>
   cd <repo_directory>
2. Install Dependencies:
   ```bash
    npm install
3. Set-up Databases:
   ```bash
    npm run setup-dbs
4. Seed Databases:
   ```bash
    npm run seed
5. Start the Server:
   ```bash
    npm run dev

### Running Tests

To run the tests, use the following command:
   ```bash
      npm test 
   ```

---

## Getting Started

You need to create two .env files to store your environment variables: .env.development and .env.test. These files should be placed in the root directory of the project.

### .env.development

   ```bash
   PGDATABASE=nc_news
   ```

### .env.test

   ```bash
   PGDATABASE=nc_news_test
   ```

Make sure to replace nc_news and nc_news_test with your actual database names if they are different.

### Additional Tips:

1. **Database setup script**: Ensure that `npm run setup-dbs` and `npm run seed` scripts are defined in your `package.json`.

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
