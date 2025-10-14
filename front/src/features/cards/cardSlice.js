import { createSlice } from "@reduxjs/toolkit";

const cardSlice = createSlice({
    name: "cards",
    initialState: {
        cards: [],      // все карты пользователя
        loading: false,
        error: null
    },
    reducers: {
        setCards: (state, action) => {
            state.cards = action.payload;
            state.error = null;
        },
        addCard: (state, action) => {
            state.cards.push(action.payload);
        },
        updateCard: (state, action) => {
            const updated = action.payload;
            const idx = state.cards.findIndex(card => card.id === updated.id);
            if (idx !== -1) {
                state.cards[idx] = { ...state.cards[idx], ...updated };
            }
        },
        removeCard: (state, action) => {
            state.cards = state.cards.filter(card => card.id !== action.payload);
        },
        setCardError: (state, action) => {
            state.error = action.payload;
        },
        setCardLoading: (state, action) => {
            state.loading = action.payload;
        },
        clearCards: (state) => {
            state.cards = []
            state.loading = false
            state.error = null
        }
    }
});

export const { setCards, addCard, updateCard, removeCard, setCardError, setCardLoading, clearCards } = cardSlice.actions;
export default cardSlice.reducer;
