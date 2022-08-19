// import Header from "./header"
import Pre from './pre'
export const mdxComponents = {
  pre: ({ children }) => <Pre {...children.props} />

  // Header,
  //contentin içerisine <Header /> eklenirse o zaman görüntülenmektedir.

  // p: (props) => <p className="text-blue-900" {...props} />
}
