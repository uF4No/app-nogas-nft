'use client'

import { useAccount, useBalance, useChainId, useDisconnect } from 'wagmi'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getPublicClient } from '@wagmi/core'
import { getConfig } from '../../wagmi'
import { zksyncSepoliaTestnet } from 'viem/chains'
import { Copy, Check } from 'lucide-react'

export default function Account() {
  const account = useAccount()
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [isSmartContract, setIsSmartContract] = useState<boolean | null>(null)
  const address = account.addresses?.[0]
  const chainId = useChainId()
  const { disconnect } = useDisconnect()

  // Create a public client
  const publicClient = getPublicClient(getConfig())
  

  useEffect(() => {
    async function checkIsSmartContract() {
      if (!address) return
      
      try {
        const code = await publicClient.getCode({
          address: address as `0x${string}`
        })
        // Ensure we always return a boolean value
        setIsSmartContract(Boolean(code && code.length > 2))
      } catch (error) {
        console.error('Error checking contract code:', error)
        setIsSmartContract(false)
      }
    }

    checkIsSmartContract()
  }, [address, publicClient])

  const { data: balance } = useBalance({
    address: address as `0x${string}`,
  })

  useEffect(() => {
    if (account.status !== 'connected') {
      router.push('/')
    }
  }, [account.status, router])

  const copyToClipboard = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getExplorerLink = (address: string) => {
    return `${process.env.NEXT_PUBLIC_EXPLORER_URL}${address}`
  }

  const handleDisconnect = () => {
    disconnect()
    router.push('/')
  }

  if (!address) return null

  return (
    <div className="min-h-screen p-4 sm:p-8 md:pt-32 pt-24 bg-white dark:bg-gray-900">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
        Account Details
      </h1>

      <div className="max-w-2xl mx-auto bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-white">Wallet Information</h2>
        
        <div className="space-y-4 sm:space-y-6 text-gray-600 dark:text-gray-300">
          {/* Network */}
          <div className="bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg">
            <h3 className="text-base sm:text-lg font-semibold mb-2">Network</h3>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {chainId === zksyncSepoliaTestnet.id ? 'zkSync Sepolia' : 'Unknown Network'}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Chain ID: {chainId}
              </span>
            </div>
          </div>

          {/* Account Type */}
          <div className="bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg">
            <h3 className="text-base sm:text-lg font-semibold mb-2">Account Type</h3>
            <div className="flex flex-wrap items-center gap-2">
              {isSmartContract === null ? (
                <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200">
                  Checking...
                </span>
              ) : (
                <span className={`px-3 py-1 rounded-full text-sm ${
                  isSmartContract 
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                }`}>
                  {isSmartContract ? 'Smart Contract Account' : 'EOA'}
                </span>
              )}
              <a
                href={getExplorerLink(address)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View on Explorer ↗
              </a>
            </div>
          </div>

          {/* Address */}
          <div className="bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg">
            <h3 className="text-base sm:text-lg font-semibold mb-2">Address</h3>
            <div className="flex flex-wrap items-center gap-2">
              <code className="bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded break-all text-sm">
                {address}
              </code>
              <button
                onClick={copyToClipboard}
                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-gray-600 dark:text-gray-300"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
          </div>

          {/* Balance */}
          <div className="bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg">
            <h3 className="text-base sm:text-lg font-semibold mb-2">Balance</h3>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-mono">
                {balance ? `${Number(balance.formatted).toFixed(4)} ${balance.symbol}` : 'Loading...'}
              </span>
            </div>
          </div>

          {/* Disconnect Button */}
          <div className="pt-4 sm:pt-6">
            <button
              onClick={handleDisconnect}
              className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 
                       text-white rounded-lg transition-colors duration-200 
                       flex items-center justify-center space-x-2 font-medium"
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 
