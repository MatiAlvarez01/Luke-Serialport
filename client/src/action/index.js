import axios from "axios";
import {
    NEW_CONSOLE_MESSAGE,
    GET_LIST_PORTS
} from "./constants"

export function newConsoleMessage(message) {
    return function(dispatch) {
        dispatch({
            type: NEW_CONSOLE_MESSAGE,
            payload: message
        })
    }
}

export function getListPorts() {
    return function(dispatch) {
        return axios.get("http://localhost:4001/portList")
            .then(listPorts => {
                dispatch({
                    type: GET_LIST_PORTS,
                    payload: listPorts.data
                })
            })
    }
}