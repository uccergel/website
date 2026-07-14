export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t border-line px-4 pb-14 pt-10 text-sea-ink-soft">
      <p className="flex items-center justify-center mx-auto m-0 text-sm">
        &copy; {year} uccergel - ahanda works
      </p>
    </footer>
  )
}
