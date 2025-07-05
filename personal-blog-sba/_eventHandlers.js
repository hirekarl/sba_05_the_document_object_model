import {
  addPostForm,
  titleInput,
  contentTextarea,
  submitButton,
  modal,
  modalForm,
  modalTitleInput,
  modalTitleError,
  modalContentTextarea,
  modalContentError,
  modalSaveButton,
} from "./_constants.js"

import { blogPosts } from "./_dataStructures.js"

export function handleSubmitButton() {
  if (addPostForm.checkValidity()) submitButton.disabled = false
  else submitButton.disabled = true
}

export function handleAddPostForm(event) {
  event.preventDefault()

  if (!addPostForm.checkValidity()) {
    event.stopPropagation()
    addPostForm.classList.add("was-validated")

    const firstInvalidField = addPostForm.querySelector(".is-invalid")
    firstInvalidField.focus()

    return
  }

  const addPostFormData = new FormData(addPostForm)
  const title = addPostFormData.get("title")
  const content = addPostFormData.get("content")

  blogPosts.addNewPost(title, content)
  blogPosts.display()
  addPostForm.reset()

  titleInput.classList.remove("is-valid")
  contentTextarea.classList.remove("is-valid")
  submitButton.disabled = true
}

export function resetModalForm() {
  modal.hide()
  modalForm.reset()

  modalForm.classList.remove("was-validated")

  modalTitleInput.classList.remove("is-valid", "is-invalid")
  modalTitleError.textContent = ""
  modalContentTextarea.classList.remove("is-valid", "is-invalid")
  modalContentError.textContent = ""

  modalSaveButton.dataset.postId = ""
}

export function handleModalForm(event) {
  event.preventDefault()
  modalForm.classList.remove("was-validated")

  if (!modalForm.checkValidity()) {
    event.stopPropagation()
    modalForm.classList.add("was-validated")

    const firstInvalidField = modalForm.querySelector(".is-invalid")
    firstInvalidField.focus()

    return
  }

  const postId = parseInt(modalSaveButton.dataset.postId)

  const modalFormData = new FormData(modalForm)
  const newTitle = modalFormData.get("title")
  const newContent = modalFormData.get("content")

  blogPosts.editPost(postId, newTitle, newContent)
  blogPosts.display()

  resetModalForm()
}

export function handleField(field, errorContainer, errorMessage) {
  field.removeAttribute("aria-describedby")
  field.classList.remove("is-valid", "is-invalid")
  field.setCustomValidity("")
  errorContainer.textContent = ""

  if (field.value && field.value.trim() === "") {
    field.setCustomValidity("Can't just be whitespace.")
    errorContainer.textContent = field.validationMessage
    field.setAttribute("aria-describedby", errorContainer.id)
    field.classList.add("is-invalid")
    return
  }

  if (field.validity.valueMissing) {
    field.setCustomValidity(errorMessage)
    errorContainer.textContent = field.validationMessage
    field.setAttribute("aria-describedby", errorContainer.id)
    field.classList.add("is-invalid")
    return
  }

  field.classList.add("is-valid")
}

export function handleModalCloseButton() {
  resetModalForm()
}

export function handlePostsContainer(event) {
  resetModalForm()

  const postArticle = event.target.closest("article")
  const postId = parseInt(postArticle.dataset.id)
  const closestButton = event.target.closest("button")

  if (closestButton) {
    if (closestButton.classList.contains("post-edit-button")) {
      const post = blogPosts.getPostById(postId)
      modalTitleInput.value = post.title
      modalContentTextarea.value = post.content
      modalSaveButton.dataset.postId = post.id.toString()
      modal.show()
    }
    if (closestButton.classList.contains("post-delete-button")) {
      blogPosts.removePost(postId)
    }
  }
}
