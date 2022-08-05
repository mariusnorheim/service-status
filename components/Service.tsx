import React from 'react'
// import Router from 'next/router'
// import ReactMarkdown from 'react-markdown'

export type ServiceProps = {
  id: number
  name: string
  description: string | null
  endpoint: string
  auth_login: string | null
  auth_password: string | null
  displayPriority: number
  published: boolean
  authorId: number | null
  author: {
    name: string
    email: string
  }
  status: {
    id: number
    code: number
    message: string
  }
}

const Service: React.FC<{ service: ServiceProps }> = ({ service }) => {
  // onClick={() => Router.push('/service/[id]', `/service/${service.id}`)}
  const code = service.status?.code || 0

  const serviceStatus = () => {
    let retval = <span className="alert-primary">No status</span>
    if (code != null) {
      if (code === 200) {
        retval = <span className="alert-success">Operational</span>
      } else {
        retval = <span className="alert-danger">Issue</span>
      }
    }
    return retval
  }

  return (
    <React.Fragment>
      <div className="accordion" id={`accordionService${service.id}`}>
        <div className="accordion-item">
          <h2 className="accordion-header" id={`accordionHeading${service.id}`}>
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapseService${service.id}`}
                aria-expanded="true"
                aria-controls={`collapseService${service.id}`}
              >
                <div className="row">
                  <div className="col-md-8">{service.name}</div>
                  <div className="col-md-4">{serviceStatus()}</div>
                </div>
              </button>
          </h2>
          <div
            id={`collapseService${service.id}`}
            className="accordion-collapse collapse"
            data-bs-target={`accordionService${service.id}`}
            aria-labelledby={`accordionHeading${service.id}`}
          >
            <div className="accordion-body">
              <div className="row">
                <div className="col-md-5">Endpoint</div>
                <div className="col-md-2">Status</div>
                <div className="col-md-5">Message</div>
              </div>
              <div className="row">
                <div className="col-md-5">{service.endpoint}</div>
                <div className="col-md-2">{service.status?.code || 0}</div>
                <div className="col-md-5">{service.status?.message || 'No status'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div onClick={() => Router.push('/service/[id]', `/service/${service.id}`)}>
      <h2>{service.name}</h2>
      <ReactMarkdown children={service.description} />
      <ReactMarkdown children={service.endpoint} />
      <ReactMarkdown children={service.auth_login} />
      <ReactMarkdown children={service.auth_password} />
      <ReactMarkdown children={service.displayPriority.toString()} />
      <ReactMarkdown children={service.status.message} />
      <ReactMarkdown children={service.status.code.toString()} />
    </div> */}
    </React.Fragment>
  )
}

export default Service
