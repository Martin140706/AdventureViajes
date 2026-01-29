const mysql = require("mysql");

const conexion = mysql.createConnection({
  host: "localhost",
  user: "AdViajes",
  password: "AdvViajes",
  database: "adventureviajes",
});

conexion.connect((err) => {
  if (err) {
    console.error("error de conexión:", err);
    return;
  }
  console.log("Conexión exitosa a la base de datos");
});

module.exports = conexion;
// Exportar la conexión para usarla en otros módulos
