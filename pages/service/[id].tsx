import React from 'react'
import { GetServerSideProps } from 'next'
import ReactMarkdown from 'react-markdown'
import Layout from '../../components/Layout'
import Router from 'next/router'
import { ServiceProps } from '../../components/Service'
import prisma from '../../lib/prisma'
import { useSession } from 'next-auth/react'

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const service = await prisma.service.findUnique({
    where: {
      id: Number(params?.id) || -1,
    },
    select: {
      id: true,
      name: true,
      description: true,
      endpoint: true,
      auth_login: true,
      auth_password: true,
      displayPriority: true,
      published: true,
      author: {
        select: {
          name: true,
          email: true,
        },
      },
      status: {
        select: {
          id: true,
          code: true,
          message: true,
        },
      },
    },
  })
  
  return {
    props: service,
  }
}

async function publishService(id: number): Promise<void> {
  await fetch(`/api/publish/service/${id}/true`, {
    method: 'PUT',
  })
  await Router.push('/')
}

async function unpublishService(id: number): Promise<void> {
  await fetch(`/api/publish/service/${id}/false`, {
    method: 'PUT',
  })
  await Router.push('/')
}

async function deleteService(id: number): Promise<void> {
  await fetch(`/api/service/${id}`, {
    method: 'DELETE',
  })
  await Router.push('/')
}

const Service: React.FC<ServiceProps> = (props) => {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div>Authenticating ...</div>
  }

  const userHasValidSession = Boolean(session)
  const serviceBelongsToUser = session?.user?.email === props.author?.email
  let name = props.name

  if (!props.published) {
    name = `${name} (Draft)`
  }

  return (
    <Layout>
      <div>
        <h2>{name}</h2>
        <ReactMarkdown children={props.description} />
        <ReactMarkdown children={props.endpoint} />
        <ReactMarkdown children={props.auth_login} />
        <ReactMarkdown children={props.auth_password} />
        {/* <ReactMarkdown children={props.displayPriority.toString()} /> */}
        <ReactMarkdown children={props.status.message} />
        <ReactMarkdown children={props.status.code.toString()}/>
        {/* <p><small>Created by {props?.author?.name || 'Unknown author'}</small></p> */}
        {!props.published && userHasValidSession && serviceBelongsToUser && (
          <button className="btn btn-primary" onClick={() => publishService(props.id)}>Publish</button>
        )}
        {props.published && userHasValidSession && serviceBelongsToUser && (
          <button className="btn btn-primary" onClick={() => unpublishService(props.id)}>Unpublish</button>
        )}
        {userHasValidSession && serviceBelongsToUser && (
          <button className="btn btn-primary" onClick={() => deleteService(props.id)}>Delete</button>
        )}
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

export default Service
