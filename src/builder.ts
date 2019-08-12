import { Options, StoreContext } from "./storeMiddleware";

export class MiddlewareBuilder<State extends object = any> {
	private defaultState: State;
	private builder: (opts: Options<State>) => StoreContext<State>;

	constructor(builder: (opts: Options<State>) => StoreContext<State>) {
		this.builder = builder;
	}

	/**
	 * Apply configuration and return the store and middleware
	 */
	build(): StoreContext<State> {
		return this.builder({
			defaultState: this.defaultState
		});
	}

	/**
	 * Add a default state object that will be the initial state of the store
	 * @param defaultState 
	 */
	addDefaultState(defaultState: State) {
		this.defaultState = defaultState;
	}
}
