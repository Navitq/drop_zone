import { createSlice, current } from '@reduxjs/toolkit';

interface UserData {
    id: string;
    username: string;
    email: string;
    phone: string;
    address: string;
    avatar: string;
    provider: "Steam" | "Google" | "Vk" | "";
    money_amount: number
}

interface AuthState {
    userData: UserData;
    isAuth: boolean;
    isLoading: boolean;
    error: string | null | object;
}

export const initialState: AuthState = {
    userData: {
        id: '0',            // число
        username: '',
        email: '',
        phone: '',
        address: '',
        provider: "",
        avatar: '/images/user_mock.jpg', // путь к изображению
        money_amount: 720,
    },
    isAuth: false,
    isLoading: false,
    error: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload;
            state.isAuth = true;
            state.error = null;
        },
        clearUserData: (state) => {
            state.userData = initialState.userData;
            state.isAuth = false;
            state.error = null;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
});



// Action creators are generated for each case reducer function
// export const {  } = userSlice.actions;

export default userSlice.reducer;
