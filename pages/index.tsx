// next
import { useState } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'

// libs
import { Web3Storage } from 'web3.storage'
import { FileUploader } from 'react-drag-drop-files'

// initiate web3 storage
const client = new Web3Storage({ token: process.env.WEB3STORAGE_TOKEN })

const imageFromUrl = (url: string) => {
  const imageUrlRegex = /^(https?:\/\/.*\.(?:png|jpg|jpeg))$/
  if (!url.match(imageUrlRegex)) {
    console.log('invalid image url!')
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
    <div className="flex h-screen flex-col justify-center" onPaste={(e) => {
      if (e.clipboardData.files.length) {
        handleFileUpload(e.clipboardData.files[0])
      }
    }}>


      <nav className="p-6 text-center md:text-left">
        <h1 className="text-2xl font-semibold text-blue-400 cursor-pointer">de<span className="text-gray-200">mgur</span></h1>
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
                className="cursor-pointer py-5 px-20 text-gray-600 rounded-md border-2 border-dashed border-gray-700 p-10  outline-none transition-all hover:border-blue-500  focus:border-blue-500"
              >
                <p className="my-5 mx-15 flex flex-col gap-3 text-center text-xl ">
                  Click to upload<span className="text-gray-600">or</span> Drag
                  and drop image
                </p>
              </div>
            )}
          </FileUploader>
          <span className="text-md opacity-30 fixed bottom-4 hidden lg:block">
            ⚡ Tip for Pro User : You can also paste image from clipboard right away!
          </span>
          <span className="text-xl text-gray-600">or</span>
          <div className="flex">
            <input
              onChange={(e) =>
                setImageURL(e.target.checkValidity() ? e.target.value : '')
              }
              className="flex-1 rounded-md rounded-r-none border-[0.5px] border-gray-600 bg-transparent px-4 py-2 outline-none placeholder:text-gray-600 disabled:cursor-not-allowed lg:transition-all lg:focus:px-6"
              type="url"
              placeholder="Paste link to a image"
              disabled={disabled}
            />
            <button
              onClick={async () => {
                setDisabled(true)

                const image = await imageFromUrl(imageURL)
                if (image) {
                  handleFileUpload(image)
                } else {
                  alert("failed to fetch image from url")
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
      <footer className="p-6 text-center md:text-right text-gray-600 ">
        by{' '}
        <a className="hover:text-green-400" href="https://sudham.tk">
          sudham
        </a>
      </footer>
    </div>
  )
}

export default Home
