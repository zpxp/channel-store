
export enum storeEvents {
	UPDATE_STATE = "@store/UPDATE_STATE",
	CLEAR_STATE = "@store/CLEAR_STATE",
	STATE_UPDATED = "@store/STATE_UPDATED",
	GET_STATE = "@store/GET_STATE"
}

export interface IStoreEvents<State extends object> {
	"@store/UPDATE_STATE": UPDATE_STATE_DATA<State>;
	"@store/CLEAR_STATE": undefined;
	"@store/STATE_UPDATED": State;
	"@store/GET_STATE": State;
}

export type UPDATE_STATE_DATA<State extends object = any> = ((oldState: State) => Partial<State>) | Partial<State>;
