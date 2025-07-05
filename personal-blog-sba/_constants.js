export const addPostForm = document.getElementById("add-post-form")
export const titleInput = document.getElementById("title-input")
export const titleError = document.getElementById("title-error")
export const contentTextarea = document.getElementById("content-textarea")
export const contentError = document.getElementById("content-error")
export const submitButton = document.getElementById("submit-button")
export const postsContainer = document.getElementById("posts")
export const modal = new bootstrap.Modal(document.getElementById("modal"), {
  focus: true,
  keyboard: true,
})
export const modalForm = document.getElementById("modal-form")
export const modalTitleInput = document.getElementById("modal-title-input")
export const modalTitleError = document.getElementById("modal-title-error")
export const modalContentTextarea = document.getElementById(
  "modal-content-textarea"
)
export const modalContentError = document.getElementById("modal-content-error")
export const modalCloseButton = document.getElementById("modal-close-button")
export const modalSaveButton = document.getElementById("modal-save-button")
