import { configureStore } from '@reduxjs/toolkit'
import userReducer, { initialState as userInitialState } from '@/redux/userReducer'
import modalReducer from '@/redux/modalReducer'
import battlesCreateReducer from '@/redux/battlesCreateReducer'
import activeBattleReducer from '@/redux/activeBattleReducer'
import advertisementReducer from '@/redux/advertisementReducer'
import upgradeReducer from '@/redux/upgradeReducer'
import contractsReducer from '@/redux/contractsReducer'

import { merge } from 'lodash'

// export const makeStore = () => {
//   return configureStore({
//     reducer: {
//         user: userReducer,
//         modal: modalReducer,
//         battlesCreate: battlesCreateReducer,
//         activeBattle: activeBattleReducer
//     },
//   })
// }


interface UserData {
    id: number;
    username: string;
    email: string;
    phone: string;
    address: string;
    avatar: string;
    accountType: "Steam" | "Google" | "Vk" | "";
}

interface AuthState {
    userData?: UserData;
    isAuth?: boolean;
    isLoading?: boolean;
}


export const makeStore = (preloadedState: Partial<AuthState> = {} ) => configureStore({
  reducer: {
    user: userReducer,
    modal: modalReducer,
    battlesCreate: battlesCreateReducer,
    activeBattle: activeBattleReducer,
    advertisement: advertisementReducer,
    upgrade: upgradeReducer,
    contracts: contractsReducer,
  },
  preloadedState:  {
    user: merge({}, userInitialState, preloadedState),
  },

      // если есть другие редьюсеры с preloadedState, делаем аналогично // --- передаём initial state
})

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
