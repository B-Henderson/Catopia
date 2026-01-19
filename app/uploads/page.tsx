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
    <div className="min-h-screen bg-gray-200 font-sans">
      <main className="container mx-auto pt-4 pb-8 px-4">
        <header className="mb-8">
            <Link href="/" className="text-blue-600 hover:underline mb-4">Home</Link>
          <h1 className="text-4xl font-bold text-black mb-2">
            Upload Cat Image
          </h1>
          <p className="text-lg text-gray-600">
            Share your favorite cat photos with the community
          </p>
        </header>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-lg">
          <div className="mb-6">
            <label
              htmlFor="file-input"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Image
            </label>
            <input
              id="file-input"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-3 file:px-6
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-600 file:text-white
                hover:file:bg-blue-700
                file:transition-colors file:duration-200
                cursor-pointer"
            />
          </div>

          {preview && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <div className="relative w-full h-64 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">                
                <button type="button" aria-label="Clear preview" className="absolute top-0 right-0" onClick={handleClear}>
                  <FontAwesomeIcon
                    icon={faXmark}
                    size="xl"
                    className="hover:cursor-pointer text-gray-500 hover:text-red-500 transition-colors duration-200"
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
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          <button
            type="submit"
            aria-label="Upload image"
            disabled={!file || isUploading}
            className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg
              hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
              transition-colors duration-200"
          >
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </form>

      </main>
    </div>
  )
}
