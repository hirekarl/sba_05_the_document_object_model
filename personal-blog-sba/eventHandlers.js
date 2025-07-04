import {
  addPostForm,
  titleInput,
  contentTextarea,
  submitButton,
  modal,
  modalForm,
  modalTitleInput,
  modalContentTextarea,
  modalSaveButton,
} from "./constants.js"

import { blogPosts } from "./dataStructures.js"

export function handleSubmitButton() {
  if (addPostForm.checkValidity()) submitButton.disabled = false
  else submitButton.disabled = true
}

export function handleAddPostForm(event) {
  event.preventDefault()

  if (!addPostForm.checkValidity()) {
    event.stopPropagation()
    addPostForm.classList.add("was-validated")
    return
  }

  const addPostFormData = new FormData(addPostForm)
  const title = addPostFormData.get("title")
  const content = addPostFormData.get("content")

  blogPosts.addNewPost(title, content)
  blogPosts.display()
  addPostForm.reset()

  addPostForm.classList.remove("was-validated")
  titleInput.classList.remove("is-valid")
  contentTextarea.classList.remove("is-valid")
  submitButton.disabled = true
}

export function handleModalForm(event) {
  event.preventDefault()

  if (!modalForm.checkValidity()) {
    event.stopPropagation()
    modalForm.classList.add("was-validated")
    return
  }

  modalForm.classList.add("was-validated")

  const postId = parseInt(modalSaveButton.dataset.target)

  const modalFormData = new FormData(modalForm)
  const newTitle = modalFormData.get("title")
  const newContent = modalFormData.get("content")

  modal.hide()

  blogPosts.editPost(postId, newTitle, newContent)
  blogPosts.display()
}

export function handleField(field, errorContainer, errorMessage) {
  field.removeAttribute("aria-describedby")
  field.classList.remove("is-valid", "is-invalid")
  field.setCustomValidity("")
  errorContainer.textContent = ""

  if (field.validity.valueMissing) {
    field.setCustomValidity(errorMessage)
    errorContainer.textContent = field.validationMessage
    field.setAttribute("aria-describedby", errorContainer.id)
    field.classList.add("is-invalid")
  } else {
    field.classList.add("is-valid")
  }
}

export function handlePostsContainer(event) {
  modal.hide()

  modalTitleInput.value = ""
  modalContentTextarea.textContent = ""
  modalSaveButton.dataset.target = ""

  const postArticle = event.target.closest("article")
  const postId = parseInt(postArticle.dataset.id)
  const closestButton = event.target.closest("button")

  if (closestButton.classList.contains("post-edit-button")) {
    const post = blogPosts.getPostById(postId)
    modalTitleInput.value = post.title
    modalContentTextarea.textContent = post.content
    modalSaveButton.dataset.target = post.id.toString()
    modal.show()
  }
  if (closestButton.classList.contains("post-delete-button")) {
    blogPosts.removePost(postId)
  }
}
