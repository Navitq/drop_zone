import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BattlesRules {
    isVisible: boolean
}

type items_state = 'factory_new' | 'minimal_wear' | 'field_tested' | 'well_worn' | 'battle_scarred'


interface GunData {
    id: string
    gunModel: string
    gunStyle: string
    gunPrice: number
    imgPath: string
    type: "usuall" | "rare" | "elite" | "epic" | "classified",
    state: items_state,
    inventory_id?: string
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
    caseName: string;
    items: GunData[];
    prize_item: GunData | null;
    prize_index: number,
}

interface unAuthModalInt {
    isVisible: boolean;
}

interface noMoneyModalInt {
    isVisible: boolean;
}

interface rafflesModalInt {
    isVisible: boolean;
    title: string,
    sub_title: string
}

interface ModalState {
    rulesBattleModal: BattlesRules,
    createBattleModal: BattlesRules,
    userModal: BattlesRules,
    stCaseModal: StCaseInt,
    paymentModal: PaymentInt,
    rulletCaseModal: rulletCaseModalInt,
    unAuthModal: unAuthModalInt,
    noMoneyModal: noMoneyModalInt,
    rafflesModal: rafflesModalInt,
}

const initialState: ModalState = {
    rafflesModal: {
        isVisible: false,
        title: "",
        sub_title: ""
    },
    unAuthModal: {
        isVisible: false
    },
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
    noMoneyModal: {
        isVisible: false
    },
    rulletCaseModal: {
        isVisible: false,
        caseId: '',
        caseName: '',
        items: [],
        prize_item: null,
        prize_index: -1,
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
        showRulletCaseModal: (state, actions: PayloadAction<{ caseId: string, caseName: string, items: GunData[], prize_item: GunData }>) => {
            console.log(actions.payload)
            const index: number = actions.payload.items.findIndex(item => item.id === actions.payload.prize_item.id);
            state.rulletCaseModal.items = actions.payload.items;
            console.log(index, state.rulletCaseModal.items[index], actions.payload.prize_item, 454545454)
            if (index !== -1) {
                state.rulletCaseModal.items[index] = actions.payload.prize_item;
                state.rulletCaseModal.prize_index = index;
            } else {
                state.rulletCaseModal.prize_index = -1;
            }
            state.rulletCaseModal.isVisible = true;
            state.rulletCaseModal.caseId = actions.payload.caseId;
            state.rulletCaseModal.caseName = actions.payload.caseName;
            state.rulletCaseModal.prize_item = actions.payload.prize_item;
        },
        closeRulletCaseModal: (state) => {
            state.rulletCaseModal.isVisible = false;
            state.rulletCaseModal.caseId = '';
            state.rulletCaseModal.caseName = '';
            state.rulletCaseModal.items = [];
            state.rulletCaseModal.prize_item = null;
            state.rulletCaseModal.prize_index = -1;
        },
        closeUnAuthModal: (state) => {
            state.unAuthModal.isVisible = false;
        },
        showUnAuthModal: (state) => {
            state.unAuthModal.isVisible = true;
        },
        closeNoMoneyModal: (state) => {
            state.noMoneyModal.isVisible = false;
        },
        showNoMoneyModal: (state) => {
            state.noMoneyModal.isVisible = true;
        },
        closeRafflesStateModal: (state) => {
            state.rafflesModal.isVisible = false;
            state.rafflesModal.title = "";
            state.rafflesModal.sub_title = "";
        },
        showRafflesStateModal: (state, actions: PayloadAction<{ title: string, sub_title: string }>) => {
            state.rafflesModal.isVisible = true;
            state.rafflesModal.title = actions.payload.title;
            state.rafflesModal.sub_title = actions.payload.sub_title;
        },
    }
});



export const { closeRafflesStateModal, showRafflesStateModal, showNoMoneyModal, closeNoMoneyModal, showUnAuthModal, closeUnAuthModal, showRulletCaseModal, closeRulletCaseModal, showPaymentModal, closePaymentModal, closeStCaseModal, showStCaseModal, closeUserModal, showUserModal, showRulesModal, closeRulesModal, showBattleCreateModal, closeBattleCreateModal } = modalSlice.actions;

export default modalSlice.reducer;
