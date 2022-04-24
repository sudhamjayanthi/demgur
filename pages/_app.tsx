import '../styles/globals.css'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="bg-gray-900 text-gray-300">
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
