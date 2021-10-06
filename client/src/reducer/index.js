import {
    NEW_CONSOLE_MESSAGE,
    GET_LIST_PORTS
} from "../action/constants";
var initialState = {
    messagesConsole: [],
    listPorts: []
}

function reducer(state = initialState, action) {
    switch(action.type) {
        case NEW_CONSOLE_MESSAGE:
            return {
                ...state,
                messagesConsole: [...state.messagesConsole, action.payload]
            }
        case GET_LIST_PORTS:
            return {
                ...state,
                listPorts: action.payload
            }
        default:
            return {
                ...state
            }
    }
}

export default reducer;