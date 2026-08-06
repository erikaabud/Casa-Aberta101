require("dotenv").config();
 
const express = require("express");
const cors = require("cors");
 
const app = express();
 
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
 
const usuarioRoutes = require("./routes/usuarioRoutes");
const authRoutes = require("./routes/authRoutes");
const classeRoutes = require("./routes/classeRoutes");
const equipeRoutes = require("./routes/equipeRoutes");
const mundoRoutes = require("./routes/mundoRoutes");
const itemRoutes = require("./routes/itemRoutes");
 
app.use("/usuarios", usuarioRoutes);
app.use("/auth", authRoutes);
app.use("/classes", classeRoutes);
app.use("/equipes", equipeRoutes);
app.use("/mundo", mundoRoutes);
app.use("/itens", itemRoutes);

app.get("/health", (req, res) => {
  res.json({ ok: true });
});
 
const PORT = process.env.PORT || 3000;
 
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
