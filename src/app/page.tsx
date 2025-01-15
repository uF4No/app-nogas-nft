'use client'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useAccount } from 'wagmi'
import { ATM } from '@/components/ATM'

export default function Home() {
  const { resolvedTheme } = useTheme()
  const { status } = useAccount()
  const isConnected = status === 'connected'

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-gray-200 dark:from-gray-950 dark:to-gray-850 pt-24 sm:pt-0">
      {!isConnected ? (
        <div className="text-center space-y-8 px-4 max-w-4xl">
          {/* Hero Section */}
          <div className="w-full max-w-md mx-auto mb-8">
            <Image
              src={resolvedTheme === 'dark' ? '/zksync-sso-light.png': '/zksync-sso-dark.png'}
              alt="ZKSync SSO Logo"
              width={400}
              height={100}
              priority
              className="w-full h-auto"
            />
          </div>

          {/* Main Title with gradient text */}
          <h1 className="text-6xl md:text-7xl font-extrabold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 animate-gradient">
              React Template
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300">
            start building Web3 apps with amazing UX
          </p>

          {/* Decorative elements */}
          <div className="relative">
            {/* Feature highlights */}
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {[
                { title: 'Easy Setup', icon: '🚀' },
                { title: 'Secured by Passkeys', icon: '🔒' },
                { title: 'Powered by ZKsync', icon: '⛓️' },
              ].map((feature) => (
                <div key={feature.title} 
                     className="p-6 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm 
                              shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1
                              border border-gray-200 dark:border-gray-700
                              group">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {feature.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
          {/* Documentation links */}
          <p className="text-gray-600 dark:text-gray-300 mt-8">
            Learn more in the{' '}
            <a
              href="https://docs.zksync.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline decoration-dotted transition-colors"
            >
              ZKsync docs
            </a>
            {' '}and{' '}
            <a
              href="https://docs.zksync.io/zksync-era/unique-features/zksync-sso"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline decoration-dotted transition-colors"
            >
              SSO documentation
            </a>
          </p>
        </div>
      ) : (
        <div className="text-center space-y-8 px-4 max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            Welcome Back! 👋
          </h1>
          <div className="p-8 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg">
            <ATM />
          </div>
        </div>
      )}

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-blue-400/30 to-purple-500/30 blur-3xl animate-blob" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-r from-purple-500/30 to-blue-400/30 blur-3xl animate-blob animation-delay-2000" />
      </div>
    </div>
  )
}
