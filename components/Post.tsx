import React from 'react'
import Router from 'next/router'
import ReactMarkdown from 'react-markdown'

export type PostProps = {
  id: number
  title: string
  content: string
  published: boolean
  createdAt: Date
  author: {
    name: string
    email: string
  } | null
  service: {
    name: string
  } | null
}

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const serviceName = post.service ? post.service.name : 'General'
  return (
    <div onClick={() => Router.push('/post/[id]', `/post/${post.id}`)}>
      <h2>{post.title}</h2>
      <h5>Service: {serviceName}</h5>
      <small>
        {post.createdAt}<br/><br/>
        {/* Authored by {post.author.name}<br/><br/> */}
      </small>
      <ReactMarkdown children={post.content} />
    </div>
  )
}

export default Post
