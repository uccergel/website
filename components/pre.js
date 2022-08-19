import SyntaxHighlighter from 'react-syntax-highlighter'
import { docco } from 'react-syntax-highlighter/dist/cjs/styles/hljs'

const Pre = ({ children, className }) => {
  const lang = className.split('-')[1]

  return (
    <SyntaxHighlighter language={lang} style={docco}>
      {children}
    </SyntaxHighlighter>
  )
}

export default Pre
