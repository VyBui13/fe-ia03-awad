import * as React from "react"
import { Button } from "./button"

type OAuthPayload = {
    accessToken?: string
    refreshToken?: string
    [key: string]: any
}

type Props = {
    className?: string
    onSuccess?: (payload: OAuthPayload) => void
    onError?: (err: unknown) => void
    /** If provided, opens this URL instead of default /auth/google */
    url?: string
}

export default function GoogleLogin({
    className,
    onSuccess,
    onError,
    url,
}: Props) {
    const listenerRef = React.useRef<(e: MessageEvent) => void | null>(null)

    React.useEffect(() => {
        return () => {
            if (listenerRef.current) window.removeEventListener("message", listenerRef.current)
        }
    }, [])

    const handleClick = () => {
        try {
            const apiBase = (import.meta.env.VITE_API_URL as string) || ""
            const authUrl = url || `${apiBase}/auth/google`

            const popup = window.open(authUrl, "_blank", "width=500,height=600")

            const handleMessage = (e: MessageEvent) => {
                try {
                    const origin = apiBase ? new URL(apiBase).origin : null
                    if (origin && e.origin !== origin) return

                    const data = e.data
                    if (data?.type === "oauth" && data?.provider === "google") {
                        onSuccess?.(data.payload || {})
                        window.removeEventListener("message", handleMessage)
                        listenerRef.current = null
                        popup?.close()
                    }
                } catch (err) {
                    // swallow and forward
                }
            }

            listenerRef.current = handleMessage
            window.addEventListener("message", handleMessage)

            // Fallback: poll popup closed or timeout
            const timeout = setTimeout(() => {
                if (listenerRef.current) {
                    window.removeEventListener("message", listenerRef.current)
                    listenerRef.current = null
                }
                clearTimeout(timeout)
            }, 1000 * 60 * 5)
        } catch (err) {
            onError?.(err)
        }
    }

    return (
        <Button onClick={handleClick} variant="provider" className={className} >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48" fill="none" aria-hidden>
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.35 1.53 8.25 2.8l6.03-6.03C34.97 3.02 29.88 1 24 1 14.72 1 6.94 6.92 3.5 14.94l7.07 5.48C12.9 14.1 17.98 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.5 24.5c0-1.6-.15-2.78-.48-4.02H24v8.04h12.99c-.56 3.02-2.87 5.62-6.14 7.08l7.06 5.48C43.9 38.6 46.5 32.9 46.5 24.5z" />
                <path fill="#FBBC05" d="M10.57 29.42A14.99 14.99 0 0 1 9 24.5c0-1.6.27-3.14.76-4.5L3.5 14.94C1.3 18.9 0 22.63 0 24.5c0 3.14 1.03 6.04 2.76 8.43l7.81-3.51z" />
                <path fill="#34A853" d="M24 46c6.32 0 11.63-2.1 15.51-5.7l-7.06-5.48c-2.06 1.38-4.7 2.2-8.45 2.2-6.03 0-11.11-4.6-12.93-10.96l-7.07 5.48C6.94 41.08 14.72 46 24 46z" />
            </svg>
            <span>Continue with Google</span>
        </Button>
    )
}
