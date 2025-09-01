import { createSlice } from '@reduxjs/toolkit';

interface BattlesRules {
    isVisible: boolean
}

interface ModalState {
    rulesBattleModal: BattlesRules,
    createBattleModal: BattlesRules,
    userModal: BattlesRules,
}

const initialState: ModalState = {
    rulesBattleModal: {
        isVisible: false
    },
    createBattleModal: {
        isVisible: false
    },
    userModal: {
        isVisible: false
    }
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
        showUserModal: (state) => {
            state.userModal.isVisible = true;
        },
        closeUserModal: (state) => {
            state.userModal.isVisible = false;
        },
    }
});



export const { closeUserModal, showUserModal, showRulesModal, closeRulesModal, showBattleCreateModal, closeBattleCreateModal } = modalSlice.actions;

export default modalSlice.reducer;
