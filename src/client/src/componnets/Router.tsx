import { Routes, useGlobalStore } from "../store/global"
import GamePage from "../pages/game";
import HomePage from "../pages/home";
import JoinOrCreatePage from "../pages/joinOrCreate";

const Router = () => {
  const { currentRoute } = useGlobalStore();
  switch (currentRoute) {
    case Routes.Game: 
      return <GamePage />;
    case Routes.Home:
      return <HomePage />
    case Routes.JoinOrCreate:
      return <JoinOrCreatePage />
  }
}

export default Router