import React from 'react'
import type { GetServerSideProps } from 'next'
import Layout from '../components/Layout'
import Post, { PostProps } from '../components/Post'
import prisma from '../lib/prisma'

export const getServerSideProps: GetServerSideProps = async () => {
  const postList = await prisma.post.findMany({
    where: {
      published: true,
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
      service: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      id: 'desc',
    },
  })
  
  return {
    props: JSON.parse(JSON.stringify({ postList })),
  }
}

type Props = {
  postList: PostProps[]
}

const PostFeed: React.FC<Props> = (props) => {
  return (
    <Layout>
      <div className="page">
        <h1>Public Feed</h1>
        <main>
          {props.postList.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))}
        </main>
      </div>
    </Layout>
  )
}

export default PostFeed
