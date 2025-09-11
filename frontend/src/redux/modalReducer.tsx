import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { strict } from 'assert';

interface BattlesRules {
    isVisible: boolean
}

interface GunData {
    id: string
    gunModel: string
    gunStyle: string
    gunPrice: number
    imgPath: string
    type: "usuall" | "rare" | "elite" | "epic" | "classified"
}


interface StCaseInt {
    isVisible: boolean;
    caseId: string;
    caseItems: GunData[];
    caseName: string
}

interface PaymentInt {
    isVisible: boolean;
}

interface rulletCaseModalInt {
    isVisible: boolean;
    caseId: string;
}

interface ModalState {
    rulesBattleModal: BattlesRules,
    createBattleModal: BattlesRules,
    userModal: BattlesRules,
    stCaseModal: StCaseInt,
    paymentModal: PaymentInt,
    rulletCaseModal: rulletCaseModalInt,
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
    },
    stCaseModal: {
        isVisible: false,
        caseId: "",
        caseName: "",
        caseItems: []
    },
    paymentModal: {
        isVisible: false
    },
    rulletCaseModal: {
        isVisible: false,
        caseId: ""
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
        showStCaseModal: (state, actions: PayloadAction<{ caseId: string, caseName: string, items: GunData[] }>) => {
            state.stCaseModal.caseId = actions.payload.caseId;
            state.stCaseModal.caseName = actions.payload.caseName;
            state.stCaseModal.caseItems = actions.payload.items;
            state.stCaseModal.isVisible = true;
        },
        closeStCaseModal: (state) => {
            state.stCaseModal.isVisible = false;
            state.stCaseModal.caseId = ""
            state.stCaseModal.caseItems = []
            state.stCaseModal.caseName = ""
        },
        showPaymentModal: (state) => {
            state.paymentModal.isVisible = true;
        },
        closePaymentModal: (state) => {
            state.paymentModal.isVisible = false;
        },
        showRulletCaseModal: (state, actions: PayloadAction<string>) => {
            state.rulletCaseModal.isVisible = true;

        },
        closeRulletCaseModal: (state) => {
            state.rulletCaseModal.isVisible = false;
            state.rulletCaseModal.caseId = ""
        }
    }
});



export const { showRulletCaseModal, closeRulletCaseModal, showPaymentModal, closePaymentModal, closeStCaseModal, showStCaseModal, closeUserModal, showUserModal, showRulesModal, closeRulesModal, showBattleCreateModal, closeBattleCreateModal } = modalSlice.actions;

export default modalSlice.reducer;
