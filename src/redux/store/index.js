import {createStore} from 'redux'
import reducer from './../reduce'
import {persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
const persistConfig = {
    key: 'root',
    storage: storage
}
const persistedReducer = persistReducer(persistConfig,reducer); 
const store = createStore(persistedReducer)
export default store;