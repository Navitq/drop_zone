import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface dropSliderState {
    userAmount: number,
    isTopActive: boolean,
    isSliderRun: boolean,
}

export const initialState: dropSliderState = {
    userAmount: 0,
    isTopActive: false,
    isSliderRun: true,
};

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
    }
});



// Action creators are generated for each case reducer function
export const { setUserAmount, setTopActiveState, setSliderRunState } = dropSliderSlice.actions;

export default dropSliderSlice.reducer;
