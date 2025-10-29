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
                // ✅ ПОЛНОСТЬЮ заменяем карту новыми данными
                state.cards[idx] = updated;
                console.log('✅ Redux: карта обновлена');
            } else {
                console.warn('⚠️ Redux: карта не найдена для обновления');
            }
        },
        removeCard: (state, action) => {
            const cardId = action.payload;
            state.cards = state.cards.filter(card => card.id !== cardId);
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