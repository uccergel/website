import Link from 'next/link'

export default function Header() {
  return (
    <header className="site-container py-6">
      <nav className="space-x-4">
        <Link href="/" >
          <a className='hover: gray-700'>Hakkımda</a>
        </Link>
        <Link href="/blog" >
          <a className='hover: gray-400'>Yazılar</a>
        </Link>
        <Link href="/bookmarks" >
          <a className='hover: gray-400'>Yer İmleri</a>
        </Link>
      </nav>
    </header>
  )
}
  