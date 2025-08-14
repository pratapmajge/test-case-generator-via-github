# Test Case Generator 🚀

An AI-powered **Test Case Generator** web application that integrates with GitHub. Users can select code files from a repository, generate **test case summaries**, and then generate **full test code**. Built with **React** (frontend) and **Node.js** (backend).

---

## Features

- GitHub OAuth login
- List and select files from a repository
- AI-generated test case summaries
- Generate full unit test code for selected summaries
- Copy generated test code to clipboard
- Dark/Light mode globally
- Clean and intuitive UI/UX

---

## Tech Stack

- **Frontend:** React, Bootstrap, React Icons, React Router
- **Backend:** Node.js, Express.js
- **AI Integration:** OpenAI GPT API (gpt-4o-mini)
- **Authentication:** GitHub OAuth via Passport.js

---

## Getting Started

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd <your-repo-folder>

backend:
cd backend
npm install

frontend:
cd frontend
npm install

Create a .env file in the backend folder:
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
OPENAI_API_KEY=your_openai_api_key
SESSION_SECRET=some_secret_key


```
Usage
Click Login with GitHub.
Select a repository from the dropdown.
Select the files you want to generate test cases for.
Click Generate Summaries → summaries will appear on the right panel.
Click Generate Code for any summary to get the full test code.
Copy test code using the Copy button.

## SCREENSHOTS

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/d5b82d85-729c-4575-976c-a80656f0c67c" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/7b8222a9-6750-4989-8a80-bf143fcce057" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/b621d11a-3377-4404-9ae0-fcebbc162166" />


