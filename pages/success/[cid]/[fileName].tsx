import type { NextPage } from 'next'
import { useRouter } from 'next/router'

const Image: NextPage = () => {
  const router = useRouter()
  const { cid, fileName } = router.query

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-10">
      <h1 className="text-3xl text-green-400 font-extrabold">Uploaded to IPFS successfully!</h1>
      <img
        className="w-1/5 rounded-lg object-contain"
        src={`https://ipfs.io/ipfs/${cid}/${fileName}`}
      />
    </div>
  )
}

export default Image
