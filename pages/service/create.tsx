import React, { useState } from 'react'
import Layout from '../../components/Layout'
import Router from 'next/router'

const serviceDraft: React.FC = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState<string | null>('')
  const [endpoint, setEndpoint] = useState('')
  const [auth_login, setAuthLogin] = useState<string | null>('')
  const [auth_password, setAuthPassword] = useState<string | null>('')
  const [displayPriority, setDisplayPriority] = useState<number>()

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      const body = {
        name,
        description,
        endpoint,
        auth_login,
        auth_password,
        displayPriority,
      }
      await fetch(`/api/service`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      await Router.push('/drafts')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Layout>
      <div>
        <form onSubmit={submitData}>
          <h1>New service - Draft</h1>
          <input
            autoFocus
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            type="text"
            value={name}
          />
          <textarea
            cols={50}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows={4}
            value={description}
          />
          <input
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="https://"
            type="text"
            value={endpoint}
          />
          <input
            onChange={(e) => setAuthLogin(e.target.value)}
            placeholder="Authentication username"
            type="text"
            value={auth_login}
          />
          <input
            onChange={(e) => setAuthPassword(e.target.value)}
            placeholder="Authentication password"
            type="text"
            value={auth_password}
          />
          <input
            onChange={(e) => setDisplayPriority(e.target.valueAsNumber)}
            placeholder="Display priority"
            type="number"
            value={displayPriority}
          />
          <input
            disabled={!name || !endpoint || !displayPriority}
            type="submit"
            value="Create"
          />
          <a className="back" href="#" onClick={() => Router.push('/')}>
            or Cancel
          </a>
        </form>
      </div>
      <style jsx>{`
        input[type='text'],
        input[type='number'],
        textarea {
          width: 100%;
          padding: 0.5rem;
          margin: 0.5rem 0;
          border-radius: 0.25rem;
          border: 0.125rem solid rgba(0, 0, 0, 0.2);
        }

        input[type='submit'] {
          background: #ececec;
          border: 0;
          padding: 1rem 2rem;
        }

        .back {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  )
}

export default serviceDraft
