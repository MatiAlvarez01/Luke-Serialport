import {
    NEW_CONSOLE_MESSAGE,
    GET_LIST_PORTS,
    SELECT_PORT
} from "../action/constants";
var initialState = {
    messagesConsole: [],
    listPorts: [],
    portSelected: {}
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
        case SELECT_PORT:
            return {
                ...state,
                portSelected: action.payload
            }
        default:
            return {
                ...state
            }
    }
}

export default reducer;