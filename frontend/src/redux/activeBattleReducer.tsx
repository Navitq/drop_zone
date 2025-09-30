import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type playersAmountInt = 0 | 2 | 3 | 4;

type gameRoundInt = 0 | 1 | 2 | 3;

interface CaseName {
    en: string;
    ru: string;
}

interface GameCase {
    id: string;           // UUID
    name: CaseName;       // Название на нескольких языках
    imgpath: string;      // Ссылка на изображение
    price: number;        // Цена
    case_amount: number;  // Количество
}

interface PlayersInfo {
    id: string;           // UUID
    imgpath: string;      // Ссылка на изображение
    username: string;
    money_amount: number;
}

interface IncomeServerData {
    cases: GameCase[],
    created_at: string,
    ended_at: string
    creator_id: string,
    id: string,
    is_active: boolean,
    players_amount: playersAmountInt,
    players: PlayersInfo[],
    players_ids: string[],
    winner_id: string,
    winner: PlayersInfo[]
}


interface ActiveBattle {
    active_round: gameRoundInt,
    cases: GameCase[],
    created_at: string,
    ended_at: string
    creator_id: string,
    id: string,
    is_active: boolean,
    players_amount: playersAmountInt,
    players: PlayersInfo[],
    players_ids: string[],
    winner_id: string,
    winner: PlayersInfo[]
    isGameFinished: boolean,
    totalCaseAmount: number,
    totalPrice: number
}

const initialState: ActiveBattle = {
    active_round: 0,
    cases: [],
    isGameFinished: false,
    created_at: "",
    ended_at: "",
    creator_id: "",
    id: "",
    is_active: false,
    players_amount: 0,
    players: [],
    players_ids: [],
    winner_id: "",
    winner: [],
    totalCaseAmount: 0,
    totalPrice: 0,
};

export const activerBattleSlice = createSlice({
    name: 'activeBattle',
    initialState,
    reducers: {
        setBattleData: (state, action: PayloadAction<IncomeServerData>) => {
            const { cases, players, winner, players_ids, ...rest } = action.payload;
            Object.assign(state, rest);

            // создаём копии массивов
            state.cases = [...cases];
            state.players = [
                ...players, // данные из payload
                ...Array.from({ length: state.players_amount - players.length }).map(() => ({
                    id: "",
                    imgpath: "",
                    username: "",
                    money_amount: 0,
                }))
            ];
            state.players_ids = [...players_ids];
            state.winner = [...winner];
            state.totalCaseAmount = Number(state.cases.reduce((sum, c) => sum + c.case_amount, 0).toFixed(0));
            state.totalPrice = Number(
                state.cases.reduce((sum, c) => sum + c.price * c.case_amount, 0).toFixed(2)
            );
        },
        cleanBattleData: (state) => {
            Object.assign(state, { ...initialState, cases: [], players: [], winner: [], players_ids: [] });
        },

    }
});



export const { setBattleData } = activerBattleSlice.actions;

export default activerBattleSlice.reducer;
