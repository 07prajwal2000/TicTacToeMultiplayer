import { Routes, useGlobalStore } from "../store/global"
import GamePage from "../pages/game";
import HomePage from "../pages/home";

const Router = () => {
  const { currentRoute } = useGlobalStore();
  switch (currentRoute) {
    case Routes.Game: 
      return <GamePage />;
    case Routes.Home:
      return <HomePage />
  }
}

export default Router