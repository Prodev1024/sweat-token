import { ethers } from 'ethers'
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'

export interface WalletProvider {
  id: string
  name: string
  icon: string
}

export const providers = [
  {
    id: 'metamask',
    name: 'Metamask',
    icon: '/images/metamask.svg'
  }
]

type Web3ContextProviderProps = {
  children: ReactNode
}

type Web3ContextValue = {
  account?: string
  setAccount: (account: string | undefined) => void
  walletProvider?: string
  setWalletProvider: (provider: string | undefined) => void
  provider?: ethers.providers.Web3Provider
}

export const Web3ProviderContext = createContext<Web3ContextValue>({} as Web3ContextValue)

export function Web3ContextProvider({ children }: Web3ContextProviderProps) {
  const [account, setAccount] = useState<string>()
  const [walletProvider, setWalletProvider] = useState<string>()
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>()

  useEffect(() => {
    if (walletProvider) return
    const lastProvider = localStorage.getItem('lastProvider')
    if (!lastProvider) return
    const matches = providers.filter((p) => p.id === lastProvider)
    if (!matches.length) return
    setWalletProvider(matches[0].id)
  }, [walletProvider])

  useEffect(() => {
    if (provider !== undefined) return
    if (account === undefined) return
    setProvider(new ethers.providers.Web3Provider(window.ethereum))
  }, [provider, account])

  useEffect(() => {
    if (account) return
    if (!window.ethereum) return
    if (!window.ethereum.selectedAddress) return
    console.log('use connected address')
    setAccount(window.ethereum.selectedAddress)
  }, [account])

  return (
    <Web3ProviderContext.Provider
      value={
        {
          walletProvider,
          setWalletProvider: (walletProvider: string) => {
            localStorage.setItem('lastProvider', walletProvider)
            setWalletProvider(walletProvider)
          },
          account,
          setAccount: (account: string | undefined) => {
            if (account === undefined) {
              localStorage.removeItem('lastProvider')
              setWalletProvider(undefined)
              setProvider(undefined)
            }
            setAccount(account)
          },
          provider
        } as Web3ContextValue
      }
    >
      {children}
    </Web3ProviderContext.Provider>
  )
}

export default function useWeb3() {
  return useContext(Web3ProviderContext)
}
