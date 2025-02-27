
import { createSlice, current } from "@reduxjs/toolkit"
import noteService from '../services/notes'

const noteSlice = createSlice({
    name: 'notes',
    initialState: [],
    reducers: {
        toggleImportanceOf(state, action) {
            const id = action.payload
            console.log("state: ", current(state).notes)
            const noteToChange = state.notes.find(n => n.id === id)

            if (noteToChange) {
                const changedNote = {
                    ...noteToChange,
                    important: !noteToChange.important
                }

                // Updating the state immutably using .map on state.notes
                state.notes = state.notes.map(note =>
                    note.id !== id ? note : changedNote
                )
            }
        },
        appendNote(state, action) {
            state.push(action.payload)
        },
        setNotes(state, action) {
            return action.payload
        }
    },
})

export const { toggleImportanceOf, appendNote, setNotes } = noteSlice.actions

export const initializeNotes = () => {
    return async dispatch => {
        const notes = await noteService.getAll()
        dispatch(setNotes(notes))
    }
}

export const createNote = content => {
    return async dispatch => {
        const newNote = await noteService.createNew(content)
        dispatch(appendNote(newNote))
    }
}

export default noteSlice.reducer