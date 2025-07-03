# SBA 5: The Document Object Model

[Karl Johnson](https://github.com/hirekarl)  
2025-RTT-30  
<time datetime="2025-07-03">2025-07-03</time>  

![Alt text for preview image goes here.]()

## Overview
### Viewer Instructions
Go to []() to view the app in deployment, or view submission source code below.


### Submission Source
- **HTML**: [`./personal-blog-sba/index.html`](./personal-blog-sba/index.html)
- **JavaScript**: [`./personal-blog-sba/script.js`](./personal-blog-sba/script.js)
- **CSS**: [`./personal-blog-sba/styles.css`](./personal-blog-sba/styles.css)

### Reflection
Reflect on your development process, challenges faced, and how you overcame them.
>

## Assignment Instructions
In this Skills-Based Assessment (SBA), you will develop an “Interactive Personal Blog Platform” from scratch.

This project will test your ability to manipulate the DOM, handle user events, implement form validation, and utilize `localStorage` for data persistence.

The primary focus is on client-side JavaScript functionality to create a dynamic and interactive web application. While the appearance of the application is important, the focus is on the JavaScript functionality, so do not spend too much time on styling.

### Scenario
Imagine you are building a personal project: a simple, client-side only blog or journal platform. You want to be able to quickly jot down thoughts, save them, view them later, and manage your entries directly in your browser without needing a backend database. The application should be user-friendly and provide a seamless experience for managing your posts.

### Requirements
Your Interactive Personal Blog Platform must include the following features:

#### 1. Create New Posts:
- [ ] A form with fields for a post title and post content (e.g., using `<input type="text">` for title and `<textarea>` for content).
- [ ] Upon submission, the new post should be added to a list of posts displayed on the page.
- [ ] The form should be validated: both title and content are required.
- [ ] Display custom, user-friendly error messages if validation fails.

#### 2. Display Posts:
- [ ] All created posts should be displayed on the page. Each displayed post should clearly show its title and content.
- [ ] Posts should be rendered dynamically using JavaScript.

#### 3. Edit Posts:
- [ ] Each displayed post should have an “Edit” button.
- [ ] Clicking “Edit” should allow the user to modify the title and content of that specific post. This might involve populating the main form (or a modal form) with the existing post data.
- [ ] After editing, the updated post should be reflected in the display.
- [ ] Form validation should also apply during editing.

#### 4. Delete Posts:
- [ ] Each displayed post should have a “Delete” button.
- [ ] Clicking “Delete” should remove the post from the display and from `localStorage`.

#### 5. Data Persistence with `localStorage`:
- [ ] All blog posts (title, content, and perhaps a unique ID and timestamp you generate) must be saved in `localStorage`.
- [ ] When the page is loaded or refreshed, any posts previously saved in `localStorage` should be retrieved and displayed.
- [ ] Updates (from edits) and deletions must also be reflected in `localStorage`.