import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getListPorts, newConsoleMessage } from "./action";
import socketIOClient from "socket.io-client";
import styled from "styled-components";
import PortCardComponent from "./components/PortCard/PortCard";
const ENDPOINT = "http://127.0.0.1:4001";
const socket = socketIOClient(ENDPOINT, { transports: ["websocket"] });

const PortsSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
`
const ButtonDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 1%;
`
const ButtonListPort = styled.button`

`
const CardsSection = styled.section`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`
const ComunicationSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
`
const FormDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const MessagesDiv = styled.div`
  text-align: center
`
const Form = styled.form`
`

function App() {
  const dispatch = useDispatch();
  const messages = useSelector(state => state.messagesConsole)
  const listPorts = useSelector(state => state.listPorts)
  const [input, setInput] = useState("")
  const [portSelected, setPortSelected] = useState(false)
  
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
    socket.emit("COM:MessageToBack", input) //Envio data al back
    setInput("")
  }
  function handleInputChange(e) {
    setInput(e.target.value)
  }
  
  return (
    <div>
      <PortsSection>
        <ButtonDiv>
          <ButtonListPort onClick={handleClickButtonList}>Lista de puertos</ButtonListPort>
        </ButtonDiv>
        <CardsSection>
          {listPorts.map((port) => (
            <PortCardComponent portDetails={port} statePort={portSelected} setStatePort={setPortSelected}/>
            ))
          }
        </CardsSection>
      </PortsSection>
      <ComunicationSection>
        <FormDiv>
          <Form onSubmit={handleSubmitForm}>
            <input 
              placeholder="Mensaje"
              value={input}
              onChange={handleInputChange}
            />
          </Form>
        </FormDiv>
        <MessagesDiv>
          {messages.map(res => <p>{res}</p>)}
        </MessagesDiv>
      </ComunicationSection>
    </div>
  );
}

export default App;