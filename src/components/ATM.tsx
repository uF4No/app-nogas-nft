'use client'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useBalance } from 'wagmi'
import { formatUnits, parseUnits } from 'viem'
import { eip712WalletActions, getGeneralPaymasterInput } from 'viem/zksync'
import { useState } from 'react'
import { getWalletClient } from 'wagmi/actions';
import { getConfig, config } from '../wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions'
import { zksyncSepoliaTestnet } from 'viem/chains'

// NFT contract ABI (only what we need)
const nftAbi = [
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

// ERC20 contract ABI for minting
const erc20Abi = [
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

export function ATM() {
  const { address, connector } = useAccount()
  const [isPending, setIsPending] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  
  const NFT_CONTRACT_ADDRESS = '0x9B736CD0cA3353e019Fba841BA7f0506ad93d573' as `0x${string}`
  const ERC20_CONTRACT_ADDRESS = '0x3Fbce792d7A91CDB8408148533b9599be30d3fdD' as `0x${string}`
  const PAYMASTER_ADDRESS = '0x57340cbD0f8a722A5b51D5d9ADc44432Ac4b0b65' as `0x${string}`

  // Read NFT balance
  const { data: nftBalance, isError, isLoading } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: nftAbi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address),
    }
  })

  // Write contract hook for minting tokens
  const { writeContract, isPending: isWritePending } = useWriteContract()

  // Add ERC20 balance read with refetch interval
  const { data: tokenBalance, refetch: refetchBalance } = useReadContract({
    address: ERC20_CONTRACT_ADDRESS,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address),
      refetchInterval: 2000, // Refetch every 2 seconds while transaction is pending
    }
  })

  // Add ETH balance hook
  const { data: ethBalance, refetch: refetchEthBalance } = useBalance({
    address,
    query: {
      refetchInterval: 2000,
    }
  })

  // Handle mint button click
  const handleMint = async () => {
    if (!address || !connector) return
    try {
      setIsPending(true)
      setTxHash(null)
      
      const mintParams = {
        address: ERC20_CONTRACT_ADDRESS,
        abi: erc20Abi,
        functionName: 'mint',
        args: [address, parseUnits('100', 18)] as const,
        chain: zksyncSepoliaTestnet,
      }

      let hash: `0x${string}`
      
      if (Number(formatUnits(nftBalance || BigInt(0), 0)) > 0) {
        console.log('Getting wallet client with connector:', connector.name)
        const walletClient = await getWalletClient(getConfig(), {
          chainId: zksyncSepoliaTestnet.id,
          connector
        })
        console.log('Wallet client:', walletClient)
        
        if (!walletClient) throw new Error('No wallet client')
        
        const client = walletClient.extend(eip712WalletActions())
        
        hash = await client.writeContract({
          ...mintParams,
          paymaster: PAYMASTER_ADDRESS,
          paymasterInput: getGeneralPaymasterInput({ innerInput: "0x" })
        })
      } else {
        hash = await writeContract(mintParams)
      }
      
      setTxHash(hash)
      
      // Wait for transaction and force refetch
      const receipt = await waitForTransactionReceipt(getConfig(), { hash })
      await Promise.all([
        refetchBalance(),
        refetchEthBalance(),
        new Promise(resolve => setTimeout(resolve, 1000))
      ])
    } catch (error) {
      console.error('Error minting tokens:', error)
      if (error instanceof Error) {
        console.error('Error details:', error.message)
        console.error('Error stack:', error.stack)
      }
    } finally {
      setIsPending(false)
    }
  }

  const isDisabled = isPending || isWritePending || !address
  const buttonText = isPending || isWritePending ? 'Minting...' : 'Get 100 ERC20 TestTokens'

  return (
    <div className="space-y-4">
      {/* NFT Status Display */}
      {isLoading ? (
        <p className="text-xl text-gray-600 dark:text-gray-300">Checking NFT balance...</p>
      ) : isError ? (
        <p className="text-xl text-gray-600 dark:text-gray-300">Error checking NFT balance</p>
      ) : !nftBalance ? (
        <p className="text-xl text-gray-600 dark:text-gray-300">You don't own any NFTs, you'll have to pay the transaction fee.</p>
      ) : (
        <p className="text-xl text-gray-600 dark:text-gray-300">
          {Number(formatUnits(nftBalance, 0)) > 0 
            ? `You own ${Number(formatUnits(nftBalance, 0))} NFT${Number(formatUnits(nftBalance, 0)) > 1 ? 's' : ''}, this transaction is free 💸` 
            : "You don't own any NFTs yet"}
        </p>
      )}

      {/* Balance Displays */}
      <div className="space-y-2">
        <p className="text-xl text-gray-600 dark:text-gray-300">
          ETH Balance: {ethBalance ? formatUnits(ethBalance.value, ethBalance.decimals) : '0'} ETH
        </p>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          TEST Balance: {tokenBalance ? formatUnits(tokenBalance, 18) : '0'} TEST
        </p>
      </div>

      {/* Mint Button */}
      <button
        onClick={handleMint}
        disabled={isDisabled}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                  disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {buttonText}
      </button>

      {/* Transaction Hash Display */}
      {txHash && (
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Transaction: <a 
            href={`https://sepolia.explorer.zksync.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 hover:underline"
          >
            View on Explorer ↗
          </a>
        </p>
      )}

    </div>
  )
} 
