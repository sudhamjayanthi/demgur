// next
import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'

// libs
import { FileUploader } from 'react-drag-drop-files'
import { Web3Storage } from 'web3.storage'
import { Gluejar } from '@charliewilco/gluejar'
import { blob } from 'stream/consumers'
// initiate web3 storage
const client = new Web3Storage({ token: process.env.WEB3STORAGE_TOKEN })

const imageFromUrl = (url: string) => {
  // image url regex
  const imageUrlRegex = /^(https?:\/\/.*\.(?:png|jpg|jpeg))$/
  if (!url.match(imageUrlRegex)) {
    console.log('invalid url!')
    return
  }
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
  const [disabled, setDisabled] = useState(false)

  const handleFileUpload = async (file: File) => {
    setDisabled(true)
    try {
      const cid = await client.put([file])
      console.log('uploading image with cid:', cid)
      router.push(`/success/${cid}/${encodeURIComponent(file.name)}`)
    } catch (error) {
      console.error('error occured while uploading image to ipfs : ', error)
      setDisabled(false)
    }
  }

  return (
    <div className="flex h-screen flex-col justify-center">
      <Head>
        <title>Demgur • Decentralised Image Hosting</title>
      </Head>

      {typeof window !== 'undefined' ? (
        <Gluejar
          onError={(err) => console.log('error pasting file : ', err)}
          onPaste={
            async (files) => {
             alert("paste upload - wip :)") 
              // console.log(files)
              // let extension = await fetch(files.images[0])
              //   .then((r) => r.blob())
              //   .then((blob) => blob.type.split("/")[1])
              
              // console.log(extension)
            }

            // handleFileUpload(new File([files.images[0]], "demgur"))
            // console.log(new File(files.images[0], 'demgur.jpg'))
          }
          container={document.body}
          acceptedFiles={['image/png', 'image/jpeg', 'image/jpg']}
        />
      ) : null}
      <nav className="p-6">
        <h1 className="text-2xl font-semibold text-blue-400">demgur</h1>
      </nav>
      <main className="align-center flex flex-1 flex-col items-center justify-center">
        <h2 className="mb-14 text-2xl font-bold md:text-3xl md:font-bold lg:text-5xl lg:font-extrabold">
          <span className="bg-gradient-to-r from-blue-400 to-green-500  bg-clip-text text-transparent">
            One-click image upload to IPFS
          </span>
        </h2>
        <div className="flex flex-col items-center justify-center gap-6 rounded-md p-10">
          <FileUploader
            handleChange={handleFileUpload}
            name="file"
            hoverTitle={'Drop here'}
            label={'hello world'}
            types={['JPG', 'PNG']}
            disabled={disabled}
          >
            {!disabled && (
              <div
                tabIndex={0}
                className="cursor-pointer rounded-md border-2 border-dashed border-gray-700 p-10  outline-none transition-all hover:p-12 focus:border-blue-500"
              >
                <p className="my-5 mx-20 flex flex-col gap-3 text-center text-xl ">
                  Click to upload<span className="text-gray-600">or</span> Drag
                  and drop image
                </p>
              </div>
            )}
          </FileUploader>
          <span className="text-md opacity-30">
            💡 tip : paste image directly from clipboard using{' '}
            <code className="rounded-md bg-gray-300/10 px-2 py-1 font-mono text-sm hover:text-green-600">
              Ctrl + V
            </code>
          </span>
          <span className="text-xl text-gray-600">or</span>
          <div className="flex">
            <input
              onChange={(e) =>
                setImageURL(e.target.checkValidity() ? e.target.value : '')
              }
              className="flex-1 rounded-md rounded-r-none border-[0.5px] border-gray-600 bg-transparent px-4 py-2 outline-none placeholder:text-gray-600 disabled:cursor-not-allowed lg:transition-all lg:focus:px-6"
              type="url"
              placeholder="enter a valid png or jpg url"
              disabled={disabled}
            />
            <button
              onClick={async () => {
                setDisabled(true)
                
                const image = await imageFromUrl(imageURL)
                if (image) {
                  handleFileUpload(image)
                } else {
                  setDisabled(false)
                }
              }}
              className="rounded-md rounded-l-none bg-blue-600 px-4 py-2 text-white outline-none transition-all hover:px-6 focus:scale-110 disabled:cursor-not-allowed"
              disabled={disabled}
            >
              Upload
            </button>
          </div>
        </div>
      </main>
      <footer className="p-6 text-right text-gray-600">
        by{' '}
        <a className="hover:text-green-400" href="https://sudham.tk">
          sudham
        </a>
      </footer>
    </div>
  )
}

export default Home
