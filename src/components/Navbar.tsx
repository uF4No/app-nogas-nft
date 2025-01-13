'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'

export function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { connectors, connect } = useConnect()
  const { status, addresses } = useAccount()
  const { disconnect } = useDisconnect()
  const router = useRouter()

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-3)}`
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-950 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 truncate">
            <Link 
              href="/" 
              className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white hover:opacity-80 transition-opacity"
            >
              SSO React Template
            </Link>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 sm:p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun 
                  size={18} 
                  className="text-amber-300 hover:text-amber-400 transition-colors" 
                />
              ) : (
                <Moon 
                  size={18} 
                  className="text-gray-600 hover:text-gray-800 transition-colors" 
                />
              )}
            </button>

            <div className="relative">
              {status === 'connected' && addresses?.[0] ? (
                <>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base"
                  >
                    <span>{formatAddress(addresses[0])}</span>
                    <span className="text-xs">▼</span>
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                      <Link
                        href="/account"
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Account
                      </Link>
                      <button
                        onClick={() => {
                          disconnect()
                          router.push('/')
                          setIsDropdownOpen(false)
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"
                      >
                        Disconnect
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-sm sm:text-base"
                  >
                    Connect
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                      {connectors.map((connector) => (
                        <button
                          key={connector.uid}
                          onClick={() => {
                            connect({ connector })
                            setIsDropdownOpen(false)
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
                        >
                          {connector.name}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
} 
