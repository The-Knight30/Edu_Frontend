/* eslint-disable react/prop-types */
"use client"
import React, { useEffect, useState } from "react"

import { Outlet, useLocation, useNavigate } from "react-router-dom"
import Cookies from "cookie-universal"

interface RequireAuthProps {
  allowedroles: string
  children: React.ReactNode
}

const RequireAuth = ({ allowedroles, children }: RequireAuthProps) => {
  const cookies = Cookies()
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const auth = cookies.get("role")

    if (auth === allowedroles) {
      setIsAuthorized(true)
    } else {
      const path = location.pathname || "/"
      navigate(`/login?redirect=${encodeURIComponent(path)}`)
    }

    setIsLoading(false)
  }, [allowedroles, navigate, location])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return isAuthorized ? <Outlet /> : null
}

export default RequireAuth
