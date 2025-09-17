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
    itemData: gunItemModel,
    itemServerData: gunItemModel,
    price: number,
    serverPrice: number,
}


const initialState: initialStateInt = {
    itemData: {
        id: "",
        imgPath: "",
        gunModel: "",
        gunStyle: "",
        gunPrice: 0,
        state: "battle_scarred",
        type: "usuall",
    },
    itemServerData: {
        id: "",
        imgPath: "",
        gunModel: "",
        gunStyle: "",
        gunPrice: 0,
        state: "battle_scarred",
        type: "usuall",
    },
    price: 0,
    serverPrice: 0,
};

export const upgradeSlice = createSlice({
    name: 'upgrade',
    initialState,
    reducers: {
        setItemToUpgrade: (state, actions: PayloadAction<gunItemModel>) => {
            state.itemData.id = actions.payload.id;
            state.itemData.imgPath = actions.payload.imgPath;
            state.itemData.gunModel = actions.payload.gunModel;
            state.itemData.gunStyle = actions.payload.gunStyle;
            state.itemData.gunPrice = actions.payload.gunPrice;
            state.itemData.state = actions.payload.state;
            state.itemData.type = actions.payload.type;
            state.price = actions.payload.gunPrice;
        },
        clearItemToUpgrade: (state) => {
            state.itemData.id = "";
            state.itemData.imgPath = "";
            state.itemData.gunModel = "";
            state.itemData.gunStyle = "";
            state.itemData.gunPrice = 0;
            state.itemData.state = "battle_scarred";
            state.itemData.type = "usuall";
            state.price = 0;
        },
        clearServerItemToUpgrade: (state) => {
            state.itemServerData.id = "";
            state.itemServerData.imgPath = "";
            state.itemServerData.gunModel = "";
            state.itemServerData.gunStyle = "";
            state.itemServerData.gunPrice = 0;
            state.itemServerData.state = "battle_scarred";
            state.itemServerData.type = "usuall";
            state.serverPrice = 0;
        },
        setServerItemToUpgrade: (state, actions: PayloadAction<gunItemModel>) => {
            state.itemServerData.id = actions.payload.id;
            state.itemServerData.imgPath = actions.payload.imgPath;
            state.itemServerData.gunModel = actions.payload.gunModel;
            state.itemServerData.gunStyle = actions.payload.gunStyle;
            state.itemServerData.gunPrice = actions.payload.gunPrice;
            state.itemServerData.state = actions.payload.state;
            state.itemServerData.type = actions.payload.type;
            state.serverPrice = actions.payload.gunPrice;
        },
        setPriceBuyTipe: (state, actions: PayloadAction<number>) => {
            state.price = actions.payload;
        },
        clearPrice: (state) => {
            state.price = 0;
        },
    }
});



export const { setServerItemToUpgrade, clearServerItemToUpgrade, setItemToUpgrade, clearItemToUpgrade, setPriceBuyTipe, clearPrice } = upgradeSlice.actions;

export default upgradeSlice.reducer;
