export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line px-4 pb-6 pt-5 text-sea-ink-soft">
      <p className="flex items-center justify-center mx-auto m-0 text-sm">
        &copy; {year} uccergel - ahanda works
      </p>
    </footer>
  )
}
