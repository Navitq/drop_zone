import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type playersAmountRange = 2 | 3 | 4;

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
    playersAmount: playersAmountRange
}

const initialState: BattlesInfo = {
    createBtlData: [],
    totalCaseAmount: 0,
    totalPrice: 0,
    playersAmount: 2,
};

export const battlesCreateSlice = createSlice({
    name: 'battlesCreate',
    initialState,
    reducers: {
        cleanCreateField: (state) => {
            state.createBtlData = [];
            state.totalPrice = 0;
            state.totalCaseAmount = 0;
            state.playersAmount = 2;
        },

        setPlayersAmount: (state, action: PayloadAction<playersAmountRange>) => {
            state.playersAmount = action.payload;
        },

        addNewCase: (state, action: PayloadAction<CaseInfo>) => {
            const currentSum: number = state.createBtlData.reduce(
                (sum, c) => sum + c.caseAmount,
                0
            );
            if (currentSum >= 3) {
                return;
            }

            const existingCase: CaseInfo | undefined = state.createBtlData.find(
                (c) => c.casesId === action.payload.casesId
            );

            if (existingCase) {
                ++existingCase.caseAmount;
                state.totalPrice = state.totalPrice + existingCase.unitPrice;
            } else {
                const newCase = {
                    ...action.payload,
                    caseAmount: action.payload.caseAmount + 1
                };
                state.createBtlData.push(newCase);
                state.totalPrice += newCase.unitPrice;
            }
            ++state.totalCaseAmount;
        },

        removeCase: (state, action: PayloadAction<string>) => {
            const currentSum: number = state.createBtlData.reduce(
                (sum, c) => sum + c.caseAmount,
                0
            );
            if (currentSum <= 0) {
                return;
            }
            const existingCase: CaseInfo | undefined = state.createBtlData.find(
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



export const { cleanCreateField, addNewCase, removeCase, setPlayersAmount } = battlesCreateSlice.actions;

export default battlesCreateSlice.reducer;
