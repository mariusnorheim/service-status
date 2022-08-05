import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { signOut, useSession } from 'next-auth/react'

const Header: React.FC = () => {
  const router = useRouter()
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname

  const { data: session, status } = useSession()

  let left = (
    <div className="left">
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarToggler"
        aria-controls="navbarToggler"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarToggler">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link href="/">
              <a className="nav-link bold" data-active={isActive('/')}>
                Feed
              </a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/services">
              <a className="nav-link bold" data-active={isActive('/services')}>
                Services
              </a>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )

  let right = null

  if (status === 'loading') {
    left = (
      <div className="left">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarToggler"
          aria-controls="navbarToggler"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarToggler">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link href="/">
                <a className="nav-link bold" data-active={isActive('/')}>
                  Feed
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/services">
                <a
                  className="nav-link bold"
                  data-active={isActive('/services')}
                >
                  Services
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/drafts">
                <a className="nav-link" data-active={isActive('/drafts')}>
                  My drafts
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    )
    right = (
      <div className="d-flex justify-content-right">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Validating session...</span>
        </div>
      </div>
    )
  }

  if (!session) {
    right = (
      <div className="right">
        <Link href="/api/auth/signin">
          <a className="btn" data-active={isActive('/signup')}>
            Log in
          </a>
        </Link>
      </div>
    )
  }

  if (session) {
    left = (
      <div className="left">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarToggler"
          aria-controls="navbarToggler"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarToggler">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link href="/">
                <a className="nav-link bold" data-active={isActive('/')}>
                  Feed
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/services">
                <a
                  className="nav-link bold"
                  data-active={isActive('/services')}
                >
                  Services
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/drafts">
                <a className="nav-link" data-active={isActive('/drafts')}>
                  My drafts
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    )
    right = (
      <div className="right">
        <div className="dropdown m-3">
          <button
            className="btn btn dropdown-toggle"
            role="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Create new..
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li>
              <Link href="/post/create">
                <a className="dropdown-item" href="/post/create">
                  Post
                </a>
              </Link>
            </li>
            <li>
              <Link href="/service/create">
                <a className="dropdown-item" href="/service/create">
                  Service
                </a>
              </Link>
            </li>
          </ul>
          <button className="btn" onClick={() => signOut()}>
            <a>Log out</a>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <nav className="navbar navbar-expand-lg navbar-light bg-white">
        {left}
        {right}
        <style jsx>{`
          nav {
            display: flex;
            padding: 2rem;
            align-items: center;
          }
        `}</style>
      </nav>
    </div>
  )
}

export default Header
