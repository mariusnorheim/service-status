import React from 'react'
import { GetServerSideProps } from 'next'
import ReactMarkdown from 'react-markdown'
import Layout from '../../components/Layout'
import Router from 'next/router'
import { PostProps } from '../../components/Post'
import prisma from '../../lib/prisma'
import { useSession } from 'next-auth/react'

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: Number(params?.id) || -1,
    },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
      service: {
        select: {
          name: true,
        },
      },
    },
  })
  
  return {
    props: JSON.parse(JSON.stringify(post)),
  }
}

async function publishPost(id: number): Promise<void> {
  await fetch(`/api/publish/post/${id}/true`, {
    method: 'PUT',
  })
  await Router.push('/')
}

async function unpublishPost(id: number): Promise<void> {
  await fetch(`/api/publish/post/${id}/false`, {
    method: 'PUT',
  })
  await Router.push('/')
}

async function deletePost(id: number): Promise<void> {
  await fetch(`/api/post/${id}`, {
    method: 'DELETE',
  })
  await Router.push('/')
}

const Post: React.FC<PostProps> = (props) => {
  const { data: session, status } = useSession()
  if (status === 'loading') {
    return <div>Authenticating ...</div>
  }
  const userHasValidSession = Boolean(session)
  const postBelongsToUser = session?.user?.email === props.author?.email
  let title = props.title
  if (!props.published) {
    title = `${title} (Draft)`
  }

  return (
    <Layout>
      <div>
        <h2>{title}</h2>
        <div className="post">
          <h5>Service: {props?.service?.name || 'General'}</h5>
          <small>
            {props.createdAt}<br/>
            Authored by {props?.author?.name || 'Unknown author'}<br/><br/>
          </small>
          <p><ReactMarkdown children={props.content} /></p>
          {!props.published && userHasValidSession && postBelongsToUser && (
            <button className="btn btn-primary" onClick={() => publishPost(props.id)}>Publish</button>
          )}
          {props.published && userHasValidSession && postBelongsToUser && (
            <button className="btn btn-primary" onClick={() => unpublishPost(props.id)}>Unpublish</button>
          )}
          {userHasValidSession && postBelongsToUser && (
            <button className="btn btn-primary" onClick={() => deletePost(props.id)}>Delete</button>
          )}
        </div>
      </div>
      <style jsx>{`
        .actions {
          margin-top: 2rem;
        }

        button + button {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  )
}

export default Post
