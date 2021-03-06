import { EventMiddleware, IHub } from "channel-event";
import { storeEvents, UPDATE_STATE_DATA } from "./events";
import { MiddlewareBuilder } from "./builder";

/**
 * Creates a `channel-event` middleware that intercepts data and stores it inside a state that can be accessed at any time
 * @param options store configuration
 */
export function createStoreMiddleware<State extends object = any>(hub: IHub): MiddlewareBuilder<State> {
	return new MiddlewareBuilder<State>(opts => handleCreateStoreMiddleware<State>(hub, opts));
}

function handleCreateStoreMiddleware<State extends object = any>(hub: IHub, options: Options): StoreContext<State> {
	let state: State = options.defaultState as State;

	const channelEventStoreMiddleware: EventMiddleware<State> = function(context, next, channel) {
		if (context.type === storeEvents.GET_STATE) {
			// dont call next just return state
			return state;
		}

		if (context.type === storeEvents.UPDATE_STATE || context.type === storeEvents.CLEAR_STATE) {
			// first invoke listeners for these events
			next(context);

			if (context.type === storeEvents.UPDATE_STATE) {
				const update: UPDATE_STATE_DATA = context.payload;
				let newStore = null;

				// merge in new store
				if (typeof update === "function") {
					newStore = { ...state, ...update(state) };
				} else {
					newStore = { ...state, ...update };
				}

				state = newStore;

				// notify store updated
				channel.send(storeEvents.STATE_UPDATED, state);
			} else if (context.type === storeEvents.CLEAR_STATE) {
				state = options.defaultState as State;

				// notify store updated
				channel.send(storeEvents.STATE_UPDATED, state);
			}

			// we override the return and return the current state
			return state;
		} else {
			// non store event. default behaviour
			return next(context);
		}
	};

	hub.addEventMiddleware(channelEventStoreMiddleware);

	return {
		middleware: channelEventStoreMiddleware,
		getState: function() {
			return state;
		}
	};
}

export type Options<State extends object = any> = {
	defaultState?: Partial<State>;
};

export interface StoreContext<State extends object = any> {
	/**
	 * The middleware function that is automaticly passed to `hub.addEventMiddleware`
	 */
	middleware: EventMiddleware<State>;
	/**
	 * Return the current state
	 */
	getState(): State;
}
