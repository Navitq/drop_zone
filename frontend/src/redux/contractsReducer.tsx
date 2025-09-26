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
    contractsFinished: {
        newItem: gunItemModel,
        itemToDelete: string[],
    }
}


const initialState: initialStateInt = {
    itemClientData: [],
    addedItems: [],
    contractsFinished: {
        newItem: {
            id: "",
            imgPath: "",
            gunModel: "",
            gunStyle: "",
            gunPrice: 0,
            state: "battle_scarred",
            type: "usuall",
        },
        itemToDelete: [],
    }
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
            state.contractsFinished.newItem.id = actions.payload.id;
            state.contractsFinished.newItem.imgPath = actions.payload.imgPath;
            state.contractsFinished.newItem.gunModel = actions.payload.gunModel;
            state.contractsFinished.newItem.gunStyle = actions.payload.gunStyle;
            state.contractsFinished.newItem.gunPrice = actions.payload.gunPrice;
            state.contractsFinished.newItem.state = actions.payload.state;
            state.contractsFinished.newItem.type = actions.payload.type;
            state.contractsFinished.itemToDelete = state.itemClientData.map(item => item.id);
        },
        removeWonItem: (state) => {
            state.contractsFinished.newItem.id = "";
            state.contractsFinished.newItem.imgPath = "";
            state.contractsFinished.newItem.gunModel = "";
            state.contractsFinished.newItem.gunStyle = "";
            state.contractsFinished.newItem.gunPrice = 0;
            state.contractsFinished.newItem.state = "battle_scarred";
            state.contractsFinished.newItem.type = "usuall";
            state.contractsFinished.itemToDelete = [];
            state.itemClientData = []
        },
        removeDeletedItems: (state) => {
            state.itemClientData = []
        },

    }
});

export const { removeClientItemData, removeDeletedItems, setClientItemData, clearAllClientItemData, setWonItem, removeWonItem } = contractsSlice.actions;

export default contractsSlice.reducer;
