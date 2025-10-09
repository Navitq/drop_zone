import { createSlice } from '@reduxjs/toolkit';
import { number } from 'motion';

type items_state = 'factory_new' | 'minimal_wear' | 'field_tested' | 'well_worn' | 'battle_scarred'
type items_type = "usuall" | "rare" | "elite" | "epic" | "classified"

interface CaseName {
    en: string;
    ru: string;
}

interface ProfileData {
    id: string,
    username: string,
    email: string,
    avatar_url: string,
    money_amount: number,
    provider: string,
    stats: {
        total_case_opened: number,
        total_upgrades: number,
        total_raffles: number,
        total_battles: number,
        total_contracts: number,
    },
    best_case: { id: string, imgPath: string, name: CaseName } | "" | string,
    best_skin: { id: string, imgPath: string, name: CaseName, gunPrice: string, gunModel: string, gunStyle: string, state?: items_state, type: items_type } | "" | string,
}



export const initialState: ProfileData = {
    id: "",
    username: "",
    email: "",
    avatar_url: "",
    money_amount: 0,
    provider: "",
    stats: {
        total_case_opened: 0,
        total_upgrades: 0,
        total_raffles: 0,
        total_battles: 0,
        total_contracts: 0,
    },
    best_case: "",
    best_skin: "",
};

export const userSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfileData: (state, action: PayloadAction<ProfileData>) => {
            const data = action.payload;

            state.id = data.id;
            state.username = data.username;
            state.email = data.email;
            state.avatar_url = data.avatar_url;
            state.money_amount = data.money_amount;
            state.provider = data.provider;
            state.stats = { ...data.stats };

            // best_case
            if (typeof data.best_case === 'string') {
                try {
                    state.best_case = data.best_case ? JSON.parse(data.best_case) : "";
                } catch {
                    state.best_case = "";
                }
            } else {
                state.best_case = data.best_case || "";
            }

            // best_skin
            if (typeof data.best_skin === 'string') {
                try {
                    state.best_skin = data.best_skin ? JSON.parse(data.best_skin) : "";
                } catch {
                    state.best_skin = "";
                }
            } else {
                state.best_skin = data.best_skin || "";
            }
        },
        clearProfileData: () => {
            return {
                ...initialState,
                stats: { ...initialState.stats } // новый объект, копия значений
            };
        }
    }
});



// Action creators are generated for each case reducer function
export const { setProfileData, clearProfileData } = userSlice.actions;

export default userSlice.reducer;
