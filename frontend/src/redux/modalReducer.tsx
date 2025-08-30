import { createSlice } from '@reduxjs/toolkit';

interface BattlesRules {
    isVisible: boolean
}

interface ModalState {
    rulesBattleModal: BattlesRules,
    createBattleModal: BattlesRules,
}

const initialState: ModalState = {
    rulesBattleModal: {
        isVisible: false
    },
    createBattleModal: {
        isVisible: false
    },
};

export const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        showRulesModal: (state) => {
            state.rulesBattleModal.isVisible = true;
        },
        closeRulesModal: (state) => {
            state.rulesBattleModal.isVisible = false;
        },
        showBattleCreateModal: (state) => {
            state.createBattleModal.isVisible = true;
        },
        closeBattleCreateModal: (state) => {
            state.createBattleModal.isVisible = false;
        },
    }
});



export const { showRulesModal, closeRulesModal, showBattleCreateModal, closeBattleCreateModal } = modalSlice.actions;

export default modalSlice.reducer;
