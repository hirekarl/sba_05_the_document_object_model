import { postsContainer } from "./_constants.js"

export const blogPosts = {
  items: [],
  domElement: postsContainer,
  sort: function () {
    // Order by timestamp, descending (most recent first).
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
    const postsArray = this.items.map((post) => post.deconstruct())
    return JSON.stringify(postsArray)
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
