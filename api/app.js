const express = require("express");
const socketIo = require("socket.io");
const SerialPort = require("serialport");
const cors = require("cors");
const bodyParser = require("body-parser");
const ReadLine = SerialPort.parsers.Readline;
const parser = new ReadLine();
const MockBinding = require("@serialport/binding-mock")
const index = require("./routes/index");
const PORT = process.env.PORT || 4001;

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(index);
app.use(cors({
  origin: "http://localhost:3000"
}))
const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
const io = socketIo(server);

let port;
//const port = new SerialPort("", { baudRate: 9600 });
//const port = new SerialPort("COM1", { baudRate: 9600 })
//const port2 = new SerialPort("COM2", { baudRate: 9600 })
// port.on("open", () => {
//   console.log("Serial port 1 opened");
// });
// port.on("err", (err) => {
//   console.log("Serial port 1 error: ", err.message);
// })
// port2.on("open", () => {
//   console.log("Serial port 2 opened");
// });
// port2.on("err", (err) => {
//   console.log("Serial port 2 error: ", err.message);
// })
app.get("/portList", async (req, res, next) => {
  const list = await SerialPort.list();
  return res.status(200).send(list)
})

app.post("/newPort", (req, res, next) => {
  const { portSelected, baudRate } = req.body;
  port = new SerialPort(portSelected, {
    baudRate: 9600
  });
  if (port) {
    port.on("open", () => {
      console.log("Serial port opened");
      return res.status(200).send("Puerto serial abierto");
    });
    port.on("err", (err) => {
      console.log("Serial port error: ", err.message);
      return res.status(500).send("Serial por Error. Ver consola backend.");
    })
  };
})

app.get("/closePort", async (req, res, next) => {
  port.close((err) => {
    if (err) {
      console.log("ERROR CLOSE PORT: ", err)
      return res.status(500).send("Error. Ver consola backend")
    } else {
      console.log("Port closed")
      return res.status(200).send("Port closed")
    }
  })
})

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
  socket.on("test", data => {
      console.log("test recibido desde front: ", data)
      socket.emit("test2", `Te lo devuelvo: ${data}`)
  });
  socket.on("COM:MessageToBack", (message) => { //Recibo data del Front para el COM port
    console.log("Recibi del front: ", message)
    port.write(message) //O Buffer.from(message)
  })
  if (port) { //Recibo data del COM port para el Back y lo mando al Front
    port.on("data", (data) => {
      console.log("Message From SerialPort: ", data.toString());
      io.emit("COM:messageToFront", data.toString());
    });
  };
  //------------------//
  // port2.on("data", (messageRec) => {
  //   console.log("sabes que si: ", messageRec.toString())
  //   port2.write("Mensaje del port2")
  //   io.emit("COM:messageToFront", messageRec.toString());
  // })
  // port.on("data", (mensajePort2) => {
  //   console.log(mensajePort2.toString())
  //   io.emit("COM:messageToFront", mensajePort2.toString());
  // })
});
