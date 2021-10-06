import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import socketIOClient from "socket.io-client";
import { getListPorts, newConsoleMessage } from "./action";
const ENDPOINT = "http://127.0.0.1:4001";
const socket = socketIOClient(ENDPOINT, { transports: ["websocket"] });

function App() {
  const dispatch = useDispatch();
  const messages = useSelector(state => state.messagesConsole)
  const listPorts = useSelector(state => state.listPorts)
  const [input, setInput] = useState("")
  
  useEffect(() => {
    socket.on("COM:messageToFront", message => { //Recibo data del back
      dispatch(newConsoleMessage(message)); //La agrego al state de redux
    });
    socket.on("test2", testMessage => {
      console.log("Recibi: ", testMessage)
    })
    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
  }, []);

  function handleClickButtonList(e) {
    e.preventDefault();
    dispatch(getListPorts());
  }

  function handleSubmitForm(e) {
    e.preventDefault();
    //socket.emit("test", input)
    socket.emit("COM:MessageToBack", input) //Envio data al back
    setInput("")
  }
  function handleInputChange(e) {
    setInput(e.target.value)
  }

  return (
    <div>
      <div>
        <button onClick={handleClickButtonList}>Lista de puertos</button>
      </div>
      <div>
        {listPorts.map(port => <p>{port}</p>)}
      </div>
      <div>
        <form onSubmit={handleSubmitForm}>
          <input 
            placeholder="Mensaje"
            value={input}
            onChange={handleInputChange}
          />
        </form>
      </div>
      <div>
        {messages.map(res => <p>{res}</p>)}
      </div>
    </div>
  );
}

export default App;