import {QueryClientConfig} from '@tanstack/react-query'

export const queryClientConfig = {
  defaultOptions: {
    queries: {
      // suspense: true,
      retry: 1,
      staleTime: 5 * 1000,
      networkMode: 'offlineFirst',
      // throwOnError: true,
    },
    mutations: {
      // suspense: true,
      // throwOnError: true,
      networkMode: 'offlineFirst',
    },
  },
} as QueryClientConfig


export const routesFront: {
  path: string
  private: boolean
}[] = [
  // private routes
  {
    path: '/',
    private: true,
  },
  {
    path: '/user',
    private: true,
  },
  // public routes
  {
    path: '/login',
    private: false,
  },
]

export const cookiesSettings = {
  // expires in 1 week
  expires: 7,
  // secure: true,
}
