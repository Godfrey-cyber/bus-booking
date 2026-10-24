import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    pagination: {
        page: 1,
        limit: 20,
    },
    searchTerm: '',
    selectedDestination: null,
    isAddModalOpen: false,
};

const destinationsSlice = createSlice({
    name: 'destinations',
    initialState,
    reducers: {
        setPage(state, action) {
            state.pagination.page = action.payload;
        },
        setLimit(state, action) {
            state.pagination.limit = action.payload;
            state.pagination.page = 1; // Reset to first page when limit changes
        },
        setSearchTerm(state, action) {
            state.searchTerm = action.payload;
            state.pagination.page = 1; // Reset to first page when searching
        },
        setSelectedDestination(state, action) {
            state.selectedDestination = action.payload;
        },
        setAddModalOpen(state, action) {
            state.isAddModalOpen = action.payload;
        },
        resetDestinationsState() {
            return initialState;
        },
    },
});

export const {
    setPage,
    setLimit,
    setSearchTerm,
    setSelectedDestination,
    setAddModalOpen,
    resetDestinationsState,
} = destinationsSlice.actions;

export default destinationsSlice.reducer;

// Selectors
export const selectDestinationsPagination = (state) => state.destinations.pagination;
export const selectDestinationsSearchTerm = (state) => state.destinations.searchTerm;
export const selectSelectedDestination = (state) => state.destinations.selectedDestination;
export const selectIsAddModalOpen = (state) => state.destinations.isAddModalOpen;