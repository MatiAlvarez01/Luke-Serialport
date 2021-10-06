const express = require("express");
const socketIo = require("socket.io");
const SerialPort = require("serialport");
const ReadLine = SerialPort.parsers.Readline;
const parser = new ReadLine();
const MockBinding = require("@serialport/binding-mock")
const index = require("./routes/index");
const PORT = process.env.PORT || 4001;

const app = express();
app.use(index);
const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
const io = socketIo(server);

//let port;
//const port = new SerialPort("", { baudRate: 9600 });
const port = new SerialPort("COM1", { baudRate: 9600 })
port.on("open", () => {
  console.log("Serial port opened");
  return res.status(200).send("Puerto serial abierto");
});
port.on("err", (err) => {
  console.log("Serial port error: ", err.message);
  return res.status(500).send("Serial por Error. Ver consola backend.");
})
// app.post("/newPort", (req, res, next) => {
//   const { portSelected, baudRate } = req.body;
//   port = new SerialPort(portSelected, {
//     baudRate: baudRate
//   });
//   if (port) {
//     port.on("open", () => {
//       console.log("Serial port opened");
//       return res.status(200).send("Puerto serial abierto");
//     });
//     port.on("err", (err) => {
//       console.log("Serial port error: ", err.message);
//       return res.status(500).send("Serial por Error. Ver consola backend.");
//     })
//   };
// })

app.get("/portList", async (req, res, next) => {
  const list = await SerialPort.list();
  console.log("Listas de port: ", list)
  return res.status(200).send(list)
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
});
