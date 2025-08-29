import express from "express";
import cors from "cors";
import empleadosRutas from "./routes/empleados.js";
import { opcionesCors } from "./config/corsConfig.js";

const app = express();

app.use(cors(opcionesCors));
app.use(express.json());
app.use(express.urlencoded());

app.use("/empleados", empleadosRutas);

app.listen(3000, () => {
  console.log("Microservicio en puerto: 3000");
});
