import "@/styles/globals.css";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

library.add(fas, fab)

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
