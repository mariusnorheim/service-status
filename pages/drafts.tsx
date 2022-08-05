import React from 'react'
import { GetServerSideProps } from 'next'
import Layout from '../components/Layout'
import Post, { PostProps } from '../components/Post'
import Service, { ServiceProps } from '../components/Service'
import { useSession, getSession } from 'next-auth/react'
import prisma from '../lib/prisma'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req })
  
  if (!session) {
    res.statusCode = 403
    return { props: { postDrafts: [], serviceDrafts: [] } }
  }

  const postDrafts = await prisma.post.findMany({
    where: {
      author: { email: session.user.email },
      published: false,
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
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

  const serviceDrafts = await prisma.service.findMany({
    where: {
      author: { email: session.user.email },
      published: false,
    },
    select: {
      id: true,
      name: true,
      description: true,
      endpoint: true,
      auth_login: true,
      auth_password: true,
      displayPriority: true,
      author: {
        select: {
          name: true,
          email: true,
        },
      },
      status: {
        select: {
          id: true,
          message: true,
          code: true,
        },
      },
    },
  })

  return {
    props: JSON.parse(JSON.stringify({ postDrafts, serviceDrafts })),
  }
}

type Props = {
  postDrafts: PostProps[]
  serviceDrafts: ServiceProps[]
}

const Drafts: React.FC<Props> = (props) => {
  const { data: session } = useSession()

  if (!session) {
    return (
      <Layout>
        <h1>My Drafts</h1>
        <div>You need to be authenticated to view this page.</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="page">
        <h1>My Drafts</h1>
        <main>
          <h2>Posts</h2>
          {props.postDrafts.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))}
          <hr />
          <h2>Services</h2>
          {props.serviceDrafts.map((service) => (
            <div key={service.id} className="service">
              <Service service={service} />
            </div>
          ))}
        </main>
      </div>
    </Layout>
  )
}

export default Drafts
