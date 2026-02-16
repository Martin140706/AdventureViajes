const mysql = require("mysql2");
require("dotenv").config();

const conexion = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

conexion.connect((err) => {
  if (err) {
    console.error("❌ Error de conexión a BD:", err);
    return;
  }
  console.log("✅ Conexión exitosa a la base de datos");
});

module.exports = conexion;