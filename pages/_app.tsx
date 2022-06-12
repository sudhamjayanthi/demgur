import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from "next/head"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="bg-gray-900 text-gray-300 selec">
      <Head>
        <title>Demgur • Decentralised Image Hosting</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />

        <script async src="https://cdn.splitbee.io/sb.js"></script>
      </Head>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
