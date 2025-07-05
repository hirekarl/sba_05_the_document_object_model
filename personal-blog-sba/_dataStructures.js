import { postsContainer } from "./_constants.js"

export const blogPosts = {
  posts: [],
  domElement: postsContainer,
  sort: function () {
    // Order by timestamp, descending (most recent first).
    this.posts.sort((a, b) => {
      return b.timestamp - a.timestamp
    })
  },
  display: function () {
    this.domElement.textContent = ""
    this.sort()

    const postsDocFrag = new DocumentFragment()

    this.posts.forEach((post) => postsDocFrag.appendChild(post.domElement))
    this.domElement.appendChild(postsDocFrag)
  },
  addNewPost: function (title, content, timestamp = Date.now()) {
    const postToAdd = new Post(title, content, timestamp)
    postToAdd.createHtml()
    this.posts.push(postToAdd)
    this.save()
  },
  getPostById: function (postId) {
    return this.posts.find((post) => post.id === postId)
  },
  editPost: function (postId, newTitle, newContent) {
    const postToEdit = this.getPostById(postId)
    if (
      newTitle.trim() !== postToEdit.title ||
      newContent.trim() !== postToEdit.content
    ) {
      postToEdit.title = newTitle.trim()
      postToEdit.content = newContent.trim()
      postToEdit.createHtml()
      this.save()
    }
  },
  removePost: function (postId) {
    const postToRemove = this.getPostById(postId)
    postToRemove.domElement.remove()
    this.posts.splice(this.posts.indexOf(postToRemove), 1)
    this.save()
  },
  deserialize: function () {
    const postsJson = localStorage.getItem("posts")
    if (postsJson) {
      const postsArray = JSON.parse(postsJson)
      postsArray.forEach((post) => {
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
    return JSON.stringify(this.posts.map((post) => post.deconstruct()))
  },
  save: function () {
    try {
      localStorage.setItem("posts", this.serialize())
    } catch (error) {
      console.error("Couldn't save to local storage:", error)
    }
  },
}

export class Post {
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
    postEditButton.setAttribute("aria-label", "Edit.")
    postEditButton.dataset.bsToggle = "modal"
    postEditButton.dataset.bsTarget = "#modal"
    postEditButton.classList.add(
      "post-edit-button",
      "btn",
      "btn-sm",
      "btn-warning"
    )
    postEditButton.innerHTML = '<i class="bi bi-pencil-square"></i> Edit'
    postButtons.appendChild(postEditButton)

    const postDeleteButton = document.createElement("button")
    postDeleteButton.type = "button"
    postDeleteButton.setAttribute("aria-label", "Delete.")
    postDeleteButton.classList.add(
      "post-delete-button",
      "btn",
      "btn-sm",
      "btn-danger"
    )
    postDeleteButton.innerHTML = '<i class="bi bi-trash"></i> Delete'
    postButtons.appendChild(postDeleteButton)
  }

  displayDate() {
    return Intl.DateTimeFormat("en-US", {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "America/New_York",
    }).format(this.timestamp)
  }

  deconstruct() {
    return {
      title: this.title,
      content: this.content,
      timestamp: this.timestamp,
    }
  }
}
