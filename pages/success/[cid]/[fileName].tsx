// next
import type { NextPage } from 'next'
import { useRouter } from 'next/router'

import Success from "../../../components/Success"

const Image: NextPage = () => {
  const router = useRouter()
  const { cid, fileName } = router.query

  return <Success cid={cid} fileName={fileName} />
}

export default Image
