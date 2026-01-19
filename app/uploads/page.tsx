'use client'

import Link from 'next/link'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import { useUsername } from '../lib/hooks/useUsername'

export default function UploadsPage() {
  const router = useRouter()
  const { username } = useUsername()
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]

    if (selectedFile) {
      // Ensure the file is an image else throw an error
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select an image file')
        setFile(null)
        setPreview(null)
        return
      }

      setFile(selectedFile)
      setError(null)

      // read the file contents and set the preview
      const reader = new FileReader()

      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!file) {
      setError('Please select an image to upload')
      return
    }

    setIsUploading(true)
    setError(null)

    if (!username) {
      setError('Please set a username to upload')
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('sub_id', username)

      const response = await fetch('/api/user-felines', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload image')
      }

      setFile(null)
      setPreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ''

      setSuccess('Image uploaded successfully! Hold tight, redirecting to home...')
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsUploading(false)
    }
  }

  const handleClear = () => {
    setFile(null)
    setPreview(null)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="container mx-auto pt-4 pb-8 px-4 max-w-2xl">
        <header className="mb-8">
            <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline mb-4">Home</Link>
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-2">
            Upload Cat Image
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Share your favorite cat photos with the community
          </p>
        </header>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-lg">
          <div className="mb-6">
            <label
              htmlFor="file-input"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Select Image
            </label>
            <input
              id="file-input"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 dark:text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                dark:file:bg-blue-900 dark:file:text-blue-300
                dark:hover:file:bg-blue-800
                cursor-pointer"
            />
          </div>

          {preview && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preview
              </label>
              <div className="relative w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">                
                <button type="button" className="absolute top-0 right-0" onClick={handleClear}>
                  <FontAwesomeIcon
                    icon={faXmark}
                    size="xl"
                    className="hover:cursor-pointer hover:text-red-500 transition-colors duration-200"
                  />
                </button>
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={!file || isUploading}
            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg
              hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
              transition-colors duration-200
              dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </form>

      </main>
    </div>
  )
}
