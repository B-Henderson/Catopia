import Link from 'next/link'
import Image from 'next/image'

import catFaceImage from '../../assets/images/cat-face.png'

export function Header() {
  return (
    <header className="p-4 sticky top-0 z-50 flex justify-between items-center bg-gray-800 text-white">
      <div className="hidden md:block">
        <h1 className="text-4xl font-bold mb-2">
          Catopia
        </h1>
        <p className="text-lg">
          Your cat image collection
        </p>
      </div>
      <div className="flex items-center gap-4 md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
        <Link href="/" className="hover:cursor-pointer hover:opacity-80 transition-opacity duration-200">
          <Image src={catFaceImage} alt="Catopia Logo" width={100} height={100} priority />
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Link
          href="/uploads"
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Upload Image
        </Link>
      </div>
    </header>
  )
}