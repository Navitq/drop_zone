import { createSlice, current } from '@reduxjs/toolkit';

interface BattlesRules {
    isVisible: boolean
}

interface ModalState {
    rulesBattleModal: BattlesRules,
}

const initialState: ModalState = {
    rulesBattleModal: {
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

    }
});



export const { showRulesModal, closeRulesModal } = modalSlice.actions;

export default modalSlice.reducer;
