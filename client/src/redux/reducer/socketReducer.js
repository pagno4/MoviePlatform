import {createSlice} from '@reduxjs/toolkit';

export const socket = createSlice({
    name: 'socket',
    initialState: {
        notice: 0,
        list: []
    },
    reducers: {
        eventNotice: (state, action) => {
            const {id, title, category} = action.payload
            const newItem = {
                id: id, title: title, category: category
            }
            return {
                ...state,
                notice: state.notice + 1,
                list: [
                    ...state.list,
                    newItem
                ]
            }
        },
        resetNotice: (state) => {
            return {
                ...state,
                notice: 0,
            }
        },
        resetList: (state) => {
            return {
                ...state,
                list: []
            }
        }
    }
});

export const {eventNotice, resetNotice, resetList} = socket.actions;
export default socket.reducer;


