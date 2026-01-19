'use client'

import Link from 'next/link'
import Image from 'next/image'

import catFaceImage from '@/app/assets/images/cat-face.png'
import { useUsername } from '@/app/lib/hooks/useUsername'

export function Header() {
  const { username, clearUsername } = useUsername()

  return (
    <header className="px-3 py-2 md:p-4 sticky top-0 z-50 flex justify-between items-center bg-gray-800 text-white gap-2">
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <Link href="/" className="hover:cursor-pointer hover:opacity-80 transition-opacity duration-200">
          <Image 
            src={catFaceImage} 
            alt="Catopia Logo" 
            width={100} 
            height={100} 
            priority 
            className="w-16 h-16 md:w-[100px] md:h-[100px]"
          />
        </Link>
      </div>
      <div className="flex items-center gap-2 md:gap-4 md:absolute md:left-1/2 md:transform md:-translate-x-1/2 min-h-9 min-w-9 flex-shrink-0">
        {username && (
          <div className="flex flex-col items-center gap-1 text-lg md:text-3xl font-semibol text-blue-600 hover:underline">
            <button
              onClick={clearUsername}
              className="hover:cursor-pointer"
              aria-label="Clear username"
            >
              {username.toUpperCase()}
            </button>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <Link
          href="/uploads"
          className="text-sm md:text-base md:px-6 md:py-3 px-3 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap"
        >
          Upload Image
        </Link>
      </div>
    </header>
  )
}