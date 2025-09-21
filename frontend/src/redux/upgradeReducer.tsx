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
    upgradeFinished: {
        newItem: gunItemModel,
        itemToDelete: string,
    }
    itemServerData: gunItemModel,
    price: number,
    serverPrice: number,
    gameState: {
        result: "win" | "lose" | "",
        visible: boolean,
        text: string,
    },
    priceСoefficient: number,
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
    upgradeFinished: {
        newItem: {
            id: "",
            imgPath: "",
            gunModel: "",
            gunStyle: "",
            gunPrice: 0,
            state: "battle_scarred",
            type: "usuall",
        },
        itemToDelete: "",
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
    gameState: {
        visible: false,
        text: "",
        result: ""
    },
    priceСoefficient: 0,
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
        addOneItemsFrom: (state, actions: PayloadAction<{ newItem?: gunItemModel, itemToDelete?: string }>) => {
            if (actions.payload.newItem) {
                state.upgradeFinished.newItem.id = actions.payload.newItem.id;
                state.upgradeFinished.newItem.imgPath = actions.payload.newItem.imgPath;
                state.upgradeFinished.newItem.gunModel = actions.payload.newItem.gunModel;
                state.upgradeFinished.newItem.gunStyle = actions.payload.newItem.gunStyle;
                state.upgradeFinished.newItem.gunPrice = actions.payload.newItem.gunPrice;
                state.upgradeFinished.newItem.state = actions.payload.newItem.state;
                state.upgradeFinished.newItem.type = actions.payload.newItem.type;
            }
            if (actions.payload.itemToDelete) {
                state.upgradeFinished.itemToDelete = actions.payload.itemToDelete;
            }
        },
        removeFinishedItem: (state) => {
            state.upgradeFinished.newItem.id = "";
            state.upgradeFinished.newItem.imgPath = "";
            state.upgradeFinished.newItem.gunModel = "";
            state.upgradeFinished.newItem.gunStyle = "";
            state.upgradeFinished.newItem.gunPrice = 0;
            state.upgradeFinished.newItem.state = 'battle_scarred';
            state.upgradeFinished.newItem.type = "usuall";
        },
        clearGameState: (state) => {
            state.gameState.visible = false;
            state.gameState.text = "";
            state.gameState.result = "";
        },
        setGameState: (state, actions: PayloadAction<{ text: string, result: "win" | "lose" | "" }>) => {
            state.gameState.visible = true;
            state.gameState.text = actions.payload.text;
            state.gameState.result = actions.payload.result;
        },
        setPriceСoefficient: (state, actions: PayloadAction<number>) => {
            state.priceСoefficient = actions.payload;
        },
        clearPriceСoefficient: (state) => {
            state.priceСoefficient = 0;
        },
    }
});



export const { setPriceСoefficient, clearPriceСoefficient, setGameState, clearGameState, removeFinishedItem, addOneItemsFrom, setServerItemToUpgrade, clearServerItemToUpgrade, setItemToUpgrade, clearItemToUpgrade, setPriceBuyTipe, clearPrice } = upgradeSlice.actions;

export default upgradeSlice.reducer;
