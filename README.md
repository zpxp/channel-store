# channel-store

![Bundlephobia gzip + minified](https://badgen.net/bundlephobia/minzip/channel-store)

A `channel-event` middleware to create an ambient state that functions similar to `redux` but without the large amount of boilerplate and verbosity.

### Installation

`yarn add channel-store`

`npm install channel-store`

### Use

``` tsx
import { createHub } from "channel-event";
import { createStoreMiddleware, IStoreEvents } from "channel-store";

export interface AppStore {
   count: number
}


const hub = createHub(...);

const store = createStoreMiddleware<AppStore>(hub)
                  .addDefaultState({ count: 4 })
                  .build();


const channel = hub.newChannel<IStoreEvents>();

channel.send(storeEvents.UPDATE_STATE, state => ({ count: state.count + 1 }))


```

To read the store 

``` tsx

const state = store.getState();

// or
const state = channel.send(storeEvents.GET_STATE);


// listen to state change
channel.listen(storeEvents.STATE_UPDATED, data => {
   const newState = data.payload;
});

```