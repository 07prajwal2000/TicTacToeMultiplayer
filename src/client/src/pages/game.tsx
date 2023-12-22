import Link from '../componnets/Link'
import { Routes } from '../store/global'

const GamePage = () => {
  return (
    <div>
      <div>Game</div>
      <Link route={Routes.Home}>Goto Home</Link>
    </div>
  )
}

export default GamePage