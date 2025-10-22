import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface dropSliderState {
    userAmount: number,
    isTopActive: boolean,
    isSliderRun: boolean,
    sliderItems: CardItemInt[],
}

export const initialState: dropSliderState = {
    userAmount: 0,
    isTopActive: false,
    isSliderRun: true,
    sliderItems: []
};

export type ExteriorWear =
    | "factory_new"
    | "minimal_wear"
    | "field_tested"
    | "well_worn"
    | "battle_scarred";

export type Rarity =
    | "usuall"
    | "rare"
    | "classified"
    | "elite"
    | "epic";

export interface CardItemInt {
    case_id: string | null;
    id: string;
    imgPath: string;
    gunModel: string;
    gunStyle: string;
    rarity: Rarity;
    price: number,
    exterior_wear: ExteriorWear;
    userId: string;
    userImg: string;
    username: string;
    caseImg: string | null;
}

export const dropSliderSlice = createSlice({
    name: 'dropSlider',
    initialState,
    reducers: {
        setUserAmount: (state, actions: PayloadAction<number>) => {
            state.userAmount = actions.payload;
        },
        setTopActiveState: (state, actions: PayloadAction<boolean>) => {
            state.isTopActive = actions.payload;
        },
        setSliderRunState: (state, actions: PayloadAction<boolean>) => {
            state.isSliderRun = actions.payload;
        },
        setNewSliderData: (state, actions: PayloadAction<{ clientsAmount: number; items: CardItemInt[] }>) => {
            state.userAmount = actions.payload.clientsAmount;
            state.sliderItems = actions.payload.items;
        },
    }
});



// Action creators are generated for each case reducer function
export const { setUserAmount, setTopActiveState, setSliderRunState, setNewSliderData } = dropSliderSlice.actions;

export default dropSliderSlice.reducer;
