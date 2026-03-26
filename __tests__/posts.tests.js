import mongoose from 'mongoose'
import { describe, test, expect, beforeEach } from '@jest/globals'
import {
  createPost,
  listAllPosts,
  listAllPostsByTags,
  getPostById,
  deletePost,
  updatePost,
} from '../src/services/posts.js'
import { Post } from '../src/db/models/post.js'

describe('creating posts', () => {
  test('with all paramets should succes', async () => {
    const post = {
      title: 'Hello Mongoose',
      author: 'Ethan McLaughlin',
      contents: 'I love programming',
      tags: ['mongoose', 'programming'],
    }
    const createdPost = await createPost(post)
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)

    const foundPost = await Post.findById(createdPost._id)
    expect(foundPost).toEqual(expect.objectContaining(post))
    expect(foundPost.createdAt).toBeInstanceOf(Date)
    expect(foundPost.title).toEqual('Hello Mongoose')
    expect(foundPost.author).toBe('Ethan McLaughlin')
    expect(foundPost.contents).toBe('I love programming')
    expect(foundPost.updatedAt).toBeInstanceOf(Date)
  })
  test('without title should fail', async () => {
    const post = {
      author: 'Big E',
      contents: 'Post wiht no titel',
      tags: ['empty'],
    }
    try {
      await createPost(post)
    } catch (erro) {
      expect(erro).toBeInstanceOf(mongoose.Error.ValidationError)
      expect(erro.message).toContain('`title` is required')
    }
  })
})

const samplePosts = [
  { title: 'Learning Redux', author: 'Daniel Bugl', tags: ['redux'] },
  { title: 'Learn React Hooks', author: 'Daniel Bugl', tags: ['react'] },
  {
    title: 'Full-Stack React Projects',
    author: 'Daniel Bugl',
    tags: ['react', 'node.js'],
  },
  { title: 'Guide to Typescript' },
]

let createdSamplePosts = []

beforeEach(async () => {
  await Post.deleteMany(), (createdSamplePosts = [])
  for (const post of samplePosts) {
    const createdPost = new Post(post)
    createdSamplePosts.push(await createdPost.save())
  }
})

describe('listing posts', () => {
  test('should return posts sorted by creation date descending by default', async () => {
    const posts = await listAllPosts()
    const sortedSamplePosts = createdSamplePosts.sort(
      (a, b) => a.createdAt - b.createdAt,
    )
    expect(posts.map((post) => post.createdAt)).toEqual(
      sortedSamplePosts.map((post) => post.createdAt),
    )
  })
  test('should return all posts', async () => {
    const posts = await listAllPosts()
    expect(posts.length).toEqual(createdSamplePosts.length)
  })

  test('list all posts from tags', async () => {
    const posts = await listAllPostsByTags('node.js')
    expect(posts.length).toBe(1)
  })
})

describe('Getting a post by id', () => {
  test('should return the full post', async () => {
    const post = await getPostById(createdSamplePosts[0]._id)
    expect(post.toObject()).toEqual(createdSamplePosts[0].toObject())
  })
  test('should fail because there is not post', async () => {
    const post = await getPostById('000000000000000000000000')
    expect(post).toEqual(null)
  })
  test('updatePost for a user', async () => {
    await updatePost(createdSamplePosts[0]._id, {
      author: 'Jack',
    })
    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.updatedAt.getTime()).toBeGreaterThan(
      createdSamplePosts[0].updatedAt.getTime(),
    )
  })
})
