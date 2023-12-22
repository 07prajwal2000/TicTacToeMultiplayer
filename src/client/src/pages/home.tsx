import Link from '../componnets/Link'
import { Routes } from '../store/global'

const HomePage = () => {
  return (
    <div>
      <div>HomePage</div>
      <Link route={Routes.Game}>Goto Game page</Link>
    </div>
  )
}

export default HomePage