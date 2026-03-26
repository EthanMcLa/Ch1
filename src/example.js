import { initDatabase } from './db/init.js'
import { Post } from './db/models/post.js'

await initDatabase()

const post = new Post({
  title: 'Hello',
  author: 'Daniel Bugs',
  contents: 'This post is stored in a mongoDb',
  tags: ['mongoose', 'mongodb'],
})

const createdPost = await post.save() //Saving to the Db

const posts = await Post.find()

console.log(posts)

await Post.findByIdAndUpdate(createdPost._id, {
  $set: { title: 'Hello' },
})
