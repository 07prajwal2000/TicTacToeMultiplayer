import { create } from "zustand";

export enum Routes {
	Home,
	JoinOrCreate,
	Game,
}

type StoreType = {
	currentRoute: Routes;
	setRoute: (r: Routes) => void;
};

const store = create<StoreType>((set, get) => ({
	currentRoute: Routes.Home,
	setRoute(r) {
		set((s) => ({ ...s, currentRoute: r }));
	},
}));

export function useGlobalStore() {
	return store();
}
