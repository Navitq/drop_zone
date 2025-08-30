import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type playersAmountInt = 2 | 3 | 4;

interface CaseInfo {
    casesId: string;
    caseName: string;
    caseImgPath: string;
    caseAmount: number;
    unitPrice: number;
}

interface ActiveBattle {
    gameCases: CaseInfo[],
    totalCaseAmount: number,
    totalPrice: number
    playersAmount: playersAmountInt
}

const initialState: ActiveBattle = {
    gameCases: [],
    totalCaseAmount: 1,
    totalPrice: 1,
    playersAmount: 2
};

export const activerBattleSlice = createSlice({
    name: 'activeBattle',
    initialState,
    reducers: {
        setPlayersAmount: (state, actions: PayloadAction<playersAmountInt>) => {
            state.playersAmount = actions.payload;
        },
        setTotalPrice: (state, actions: PayloadAction<number>) => {
            state.totalPrice = actions.payload;;
        },
        setCases: (state, actions: PayloadAction<CaseInfo[]>) => {
            state.gameCases = [...actions.payload]
            const currentSum: number = actions.payload.reduce(
                (sum, c) => sum + c.caseAmount,
                0
            );
            state.totalPrice = currentSum;
        },
    }
});



export const { showRulesModal, closeRulesModal, showBattleCreateModal, closeBattleCreateModal } = activerBattleSlice.actions;

export default activerBattleSlice.reducer;
