const addPostForm = document.getElementById("add-post-form")

const titleInput = document.getElementById("title-input")
const titleError = document.getElementById("title-error")

const contentTextarea = document.getElementById("content-textarea")
const contentError = document.getElementById("content-error")

const submitButton = document.getElementById("submit-button")

const posts = document.getElementById("posts")

document.addEventListener("DOMContentLoaded", main)

function main() {
  addPostForm.addEventListener("change", handleSubmitButton)
  addPostForm.addEventListener("submit", (event) => handleAddPostForm(event))
  titleInput.addEventListener("input", handleTitleInput)
  contentTextarea.addEventListener("input", handleContentTextarea)
}

function handleSubmitButton() {
  if (addPostForm.checkValidity()) submitButton.disabled = false
  else submitButton.disabled = true
}

function handleAddPostForm(event) {
  return
}

function addBlogPost() {
  return
}

function handleTitleInput() {
  titleInput.classList.remove("is-valid", "is-invalid")
  titleInput.setCustomValidity("")
  titleError.textContent = ""
  if (titleInput.validity.valueMissing) {
    titleInput.setCustomValidity("You must enter a title.")
    titleError.textContent = titleInput.validationMessage
    titleInput.classList.add("is-invalid")
  } else {
    titleInput.classList.add("is-valid")
  }
}

function handleContentTextarea() {
  contentTextarea.classList.remove("is-valid", "is-invalid")
  contentTextarea.setCustomValidity("")
  contentError.textContent = ""
  if (contentTextarea.validity.valueMissing) {
    contentTextarea.setCustomValidity("You must enter content.")
    contentError.textContent = contentTextarea.validationMessage
    contentTextarea.classList.add("is-invalid")
  } else {
    contentTextarea.classList.add("is-valid")
  }
}
