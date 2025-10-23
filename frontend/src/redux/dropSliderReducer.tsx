import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface QueueState {
    items: CardItemInt[];
    limit: number;
}

interface dropSliderState {
    userAmount: number,
    isTopActive: boolean,
    isSliderRun: boolean,
    sliderItems: CardItemInt[],
    queue: QueueState
}

export const initialState: dropSliderState = {
    userAmount: 0,
    isTopActive: false,
    isSliderRun: true,
    sliderItems: [],
    queue: {
        limit: 5,
        items: []
    }
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
            state.queue.items = [];
        },
        setNewSliderData: (state, actions: PayloadAction<{ clientsAmount: number; items: CardItemInt[] }>) => {
            state.userAmount = actions.payload.clientsAmount;
            state.sliderItems = actions.payload.items;
        },
        addToQueue: (state, action: PayloadAction<CardItemInt>) => {
            // Добавляем новый элемент в начало
            state.queue.items.unshift(action.payload);
            // Если длина превысила лимит — удаляем последний
            if (state.queue.items.length > state.queue.limit) {
                state.queue.items.pop();
            }
        },
        getFromQueue: (state) => {
            // Удаляем и возвращаем последний элемент
            state.queue.items.pop();
        },
        clearQueue: (state) => {
            state.queue.items = [];
        },
    }
});



// Action creators are generated for each case reducer function
export const { clearQueue, addToQueue, getFromQueue, setUserAmount, setTopActiveState, setSliderRunState, setNewSliderData } = dropSliderSlice.actions;

export default dropSliderSlice.reducer;
