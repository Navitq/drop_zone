'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from '@/lib/store'


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

interface StoreProviderProps {
    children: React.ReactNode
    preloadedState?: Partial<AuthState>
}

export default function StoreProvider({ children, preloadedState }: StoreProviderProps) {
    const storeRef = useRef<AppStore | null>(null)
    if (!storeRef.current) {
        // Create the store instance the first time this renders
        storeRef.current = makeStore(preloadedState)
    }

    return <Provider store={storeRef.current}>{children}</Provider>
}
