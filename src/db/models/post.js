import mongoose, { Schema } from 'mongoose'

//Post Scheme model in our DataBase
const postScheme = new Schema(
  {
    title: { type: String, required: true },
    author: String,
    contents: String,
    tags: [String],
  },
  { timestamps: true },
)

export const Post = mongoose.model('post', postScheme)
