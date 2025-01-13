'use client'

export function Footer() {
  return (
    <footer className="w-full py-6 px-4 mt-auto bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <span className="text-gray-600 dark:text-gray-300">Built with</span>
          <span className="text-red-500 animate-pulse">❤️</span>
          <span className="text-gray-600 dark:text-gray-300">by ZKsync devs</span>
        </div>
        <div className="flex items-center space-x-6">
          <a
            href="https://docs.zksync.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            Docs
          </a>
          <a
            href="https://twitter.com/zksyncdevs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            Twitter
          </a>
        </div>
      </div>
    </footer>
  )
} 
