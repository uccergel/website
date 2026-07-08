import {
  HeadContent,
  Scripts,
  createRootRouteWithContext
} from '@tanstack/react-router'
import { TanStackDevtools } from '@tanstack/react-devtools'
import Footer from '../components/Footer'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import Header from '#/components/header.tsx'

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
  shellComponent: RootDocument
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="font-sans antialiased wrap:anywhere selection:bg-[rgba(79,184,178,0.24)]">
        <div className="flex min-h-svh flex-col">
          <Header />
          <main className="flex-1">{children}</main>
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
