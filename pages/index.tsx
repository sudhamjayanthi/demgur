// next
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'

// libs
import { FileUploader } from 'react-drag-drop-files'
import { Web3Storage } from 'web3.storage'

// initiate web3 storage
const client = new Web3Storage({ token: process.env.WEB3STORAGE_TOKEN })

const imageFromUrl = (url: string) => {
  return fetch(url)
    .then((res) => res.blob())
    .then(
      (blob) =>
        new File([blob], 'demgur.' + blob.type.split('/')[1], {
          type: blob.type,
        })
    )
    .catch((err) =>
      console.error('error occured while trying to fetch image : ', err)
    )
}

const Home: NextPage = () => {
  const router = useRouter()
  const [imageURL, setImageURL] = useState('')

  const handleChange = async (file: File) => {
    try {
      const cid = await client.put([file])
      console.log('uploading image with cid:', cid)
      router.push(`/success/${cid}/${encodeURIComponent(file.name)}`)
    } catch (error) {
      console.error('error occured while uploading image to ipfs : ', error)
    }
  }

  return (
    <div className="flex h-screen flex-col justify-center">
      <Head>
        <title>Demgur • Decentralised Image Hosting</title>
      </Head>
      <nav className="p-6">
        <h1 className="text-2xl font-semibold text-blue-400">demgur</h1>
      </nav>
      <main className="align-center flex flex-1 flex-col items-center justify-center">
        <h2 className="mb-14 text-2xl font-bold md:text-3xl md:font-bold lg:text-5xl lg:font-extrabold">
          One-click image upload to{' '}
          <span className="bg-gradient-to-r from-blue-400 to-green-500  bg-clip-text text-transparent">
            IPFS
          </span>
        </h2>
        <div className="flex flex-col items-center justify-center gap-6 rounded-md p-10">
          <FileUploader
            handleChange={handleChange}
            name="file"
            hoverTitle={'Drop here'}
            label={'hello world'}
            types={['JPG', 'PNG']}
          >
            <div className="cursor-pointer rounded-md border-2 border-dashed border-gray-700 p-10">
              <p className="my-5 mx-20 flex flex-col gap-3 text-center text-xl">
                Click to upload<span className="text-gray-600">or</span> Drag
                and drop image
              </p>
            </div>
          </FileUploader>
          <span className="text-xl text-gray-600">or</span>
          <div>
            <input
              onChange={(e) =>
                setImageURL(e.target.checkValidity() ? e.target.value : '')
              }
              className="flex-1 rounded-md rounded-r-none border-[0.5px] border-gray-700 bg-transparent px-4 py-2 focus:outline-none"
              type="url"
              placeholder="Enter a image url"
            />
            <button
              onClick={async () => {
                const image = await imageFromUrl(imageURL)
                if (image) {
                  handleChange(image)
                }
              }}
              className="rounded-md rounded-l-none bg-blue-600 px-4 py-2 text-white"
            >
              Upload
            </button>
          </div>
        </div>
      </main>
      <footer className="flex justify-between p-6 text-right text-gray-600">
        <span>inspired by imgur</span>
        <span>
          built with love by <a href="https://sudham.tk">sudham</a>
        </span>
      </footer>
    </div>
  )
}

export default Home
