import { createSlice, current } from '@reduxjs/toolkit';

interface UserData {
    id: number;
    username: string;
    email: string;
    phone: string;
    address: string;
    image: string;
    accountType: "Steam" | "Google" | "Vk" | "";
}

interface AuthState {
    userData: UserData;
    isAuth: boolean;
    isLoading: boolean;
    error: string | null | object;
}

const initialState: AuthState = {
    userData: {
        id: 0,            // число
        username: '',
        email: '',
        phone: '',
        address: '',
        accountType: "",
        image: '/images/user_mock.jpg' // путь к изображению
    },
    isAuth: false,
    isLoading: false,
    error: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // setAdditionalGood: (state, action) => {
        //     state.ordersList[`${rawData.payload.id}`] = rawData.payload.amount;
        // },
    }
});



// Action creators are generated for each case reducer function
// export const {  } = userSlice.actions;

export default userSlice.reducer;
