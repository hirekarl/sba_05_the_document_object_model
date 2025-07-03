const addPostForm = document.getElementById("add-post-form")

const titleInput = document.getElementById("title-input")
const titleError = document.getElementById("title-error")

const contentTextarea = document.getElementById("content-textarea")
const contentError = document.getElementById("content-error")

const submitButton = document.getElementById("submit-button")

const postsContainer = document.getElementById("posts")

document.addEventListener("DOMContentLoaded", main)

function main() {
  addPostForm.addEventListener("change", handleSubmitButton)
  addPostForm.addEventListener("submit", (event) => handleAddPostForm(event))
  titleInput.addEventListener("input", handleTitleInput)
  contentTextarea.addEventListener("input", handleContentTextarea)
}

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
  },
  editPost: function (postId) {
    // TODO
    return
  },
  removePost: function (postId) {
    let postToRemove = this.items.find((post) => post.id === parseInt(postId))
    postToRemove.domElement.remove()
    this.items.splice(this.items.indexOf(postToRemove), 1)
    postToRemove = null
  },
  deserialize: function () {
    const postsJson = localStorage.getItem("posts")
    if (postsJson && postsJson != "") {
      const posts = JSON.parse(postsJson)
      posts.forEach((post) => {
        this.addNewPost(post.title, post.content, post.timestamp)
      })
    } else {
      try {
        localStorage.setItem("posts", "")
      } catch (error) {
        console.error("Couldn't save to local storage:", error)
      }
    }
  },
  serialize: function () {
    const postsJson = this.items.map((post) =>
      JSON.stringify(post.deconstruct())
    )
    return postsJson
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
    this.id = nextId++
    this.domElement = document.createElement("article")
    this.title = title.trim()
    this.content = content.trim()
    this.timestamp = timestamp
  }

  createHtml() {
    this.domElement.dataset.id = this.id.toString()
    this.domElement.classList.add("post", "mb-3")

    const card = document.createElement("div")
    card.classList.add("card")

    const cardBody = document.createElement("div")
    cardBody.classList.add("card-body")
    card.appendChild(cardBody)

    const postTitle = document.createElement("h3")
    postTitle.classList.add("post-title", "card-title", "fs-5")
    postTitle.textContent = this.title
    cardBody.appendChild(postTitle)

    const postTimestamp = document.createElement("p")
    postTimestamp.classList.add("post-timestamp")
    postTimestamp.innerHTML = `<em>${this.displayDate()}</em>`
    cardBody.appendChild(postTimestamp)

    const postContent = document.createElement("div")
    postContent.classList.add("post-content", "card-text", "mb-3")
    postContent.textContent = this.content
    cardBody.appendChild(postContent)

    const postEditButton = document.createElement("button")
    postEditButton.type = "button"
    postEditButton.classList.add(
      "post-edit-button",
      "btn",
      "btn-sm",
      "btn-warning"
    )
    postEditButton.innerHTML = `<i class="bi bi-pencil-square"></i> Edit`
    cardBody.appendChild(postEditButton)

    const postDeleteButton = document.createElement("button")
    postDeleteButton.type = "button"
    postDeleteButton.classList.add(
      "post-delete-button",
      "btn",
      "btn-sm",
      "btn-danger"
    )
    postDeleteButton.innerHTML = `<i class="bi bi-trash"></i> Delete`
    cardBody.appendChild(postDeleteButton)

    this.domElement.appendChild(card)
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

function handleSubmitButton() {
  if (addPostForm.checkValidity()) submitButton.disabled = false
  else submitButton.disabled = true
}

function handleAddPostForm(event) {
  if (!addPostForm.checkValidity()) {
    event.preventDefault()
    return
  }
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
