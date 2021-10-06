import axios from "axios";
import {
    NEW_CONSOLE_MESSAGE,
    GET_LIST_PORTS,
    SELECT_PORT,
    CLOSE_PORT
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
            .catch(err => {
                console.log("ERROR: ", err)
            })
    }
}

export function selectPort(port) {
    return function(dispatch) {
        return axios.post("http://localhost:4001/newPort", { portSelected: port })
            .then(data => {
                dispatch({
                    type: SELECT_PORT,
                    payload: data.data
                })
            })
            .catch(err => {
                console.log("ERROR: ", err)
            })
    }
}

export function closePort() {
    return function(dispatch) {
        return axios.get("http://localhost:4001/closePort")
            .then(data => {
                dispatch({
                    type: CLOSE_PORT,
                    payload: data.data
                })
            })
            .catch(err => {
                console.log("ERROR: ", err)
            })
    }
}