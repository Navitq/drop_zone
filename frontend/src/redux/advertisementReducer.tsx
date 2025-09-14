import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AdvertisementItemInt {
    title: { "en": string, "ru": string },
    subTitle: { "en": string, "ru": string },
    imgUrl: string,
    timer?: number,
}

interface AdvertisementInt {
    advertisementItems: AdvertisementItemInt[],
}

const initialState: AdvertisementInt = {
    advertisementItems: [],
};

export const advertisementSlice = createSlice({
    name: 'advertisement',
    initialState,
    reducers: {
        setAdvertisement: (state, actions: PayloadAction<AdvertisementItemInt[]>) => {
            state.advertisementItems = actions.payload;
        },
        cleanAdvertisement: (state) => {
            state.advertisementItems = [];
        },
    }
});



export const { setAdvertisement, cleanAdvertisement } = advertisementSlice.actions;

export default advertisementSlice.reducer;
