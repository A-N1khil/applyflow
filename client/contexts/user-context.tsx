"use client"

import type { User } from "@/models/user"
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"

const USER_STORAGE_KEY = "applyflow.user"

interface UserContextValue {
  user: User | null
  setUser: (user: User | null) => void
}

const UserContext = createContext<UserContextValue | null>(null)

function isUser(value: unknown): value is User {
  if (!value || typeof value !== "object") {
    return false
  }

  const user = value as Record<string, unknown>
  return (
    typeof user.id === "string" &&
    typeof user.email === "string" &&
    typeof user.first_name === "string" &&
    typeof user.last_name === "string" &&
    (typeof user.created_at === "string" || user.created_at === null)
  )
}

function getStoredUser(): User | null {
  if (typeof window === "undefined") {
    return null
  }

  const storedUser = window.sessionStorage.getItem(USER_STORAGE_KEY)

  if (!storedUser) {
    return null
  }

  try {
    const parsedUser: unknown = JSON.parse(storedUser)

    if (isUser(parsedUser)) {
      return parsedUser
    }
  } catch {
    // Remove malformed session data below.
  }

  window.sessionStorage.removeItem(USER_STORAGE_KEY)
  return null
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(getStoredUser)

  const setUser = useCallback((nextUser: User | null) => {
    setUserState(nextUser)

    if (nextUser) {
      window.sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser))
    } else {
      window.sessionStorage.removeItem(USER_STORAGE_KEY)
    }
  }, [])

  const value = useMemo(() => ({ user, setUser }), [user, setUser])

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser(): UserContextValue {
  const context = useContext(UserContext)

  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }

  return context
}
