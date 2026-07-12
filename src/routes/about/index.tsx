import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about/')({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <main className="page-wrap px-4 py-12">
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
        <section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14">
          {/* <p className="island-kicker mb-3">Hakkımda</p> */}
          <h1 className="display-title text-3xl font-bold text-(--sea-ink) sm:text-4xl">
            Hakkımda
          </h1>
          <p></p>
        </section>
        <section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14"></section>
      </div>
    </main>
  )
}
