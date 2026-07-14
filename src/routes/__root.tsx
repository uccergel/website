import {
  HeadContent,
  Scripts,
  createRootRouteWithContext
} from '@tanstack/react-router'
import { TanStackDevtools } from '@tanstack/react-devtools'
import Footer from '../components/Footer'

import appCss from '../styles/index.css?url'

import type { QueryClient } from '@tanstack/react-query'
import Header from '#/components/header.tsx'
import { NotFound } from '#/components/not-found'
import { ErrorBoundary } from '#/components/error-boundary'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        title: 'Uğur Cem Çergel'
      }
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss
      }
    ]
  }),
  notFoundComponent: NotFound,
  errorComponent: ({ error, reset }) => (
    <ErrorBoundary error={error} reset={reset} />
  ),
  shellComponent: RootDocument
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="h-full font-sans antialiased wrap:anywhere selection:bg-[rgba(79,184,178,0.24)]">
        <div className="flex min-h-svh flex-col overflow-hidden">
          <Header />
          <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
          <Footer />
        </div>

        <TanStackDevtools
          config={{
            position: 'bottom-right'
          }}
        />
        <Scripts />
      </body>
    </html>
  )
}
