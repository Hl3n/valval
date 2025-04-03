"use client"

import { useEffect } from "react"

export default function GetKeyPage() {
  useEffect(() => {
    // Redirect on the client side
    window.location.href = "https://ads.luarmor.net/get_key?for=-gbVzmkCtUCcn"
  }, [])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl text-white mb-4">Redirecting to key generator...</h1>
        <p className="text-gray-400">
          If you are not redirected automatically, please{" "}
          <a href="https://ads.luarmor.net/get_key?for=-gbVzmkCtUCcn" className="text-purple-500 hover:underline">
            click here
          </a>
        </p>
      </div>
    </div>
  )
}

