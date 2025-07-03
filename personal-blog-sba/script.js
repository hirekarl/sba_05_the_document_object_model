const addPostForm = document.getElementById("add-post-form")

const titleInput = document.getElementById("title-input")
const titleError = document.getElementById("title-error")

const contentTextarea = document.getElementById("content-textarea")
const contentError = document.getElementById("content-error")

const posts = document.getElementById("posts")

document.addEventListener("DOMContentLoaded", main)

function main() {
  addPostForm.addEventListener("submit", (event) => handleAddPostForm(event))
  titleInput.addEventListener("blur", handleTitleInput)
  contentTextarea.addEventListener("blur", handleContentTextarea)
}

function handleAddPostForm(event) {
  return
}

function addBlogPost() {
  return
}

function handleTitleInput() {
  return
}

function handleContentTextarea() {
  return
}
