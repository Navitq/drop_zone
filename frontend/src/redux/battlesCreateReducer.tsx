import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { number } from 'motion';

interface CaseInfo {
    casesId: string;
    caseName: string;
    caseImgPath: string;
    caseAmount: number;
    unitPrice: number;
}

interface BattlesInfo {
    createBtlData: CaseInfo[], // массив кейсов
    totalPrice: number,
    totalCaseAmount: number,
}

const initialState: BattlesInfo = {
    createBtlData: [], // массив кейсов
    totalCaseAmount: 0,
    totalPrice: 0,
};

export const battlesCreateSlice = createSlice({
    name: 'battlesCreate',
    initialState,
    reducers: {
        cleanCreateField: (state) => {
            state.createBtlData = [];
            state.totalPrice = 0;
            state.totalCaseAmount = 0;
        },

        addNewCase: (state, action: PayloadAction<CaseInfo>) => {
            const currentSum = state.createBtlData.reduce(
                (sum, c) => sum + c.caseAmount,
                0
            );
            if (currentSum + action.payload.caseAmount > 3) {
                return;
            }
            const existingCase = state.createBtlData.find(
                (c) => c.casesId === action.payload.casesId
            );

            if (existingCase) {
                existingCase.caseAmount += 1;
                state.totalPrice = state.totalPrice + existingCase.unitPrice;
            } else {
                state.createBtlData[state.createBtlData.length] = action.payload;
                state.totalPrice = state.totalPrice + action.payload.unitPrice;
            }
            ++state.totalCaseAmount;
        },

        removeCase: (state, action: PayloadAction<string>) => {
            const currentSum = state.createBtlData.reduce(
                (sum, c) => sum + c.caseAmount,
                0
            );
            if (currentSum <= 0) {
                return;
            }
            const existingCase = state.createBtlData.find(
                (c) => c.casesId === action.payload
            );
            if (!existingCase) {
                return;
            }

            state.totalPrice = state.totalPrice - existingCase.unitPrice;

            if (existingCase.caseAmount == 1) {
                state.createBtlData = state.createBtlData.filter(
                    (c) => c.casesId !== action.payload
                );
            } else {
                existingCase.caseAmount -= 1;
            }
            --state.totalCaseAmount;
        },

    }
});



export const { cleanCreateField, addNewCase, removeCase } = battlesCreateSlice.actions;

export default battlesCreateSlice.reducer;
