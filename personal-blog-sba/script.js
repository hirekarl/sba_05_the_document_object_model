import {
  addPostForm,
  titleInput,
  titleError,
  contentTextarea,
  contentError,
  submitButton,
  postsContainer,
  modalForm,
  modalTitleInput,
  modalTitleError,
  modalContentTextarea,
  modalContentError,
  modalCloseButton,
} from "./_constants.js"

import { blogPosts } from "./_dataStructures.js"

import {
  handleSubmitButton,
  handleAddPostForm,
  resetModalForm,
  handleModalForm,
  handleField,
  handlePostsContainer,
  handleModalCloseButton,
} from "./_eventHandlers.js"

document.addEventListener("DOMContentLoaded", main)

function main() {
  blogPosts.deserialize()

  submitButton.disabled = true

  resetModalForm()

  addPostForm.addEventListener("input", handleSubmitButton)
  addPostForm.addEventListener("submit", (event) => handleAddPostForm(event))
  modalForm.addEventListener("submit", (event) => handleModalForm(event))

  titleInput.addEventListener("input", () =>
    handleField(titleInput, titleError, "You must enter a title.")
  )
  contentTextarea.addEventListener("input", () =>
    handleField(contentTextarea, contentError, "You must enter content.")
  )
  modalTitleInput.addEventListener("input", () =>
    handleField(modalTitleInput, modalTitleError, "You must enter a title.")
  )
  modalContentTextarea.addEventListener("input", () =>
    handleField(
      modalContentTextarea,
      modalContentError,
      "You must enter content."
    )
  )
  modalCloseButton.addEventListener("click", () => handleModalCloseButton)

  postsContainer.addEventListener("click", (event) =>
    handlePostsContainer(event)
  )
}
