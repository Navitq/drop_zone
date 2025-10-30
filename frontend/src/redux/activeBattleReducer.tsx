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
}

interface ussualItemInt {
    case_id?: string
    icon_url: string
    id: string
    item_model: string
    item_style: string
    pk?: string
    price: number
    rarity: string
    state: 'factory_new' | 'minimal_wear' | 'field_tested' | 'well_worn' | 'battle_scarred'
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


interface WinnerCollectinItemInt {
    case_id: string,
    item: ussualItemInt
}

interface WinnerCollItemInt {
    case_id: string,
    items: ussualItemInt[]
}

interface PlayerData {
    avatar_url: string,
    id: string,
    username: string,
}



interface PlayersGameDataInt {
    player: PlayerData,
    lose_items: ussualItemInt[],
    items: WinnerCollectinItemInt[]
}

interface ussualItemIntFront {
    case_id?: string,
    imgPath: string,
    id: string,
    gunModel: string,
    gunStyle: string,
    gunPrice: number
    pk?: string,
    price: number,
    rarity: string,
    type: 'usuall' | 'rare' | 'elite' | 'epic' | 'classified',
    state: 'factory_new' | 'minimal_wear' | 'field_tested' | 'well_worn' | 'battle_scarred'
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
    won_items: []
    winner: PlayersInfo[]
    isGameFinished: boolean,
    totalCaseAmount: number,
    totalPrice: number,
    winner_collection: ussualItemInt[],
    players_items: PlayersGameDataInt[],
    isGameStart: boolean,
    activeCaseRoulleteItems: ussualItemIntFront[],
    rounds_amount: number,
    call_amount: number,
    wonRoundsGuys: string[],
    wonRoundsPrice: number,
    showRoundWinner: boolean,
    call_price_amount: number
}



const initialState: ActiveBattle = {
    won_items: [],
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
    winner_collection: [],
    players_items: [],
    isGameStart: false,
    activeCaseRoulleteItems: [],
    rounds_amount: 0,
    call_amount: 0,
    wonRoundsGuys: [],
    wonRoundsPrice: 0,
    showRoundWinner: false,
    call_price_amount: 0,
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
            Object.assign(state, { ...initialState, cases: [], activeCaseRoulleteItems: [], winner_collection: [], players: [], winner: [], players_ids: [], won_items: [], players_items: [] });
        },
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        setStartGameData: (state, action: PayloadAction<any>) => {
            state.winner_id = action.payload.winner_id
            state.winner_collection = action.payload.won_data.map((obj: WinnerCollItemInt) => obj.items).flat();
            state.players_items = [...action.payload.players_items]
            state.rounds_amount = action.payload.players_items[0].items.length;

            state.active_round++;
        },
        setActiveCaseData: (state, action: PayloadAction<ussualItemIntFront[]>) => {
            state.activeCaseRoulleteItems = [...action.payload]
            state.isGameStart = true;
        },
        openWonState: (state) => {
            state.call_amount++;
            if (state.call_amount < state.players_amount) {
                return;
            }
            state.isGameFinished = true;
            state.isGameStart = false;
            state.call_amount = 0;
        },
        // setWinnerColor: (state, action: PayloadAction<{ price: number, id: string }>) => {
        //     ++state.call_price_amount;
        //     console.log(action.payload.price)
        //     if (state.wonRoundsPrice < action.payload.price) {
        //         state.wonRoundsPrice = action.payload.price;
        //         state.wonRoundsGuys = [action.payload.id]
        //     } else if (state.wonRoundsPrice == action.payload.price) {
        //         state.wonRoundsGuys.push(action.payload.id)
        //     }
        //     if (state.call_price_amount === state.players_amount) {

        //         if (state.wonRoundsGuys.length === state.players_amount && state.rounds_amount != state.active_round) {
        //             state.wonRoundsGuys = []
        //             console.log("round ", state.active_round, " price ", state.wonRoundsPrice)
        //             return;
        //         }
        //         if (state.rounds_amount == state.active_round) {

        //             state.wonRoundsGuys = [state.winner_id]
        //         }
        //         console.log("round ", state.active_round, " price ", state.wonRoundsPrice)
        //         state.wonRoundsPrice = 0;
        //         state.wonRoundsGuys = []
        //         state.showRoundWinner = true;
        //     }
        //     return
        // },
        setWinnerColor: (state, action: PayloadAction<{ price: number; id: string }>) => {
            state.call_price_amount++;
            const { price, id } = action.payload;



            // Определяем лидера по цене
            if (price > state.wonRoundsPrice) {
                state.wonRoundsPrice = price;
                state.wonRoundsGuys = [id];
            } else if (price === state.wonRoundsPrice) {
                state.wonRoundsGuys.push(id);
            }

            // Все игроки сделали ход
            if (state.call_price_amount >= state.players_amount) {

                // Если все выиграли одинаково, просто сброс
                if (state.wonRoundsGuys.length === state.players_amount && state.rounds_amount !== state.active_round) {
                    state.wonRoundsGuys = [];
                    state.wonRoundsPrice = 0;
                    state.call_price_amount = 0;
                    return;
                }

                // Если последний раунд — ставим победителя
                if (state.rounds_amount === state.active_round) {
                    state.wonRoundsGuys = [state.winner_id];
                }

                // Показываем экран победы
                state.showRoundWinner = true;

                // сбрасываем значения для следующего раунда
                state.wonRoundsPrice = 0;
                state.call_price_amount = 0;
            }
        },

        changeRoundNumber: (state) => {
            state.call_amount++;
            if (state.call_amount < state.players_amount) {
                return;
            }
            state.active_round++;
            state.call_amount = 0;
            state.wonRoundsGuys = [];
            state.wonRoundsPrice = 0;
            state.showRoundWinner = false;
            state.call_price_amount = 0;
        },
        changeStartGameState: (state, action: PayloadAction<boolean>) => {
            state.isGameStart = action.payload;
        },
        setPlayers: (state, action: PayloadAction<PlayersInfo[]>) => {
            state.players = [
                ...action.payload, // реальные игроки
                ...Array.from({ length: state.players_amount - action.payload.length }).map(() => ({
                    id: "",
                    imgpath: "",
                    username: "",
                    money_amount: 0,
                }))
            ];
        }

    }
});



export const { changeRoundNumber, setWinnerColor, openWonState, cleanBattleData, changeStartGameState, setBattleData, setPlayers, setStartGameData, setActiveCaseData } = activerBattleSlice.actions;

export default activerBattleSlice.reducer;
