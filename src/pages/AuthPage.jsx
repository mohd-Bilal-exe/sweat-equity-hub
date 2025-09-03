import { firebaseServices } from '@/api/firebase/services'
import useUserStore from '@/api/zustand'
import { createPageUrl } from '@/utils'
import React, { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { HiOutlineMail, HiOutlineLockClosed, HiEye, HiEyeOff } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'


const AuthPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { user } = useUserStore()
    const navigate=useNavigate()
     const url=createPageUrl("Profile")
  const handleAuth = async () => {
    setLoading(true)
    setError('')
    try {
      const userData = await firebaseServices.signInWithEmail(email, password)

      navigate(url)
    } catch {
      try {
        const userData = await firebaseServices.signUpWithEmail(email, password)
         const userId= await firebaseServices.createUser(userData)
         navigate(url)
      } catch (err) {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      await firebaseServices.signInWithGoogle()
        navigate(url)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-gray-100 to-gray-300 px-4 min-h-screen">
      <div className="bg-white shadow-xl p-8 rounded-xl w-full max-w-md animate-fade-in">
        <h2 className="mb-6 font-semibold text-gray-800 text-2xl text-center">
          {user ? `Welcome, ${user.displayName || user.email}` : 'Login / Signup'}
        </h2>

        {!user && (
          <>
            <div className="relative mb-4">
              <HiOutlineMail className="top-3 left-3 absolute text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="py-2 pr-4 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
              />
            </div>

            <div className="relative mb-4">
              <HiOutlineLockClosed className="top-3 left-3 absolute text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="py-2 pr-10 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="top-3 right-3 absolute text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <HiEyeOff /> : <HiEye />}
              </button>
            </div>

            <button
              onClick={handleAuth}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 py-2 rounded-md w-full text-white transition duration-200"
            >
              {loading ? 'Processing...' : 'Continue'}
            </button>

            <div className="flex items-center my-6">
              <hr className="flex-grow border-gray-300" />
              <span className="mx-3 text-gray-500 text-sm">or</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="flex justify-center items-center gap-2 hover:bg-gray-100 py-2 border rounded-md w-full transition duration-200"
            >
              <FcGoogle className="text-xl" />
              <span>Sign in with Google</span>
            </button>

            {error && <p className="mt-4 text-red-500 text-sm text-center">{error}</p>}
          </>
        )}
      </div>
    </div>
  )
}

export default AuthPage