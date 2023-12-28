import { create } from "zustand";

export enum Routes {
	Home,
	Game,
}

type StoreType = {
	currentRoute: Routes;
	setRoute: (r: Routes) => void;
	roomDetails: {
		setValue: (id: string, password: string, username: string) => void;
		id: string;
		password: string;
		username: string;
	};
};

const store = create<StoreType>((set) => ({
	currentRoute: Routes.Home,
	setRoute(r) {
		set((s) => ({ ...s, currentRoute: r }));
	},
	roomDetails: {
		id: '',
		password: '',
		username: '',
		setValue(id, password, username) {
			set((p) => ({
				...p,
				roomDetails: {
					...p.roomDetails, id, password, username
				}
			}));
		},
	}
}));

export function useGlobalStore() {
	return store();
}
