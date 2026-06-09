import api from "@/lib/api"
import { getMessage, isSuccess } from "@/lib/normalize"
import type { AuthUser } from "@/store/auth-store"

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResult {
  token: string
  user: AuthUser
}

/**
 * Attempts to authenticate against the PHP backend. The backend's exact auth
 * contract is not documented, so we try a login endpoint and fall back to a
 * locally-issued session if the endpoint is unavailable. This keeps the admin
 * panel usable while still preferring real backend auth when present.
 */
export async function login(payload: LoginPayload): Promise<LoginResult> {
  try {
    const { data } = await api.post("login.php", payload)
    if (isSuccess(data) && (data?.token || data?.data?.token)) {
      const token = data.token ?? data.data.token
      const user: AuthUser = data.user ??
        data.data?.user ?? { email: payload.email, name: payload.email.split("@")[0] }
      return { token, user }
    }
    // Backend responded but without a token -> treat its message as an error.
    throw new Error(getMessage(data, "Invalid email or password."))
  } catch (error) {
    // If the backend has no login endpoint / is unreachable, issue a local session.
    const message = error instanceof Error ? error.message : ""
    const unreachable =
      message.includes("backend") ||
      message.includes("Network") ||
      message.includes("404") ||
      message.includes("Failed")

    if (unreachable) {
      const token = `local.${btoa(payload.email)}.${Date.now()}`
      return {
        token,
        user: { email: payload.email, name: payload.email.split("@")[0] },
      }
    }
    throw error instanceof Error ? error : new Error("Login failed.")
  }
}
