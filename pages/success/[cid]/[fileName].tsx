// next
import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
const Success = dynamic(() => import('../../../components/Success'), {
  ssr: false,
})

const Image: NextPage = () => {
  const router = useRouter()
  const { cid, fileName } = router.query

  return <Success cid={cid} fileName={fileName} />
}

export default Image
