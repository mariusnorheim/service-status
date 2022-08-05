import React, { useEffect } from 'react'
import type { GetServerSideProps } from 'next'
// import Router from 'next/router'
import Layout from '../components/Layout'
import Service, { ServiceProps } from '../components/Service'
import prisma from '../lib/prisma'

export type StatusProps = {
  endpoint: string
  auth_login: string
  auth_password: string
  status: {
    code: number
    message: string
  }
}

export const getServerSideProps: GetServerSideProps = async () => {
  await updateServices()

  const serviceList = await prisma.service.findMany({
    where: {
      published: true,
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
          code: true,
          message: true,
        },
      },
    },
    orderBy: {
      displayPriority: 'asc',
    },
  })

  return {
    props: { serviceList },
  }
}

type Props = {
  serviceList: ServiceProps[]
}

// Fetch a request
// @param1: string - endpoint url to fetch
async function fetchRequest(endpoint: string) {
  try {
    const request = await fetch(endpoint)
    return request
  } catch (error) {
    console.log(error.message)
  }
}

// Update a status in database
// @param1: number - id (service_id)
// @param2: number - status code
// @param3: string - status text
async function updateStatus(
  id: number,
  code: number,
  message: string
): Promise<void> {
  const baseUrl = process.env.BASE_URL
  const body = { id, code, message }
  if (id != undefined && code != undefined) {
    await fetch(`${baseUrl}/api/status/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  }
}

// Makes a request for each service and updates
// response status code and text in database
async function updateServices() {
  const baseUrl = process.env.BASE_URL
  const serviceRequest = await fetch(`${baseUrl}/api/service`)
  const serviceList = await serviceRequest.json()
  // Iterate services and check for status updates
  for (let i = 0; i < serviceList.length; i++) {
    const service = serviceList[i]
    const id = service.status.id
    const data = await fetchRequest(service.endpoint)
    const code = data?.status || 0
    const message = data?.statusText || 'No data response'
    // Update database if new status code is different
    if (code != service.status.code) {
      await updateStatus(id, code, message)
    }
  }
}

const ServiceList: React.FC<Props> = (props) => {
  // const { data: session } = useSession()
  // const userHasValidSession = Boolean(session)
  // useEffect(() => {
  //   const refreshData = async () => {
  //     await updateServices()
  //   }
  //   const timer = setTimeout(() => {
  //     refreshData
  //   }, 5000)
  //   return () => clearTimeout(timer)
  // }, [])
  return (
    <Layout>
      <div className="page">
        <h1>Services</h1>
        <main>
          {props.serviceList.map((service) => (
            <div key={service.id} className="service">
              <Service service={service} />
            </div>
          ))}
        </main>
      </div>
    </Layout>
  )
}

export default ServiceList
