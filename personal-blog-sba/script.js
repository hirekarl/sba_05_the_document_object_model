/**********************
 * HTML DOM Constants *
 **********************/

const addPostForm = document.getElementById("add-post-form")

const titleInput = document.getElementById("title-input")
const titleError = document.getElementById("title-error")

const contentTextarea = document.getElementById("content-textarea")
const contentError = document.getElementById("content-error")

const submitButton = document.getElementById("submit-button")
const postsContainer = document.getElementById("posts")

const modal = new bootstrap.Modal(document.getElementById("modal"), {
  focus: true,
  keyboard: true,
})
const modalForm = document.getElementById("modal-form")

const modalTitleInput = document.getElementById("modal-title-input")
const modalTitleError = document.getElementById("modal-title-error")

const modalContentTextarea = document.getElementById("modal-content-textarea")
const modalContentError = document.getElementById("modal-content-error")

const modalSaveButton = document.getElementById("modal-save")

/*****************
 * Main Behavior *
 *****************/

document.addEventListener("DOMContentLoaded", main)

function main() {
  blogPosts.deserialize()

  submitButton.disabled = true

  addPostForm.addEventListener("input", handleSubmitButton)
  addPostForm.addEventListener("submit", (event) => handleAddPostForm(event))

  titleInput.addEventListener("input", handleTitleInput)
  contentTextarea.addEventListener("input", handleContentTextarea)

  postsContainer.addEventListener("click", (event) =>
    handlePostsContainer(event)
  )

  modalForm.addEventListener("submit", (event) => handleModalForm(event))

  modalTitleInput.addEventListener("input", handleModalTitleInput, true)
  modalContentTextarea.addEventListener(
    "input",
    handleModalContentTextarea,
    true
  )
}

/*******************
 * Data Structures *
 *******************/

const blogPosts = {
  items: [],
  domElement: postsContainer,
  sort: function () {
    // Display the most recent posts first
    this.items.sort((a, b) => {
      return b.timestamp - a.timestamp
    })
  },
  display: function () {
    this.domElement.textContent = ""
    this.sort()

    const postsDocFrag = new DocumentFragment()

    this.items.forEach((post) => postsDocFrag.appendChild(post.domElement))
    this.domElement.appendChild(postsDocFrag)
  },
  addNewPost: function (title, content, timestamp = Date.now()) {
    let post = new Post(title, content, timestamp)
    post.createHtml()
    this.items.push(post)
    this.save()
  },
  getPostById: function (postId) {
    const post = this.items.find((post) => post.id === postId)
    return post
  },
  editPost: function (postId, newTitle, newContent) {
    const postToEdit = this.getPostById(postId)
    postToEdit.title = newTitle
    postToEdit.content = newContent
    postToEdit.createHtml()
    this.save()
  },
  removePost: function (postId) {
    let postToRemove = this.getPostById(postId)
    postToRemove.domElement.remove()
    this.items.splice(this.items.indexOf(postToRemove), 1)
    this.save()
    postToRemove = null
  },
  deserialize: function () {
    const postsJson = localStorage.getItem("posts")
    if (postsJson && postsJson != "") {
      const posts = JSON.parse(postsJson)
      posts.forEach((post) => {
        this.addNewPost(post.title, post.content, post.timestamp)
        this.display()
      })
    } else {
      try {
        localStorage.setItem("posts", JSON.stringify([]))
      } catch (error) {
        console.error("Couldn't save to local storage:", error)
      }
    }
  },
  serialize: function () {
    const postsJson = this.items.map((post) => post.deconstruct())
    return JSON.stringify(postsJson)
  },
  save: function () {
    const postsJson = this.serialize()
    try {
      localStorage.setItem("posts", postsJson)
    } catch (error) {
      console.error("Couldn't save to local storage:", error)
    }
  },
}

class Post {
  static nextId = 0

  constructor(title, content, timestamp) {
    this.id = Post.nextId++
    this.domElement = document.createElement("article")
    this.title = title.trim()
    this.content = content.trim()
    this.timestamp = timestamp
  }

