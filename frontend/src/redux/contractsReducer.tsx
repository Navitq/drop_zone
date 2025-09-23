import { createSlice, PayloadAction } from '@reduxjs/toolkit';



type items_state = 'factory_new' | 'minimal_wear' | 'field_tested' | 'well_worn' | 'battle_scarred'


interface gunItemModel {
    id: string,
    imgPath: string,
    gunModel: string,
    gunStyle: string,
    gunPrice: number,
    state: items_state,
    type: "usuall" | "rare" | "elite" | "epic" | "classified",
}

interface initialStateInt {
    itemClientData: gunItemModel[],
    addedItems: string[],
    wonItem: gunItemModel,
}


const initialState: initialStateInt = {
    itemClientData: [],
    addedItems: [],
    wonItem: {
        id: "",
        imgPath: "",
        gunModel: "",
        gunStyle: "",
        gunPrice: 0,
        state: "battle_scarred",
        type: "usuall",
    },
};

export const contractsSlice = createSlice({
    name: 'contracts',
    initialState,
    reducers: {
        setClientItemData: (state, actions: PayloadAction<gunItemModel>) => {
            if (state.itemClientData.length >= 10) {
                return;
            }
            const exists = state.itemClientData.some(item => item.id === actions.payload.id);
            if (!exists) {
                state.itemClientData.push(actions.payload);
            }
            return;
        },

        removeClientItemData: (state, action: PayloadAction<string>) => {
            state.itemClientData = state.itemClientData.filter(
                (item) => item.id !== action.payload
            );
        },

        clearAllClientItemData: (state) => {
            state.itemClientData = [];
        },

        setWonItem: (state, actions: PayloadAction<gunItemModel>) => {
            state.wonItem = actions.payload;
        },

    }
});



export const { removeClientItemData, setClientItemData, clearAllClientItemData, setWonItem } = contractsSlice.actions;

export default contractsSlice.reducer;
