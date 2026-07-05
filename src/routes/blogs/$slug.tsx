// src/routes/blogs/$slug.tsx
import { getPostBySlug } from '#/lib/blog'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { useMemo } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { MDXProvider } from '@mdx-js/react'

export const Route = createFileRoute('/blogs/$slug')({
  loader: ({ params }) => {
    const post = getPostBySlug(params.slug)
    // null gelirse TanStack Router 404 sayfasına yönlendirir
    if (!post) throw notFound()
    return post
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { frontmatter, Component } = Route.useLoaderData()

  // ─── MDX İÇİN ÖZEL HTML BİLEŞENLERİ ─────────────────────────────────────────
  // MDXProvider bu map'i alır ve MDX içindeki HTML elementlerini
  // aşağıdaki bileşenlerle replace eder.
  // ComponentPropsWithoutRef<'h1'> sayesinde tüm native HTML
  // attribute'larını (id, className, vs.) otomatik olarak alırlar.

  const mdxComponents = useMemo(
    () => ({
      h1: (props: ComponentPropsWithoutRef<'h1'>) => (
        <h1
          className="display-title mb-6 text-3xl font-bold text-sea-ink sm:text-4xl"
          {...props}
        />
      ),
      h2: (props: ComponentPropsWithoutRef<'h2'>) => (
        <h2
          className="mb-4 mt-10 text-2xl font-semibold text-sea-ink"
          {...props}
        />
      ),
      h3: (props: ComponentPropsWithoutRef<'h3'>) => (
        <h3
          className="mb-3 mt-8 text-xl font-semibold text-sea-ink"
          {...props}
        />
      ),
      p: (props: ComponentPropsWithoutRef<'p'>) => (
        <p className="mb-5 leading-8 text-sea-ink-soft" {...props} />
      ),
      a: (props: ComponentPropsWithoutRef<'a'>) => (
        <a
          className="text-(--lagoon-deep)underline decoration-(--lagoon-deep)/40 underline-offset-2 transition hover:text-(--lagoon)"
          {...props}
        />
      ),
      ul: (props: ComponentPropsWithoutRef<'ul'>) => (
        <ul
          className="mb-5 list-disc space-y-2 pl-6 text-(--sea-ink-soft)"
          {...props}
        />
      ),
      ol: (props: ComponentPropsWithoutRef<'ol'>) => (
        <ol
          className="mb-5 list-decimal space-y-2 pl-6 text-(--sea-ink-soft)"
          {...props}
        />
      ),
      li: (props: ComponentPropsWithoutRef<'li'>) => (
        <li className="leading-7" {...props} />
      ),
      blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => (
        <blockquote
          className="my-6 border-l-4 border-(--lagoon) pl-5 italic text-(--sea-ink-soft)"
          {...props}
        />
      ),
      // Inline code: `kod`
      code: (props: ComponentPropsWithoutRef<'code'>) => (
        <code
          className="rounded-md border border-(--line) bg-(--surface-strong) px-1.5 py-0.5 text-sm text-(--sea-ink)"
          {...props}
        />
      ),
      // Kod bloğu: ```dil\n...\n```
      // rehype-highlight bu bloğa zaten syntax sınıfları ekler,
      // biz sadece görsel kabuğu tasarlıyoruz.
      pre: (props: ComponentPropsWithoutRef<'pre'>) => (
        <pre
          className="my-6 overflow-x-auto rounded-xl border border-(--line) bg-[#1d2e45] p-5 text-sm leading-relaxed text-[#e8efff]"
          {...props}
        />
      ),
      hr: () => <hr className="my-10 border-(--line)" />,
    }),
    [],
  )

  return (
    <main className="page-wrap px-4 pb-16 pt-14">
      {/* Geri Butonu */}
      <div className="rise-in mb-8">
        <Link
          to="/blogs"
          className="island-kicker inline-flex items-center gap-1.5 text-xs transition hover:opacity-70"
        >
          ← Tüm Yazılar
        </Link>
      </div>

      {/* Yazı Meta Bilgileri */}
      <header className="island-shell rise-in mb-8 rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14">
        {frontmatter.tags && frontmatter.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {frontmatter.tags.map((tag) => (
              <span
                key={tag}
                className="island-kicker rounded-full bg-(--chip-bg) px-3 py-0.5 text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="display-title text-3xl font-bold text-(--sea-ink) sm:text-4xl">
          {frontmatter.title}
        </h1>

        <p className="mt-3 text-base leading-8 text-(--sea-ink-soft)">
          {frontmatter.description}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-(--sea-ink-soft)">
          {frontmatter.author && (
            <span className="font-medium">{frontmatter.author}</span>
          )}
          <time dateTime={frontmatter.date}>
            {new Date(frontmatter.date).toLocaleDateString('tr-TR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
      </header>

      {/* MDX İçeriği */}
      <article className="island-shell rise-in rounded-2xl px-6 py-10 sm:px-10">
        <MDXProvider components={mdxComponents}>
          <Component />
        </MDXProvider>
      </article>
    </main>
  )
}