  createHtml() {
    this.domElement.textContent = ""

    this.domElement.dataset.id = this.id.toString()
    this.domElement.classList.add("post", "mb-3")

    const card = document.createElement("div")
    card.classList.add("card")
    this.domElement.appendChild(card)

    const cardBody = document.createElement("div")
    cardBody.classList.add("card-body")
    card.appendChild(cardBody)

    const postTitle = document.createElement("h3")
    postTitle.classList.add("post-title", "card-title", "fs-5")
    postTitle.textContent = this.title
    cardBody.appendChild(postTitle)

    const postTimestamp = document.createElement("p")
    postTimestamp.classList.add("post-timestamp")
    postTimestamp.innerHTML = `<em>Published ${this.displayDate()}</em>`
    cardBody.appendChild(postTimestamp)

    const postContent = document.createElement("div")
    postContent.classList.add("post-content", "card-text", "mb-3")
    postContent.textContent = this.content
    cardBody.appendChild(postContent)

    const postButtons = document.createElement("div")
    postButtons.classList.add("btn-group")
    cardBody.appendChild(postButtons)

    const postEditButton = document.createElement("button")
    postEditButton.type = "button"
    postEditButton.dataset.bsToggle = "modal"
    postEditButton.dataset.bsTarget = "#modal"
    postEditButton.classList.add(
      "post-edit-button",
      "btn",
      "btn-sm",
      "btn-warning"
    )
    postEditButton.innerHTML = `<i class="bi bi-pencil-square"></i> Edit`
    postButtons.appendChild(postEditButton)

    const postDeleteButton = document.createElement("button")
    postDeleteButton.type = "button"
    postDeleteButton.classList.add(
      "post-delete-button",
      "btn",
      "btn-sm",
      "btn-danger"
    )
    postDeleteButton.innerHTML = `<i class="bi bi-trash"></i> Delete`
    postButtons.appendChild(postDeleteButton)
  }

  displayDate() {
    const dateOptions = {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "America/New_York",
    }

    return Intl.DateTimeFormat("en-US", dateOptions).format(this.timestamp)
  }

  deconstruct() {
    return {
      title: this.title,
      content: this.content,
      timestamp: this.timestamp,
    }
  }
}

/******************
 * Event Handlers *
 ******************/

function handleSubmitButton() {
  if (addPostForm.checkValidity()) submitButton.disabled = false
  else submitButton.disabled = true
}

function handleAddPostForm(event) {
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

function handleTitleInput() {
  titleInput.removeAttribute("aria-describedby")
  titleInput.classList.remove("is-valid", "is-invalid")
  titleInput.setCustomValidity("")
  titleError.textContent = ""
  if (titleInput.validity.valueMissing) {
    titleInput.setCustomValidity("You must enter a title.")
    titleError.textContent = titleInput.validationMessage
    titleInput.setAttribute("aria-describedby", "title-error")
    titleInput.classList.add("is-invalid")
  } else {
    titleInput.classList.add("is-valid")
  }
}

function handleContentTextarea() {
  contentTextarea.removeAttribute("aria-describedby")
  contentTextarea.classList.remove("is-valid", "is-invalid")
  contentTextarea.setCustomValidity("")
  contentError.textContent = ""
  if (contentTextarea.validity.valueMissing) {
    contentTextarea.setCustomValidity("You must enter content.")
    contentError.textContent = contentTextarea.validationMessage
    contentTextarea.setAttribute("aria-describedby", "content-error")
    contentTextarea.classList.add("is-invalid")
  } else {
    contentTextarea.classList.add("is-valid")
  }
}

function handlePostsContainer(event) {
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

function handleModalTitleInput() {
  modalTitleInput.removeAttribute("aria-describedby")
  modalTitleInput.classList.remove("is-valid", "is-invalid")
  modalTitleInput.setCustomValidity("")
  modalTitleError.textContent = ""
  if (modalTitleInput.validity.valueMissing) {
    modalTitleInput.setCustomValidity("You must enter a title.")
    modalTitleError.textContent = modalTitleInput.validationMessage
    modalTitleInput.setAttribute("aria-describedby", "modal-title-error")
    modalTitleInput.classList.add("is-invalid")
  } else {
    modalTitleInput.classList.add("is-valid")
  }
}

function handleModalContentTextarea() {
  modalContentTextarea.removeAttribute("aria-describedby")
  modalContentTextarea.classList.remove("is-valid", "is-invalid")
  modalContentTextarea.setCustomValidity("")
  modalContentError.textContent = ""
  if (modalContentTextarea.validity.valueMissing) {
    modalContentTextarea.setCustomValidity("You must enter content.")
    modalContentError.textContent = modalContentTextarea.validationMessage
    modalContentTextarea.setAttribute("aria-describedby", "modal-content-error")
    modalContentTextarea.classList.add("is-invalid")
  } else {
    modalContentTextarea.classList.add("is-valid")
  }
}

function handleModalForm(event) {
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
