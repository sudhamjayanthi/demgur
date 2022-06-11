import Link from "next/link";
import { useEffect, useState } from 'react'

// confetti
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'

// tooltip
import 'react-tippy/dist/tippy.css'
import { Tooltip } from 'react-tippy'

const copyToClipboard = (text : string) => {
  const el = document.createElement('textarea')
  el.value = text
  el.setAttribute('readonly', '')
  el.style.position = 'absolute'
  el.style.left = '-9999px'
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
  alert("copied!")
}

const Success = ({ cid, fileName }: { cid: any; fileName: any }) => {
  const [imageSource, setImageSource] = useState('')
  const [loading, setLoading] = useState('')
  const { width, height } = useWindowSize()

  useEffect(() => {
    let ipfsGateway = `https://ipfs.io/ipfs/${cid}/${fileName}`
    let dwebGateway = `https://${cid}.dweb.link/${fileName}`

    setLoading("Loading image...")

    try {
      fetch(ipfsGateway)
        .then((res) => {
          if (res.ok) {
            setImageSource(ipfsGateway)
            console.log("using ipfs gateway")
          } else {
            fetch(dwebGateway).then((res) => {
              if (res.ok) {
                setImageSource(dwebGateway)
                console.log("using dweb gateway")
              } else {
                console.log('response :', res)
                setLoading('Failed to render image!')
              }
            }).catch((err) => {
              console.log('error occured', err)
              setLoading('Failed to render image!')
            })
          }
        })
        .catch((err) => {
          console.log('error occured', err)
          setLoading('Failed to render image!')
        })
    } catch (err) {
      console.log('error occured', err)
      setLoading('Failed to fetch image!')
    }
  }, [cid, fileName])

  return (
    <>
      <Confetti
        width={width}
        height={height}
        numberOfPieces={400}
        recycle={false}
        gravity={0.3}
      />
      <div className="flex h-screen flex-col items-center justify-center gap-10">
        <h1 className="text-4xl font-semibold text-white">
          Uploaded to IPFS successfully! 🎉
        </h1>
        {imageSource ? (
          <Link href={imageSource}>
            <img
              className="hover-link w-1/5 rounded-lg object-contain"
              src={imageSource}
            />
          </Link>
        ) : (
          loading
        )}
        <Tooltip
          title="click to copy"
          position="bottom"
          trigger="mouseenter "
          arrow={true}
        >
          <p onClick={() => copyToClipboard(`${cid + "/" + fileName}`)} className="cursor-pointer text-gray-500">
            CID : {cid + "/" + fileName}
          </p>
        </Tooltip>
        <Link href={"/"}>
          <span className="fixed bottom-6 right-6 cursor-pointer rounded-lg bg-blue-600 py-2 px-4 font-medium text-white">
            + new image
          </span>
        </Link>
      </div>
    </>
  )
}

export default Success
