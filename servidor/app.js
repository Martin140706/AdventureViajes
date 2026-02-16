const nodemailer = require("nodemailer");
require ("dotenv").config()

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((err) => {
  if (err) {
    console.log("❌ Error mail:", err);
  } else {
    console.log("✅ Mail conectado");
  }
});


const http = require("http");
const fs = require("fs");
const path = require("path");
const querystring = require("querystring");
const conexion = require("./db/conexion");

// MIME types
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

// Función para insertar pedido
function agregarPedido(email, total, callback) {
  const sql = "INSERT INTO pedidos (email, total) VALUES (?, ?)";
  conexion.query(sql, [email, total], (err, resultado) => {
    if (err) return callback(err);
    callback(null, resultado.insertId);
  });
}

// Función para borrar carrito del usuario
function borrarTodoElCarrito(callback) {
  const sqlVuelos = "DELETE FROM vuelos";
  const sqlAutos = "DELETE FROM autos";
  const sqlPaquetes = "DELETE FROM paquetes";

  conexion.query(sqlVuelos, (err) => {
    if (err) return callback(err);
    conexion.query(sqlAutos, (err) => {
      if (err) return callback(err);
      conexion.query(sqlPaquetes, (err) => {
        if (err) return callback(err);
        callback(null);
      });
    });
  });
}

function parseTotalStrToFloat(str) {
  if (typeof str !== "string") return NaN;
  // Eliminar puntos de miles y cambiar coma decimal por punto
  const limpio = str.replace(/\./g, "").replace(/,/g, ".");
  return parseFloat(limpio);
}

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/registrar") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const datos = querystring.parse(body);
      const nombre = datos.nombre;
      const email = datos.email;
      const contrasena = datos.contrasena;

      const sql =
        "INSERT INTO usuarios (nombre, email, contrasena) VALUES (?, ?, ?)";
      conexion.query(sql, [nombre, email, contrasena], (err, resultado) => {
        if (err) {
          console.error("Error al insertar datos:", err);
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Error al registrar");
        } else {
          console.log("Usuario registrado con éxito");
          res.writeHead(302, { Location: "/" }); // redirige a inicio
          res.end();
        }
      });
    });
  } else if (req.method === "POST" && req.url === "/login") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const datos = querystring.parse(body);
      const email = datos.email;
      const contrasena = datos.contrasena;

      // 🔒 Si es el admin, devolvemos JSON con redirección
      if (email === "admin@gmail.com" && contrasena === "123123") {
        res.writeHead(200, {
          "Set-Cookie": `usuario_email=${email}; HttpOnly`,
          "Content-Type": "application/json",
        });
        res.end(JSON.stringify({ redirect: "/adminn/admin.html" }));
        return;
      }

      // 🔍 Si no es admin, consultamos en la base de datos
      const sql = "SELECT * FROM usuarios WHERE email = ? AND contrasena = ?";
      conexion.query(sql, [email, contrasena], (err, resultados) => {
        if (err) {
          console.error("Error al buscar usuario:", err);
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Error interno del servidor");
          return;
        }

        if (resultados.length > 0) {
          console.log("Inicio de sesión exitoso para:", email);
          res.writeHead(200, {
            "Set-Cookie": `usuario_email=${email}; HttpOnly`,
            "Content-Type": "application/json",
          });
          res.end(JSON.stringify({ redirect: "/vuelos/vuelos.html" }));
        } else {
          console.log("Credenciales inválidas");
          res.writeHead(401, { "Content-Type": "text/plain" });
          res.end("Credenciales incorrectas");
        }
      });
    });

    return;
  } else if (req.method === "GET" && req.url === "/obtener-nombre") {
    const cookie = req.headers.cookie;
    const email = cookie?.split("usuario_email=")[1]?.split(";")[0];

    if (!email) {
      res.writeHead(401, { "Content-Type": "text/plain" });
      res.end("No autorizado");
      return;
    }

    const sql = "SELECT nombre, email FROM usuarios WHERE email = ?";
    conexion.query(sql, [email], (err, resultados) => {
      if (err || resultados.length === 0) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Usuario no encontrado");
        return;
      }

      const nombre = resultados[0].nombre;
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ nombre }));
    });
  } else if (req.method === "POST" && req.url === "/guardar-vuelo") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const datos = JSON.parse(body);

      const sql = `INSERT INTO vuelos (origen, destino, fecha, precio) VALUES (?, ?, ?, ?)`;
      conexion.query(
        sql,
        [datos.origen, datos.destino, datos.fecha, datos.precio],
        (err, resultado) => {
          if (err) {
            console.error("Error al guardar vuelo:", err);
            res.writeHead(500);
            res.end("Error al guardar vuelo");
          } else {
            res.writeHead(200);
            res.end("Vuelo guardado con éxito");
          }
        }
      );
    });
  } else if (req.method === "GET" && req.url === "/obtener-vuelos") {
    const sql = "SELECT * FROM vuelos"; // 👈 esto debe incluir la columna `hora`
    conexion.query(sql, (err, resultados) => {
      if (err) {
        res.writeHead(500);
        res.end("Error al obtener vuelos");
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(resultados));
      }
    });
  } else if (req.method === "POST" && req.url === "/borrar-vuelo") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        console.log("Body recibido:", body); // 👈 AGREGALO
        const datos = JSON.parse(body);
        console.log("Datos parseados:", datos); // 👈 AGREGALO

        const id = Number(datos.id_vuelo);
        console.log("ID parseado:", id); // 👈 AGREGALO

        if (!id || isNaN(id)) {
          res.writeHead(400, { "Content-Type": "text/plain" });
          res.end("ID no proporcionado o inválido");
          return;
        }

        const sql = "DELETE FROM vuelos WHERE id_vuelo = ?";
        conexion.query(sql, [id], (err, resultado) => {
          if (err) {
            console.error("Error al borrar vuelo:", err);
            res.writeHead(500);
            res.end("Error al borrar vuelo");
            return;
          }

          if (resultado.affectedRows === 0) {
            console.log("No se encontró el vuelo con ese ID.");
            res.writeHead(404);
            res.end("Vuelo no encontrado");
            return;
          }

          console.log("Vuelo eliminado correctamente");
          res.writeHead(200);
          res.end("Vuelo eliminado");
        });
      } catch (e) {
        console.error("Error al parsear JSON:", e); // 👈 CLAVE
        res.writeHead(400);
        res.end("Error en el cuerpo de la solicitud");
      }
    });
  } else if (req.method === "POST" && req.url === "/borrar-paquete") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const datos = JSON.parse(body);
        const id = Number(datos.id_paquete);

        if (!id || isNaN(id)) {
          res.writeHead(400, { "Content-Type": "text/plain" });
          res.end("ID no proporcionado o inválido");
          return;
        }

        const sql = "DELETE FROM paquetes WHERE id_paquete = ?";
        conexion.query(sql, [id], (err, resultado) => {
          if (err) {
            console.error("Error al borrar paquete:", err);
            res.writeHead(500);
            res.end("Error al borrar paquete");
            return;
          }

          if (resultado.affectedRows === 0) {
            res.writeHead(404);
            res.end("Paquete no encontrado");
            return;
          }

          console.log("Paquete eliminado correctamente");
          res.writeHead(200);
          res.end("Paquete eliminado");
        });
      } catch (e) {
        console.error("Error al parsear JSON:", e);
        res.writeHead(400);
        res.end("Error en el cuerpo de la solicitud");
      }
    });
  } else if (req.method === "POST" && req.url === "/guardar-auto") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const datos = JSON.parse(body);
        const sql = `INSERT INTO autos (modelo, ciudad, plazas, precio_dia) VALUES (?, ?, ?, ?)`;
        conexion.query(
          sql,
          [datos.modelo, datos.ciudad, datos.plazas, datos.precio_dia],
          (err, resultado) => {
            if (err) {
              console.error("Error al guardar auto:", err);
              res.writeHead(500);
              res.end("Error al guardar auto");
            } else {
              res.writeHead(200);
              res.end("Auto guardado con éxito");
            }
          }
        );
      } catch (e) {
        console.error("Error al parsear JSON:", e);
        res.writeHead(400);
        res.end("Error en el cuerpo de la solicitud");
      }
    });
  } else if (req.method === "POST" && req.url === "/guardar-paquete") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const datos = JSON.parse(body);
        console.log("Datos recibidos para guardar paquete:", datos);

        const sql = `INSERT INTO paquetes (destino, fecha, pasajeros, precio) VALUES (?, ?, ?, ?)`;
        conexion.query(
          sql,
          [datos.destino, datos.fecha, datos.pasajeros, datos.precioTotal], // o cambia precioTotal a precio si quieres
          (err, resultado) => {
            if (err) {
              console.error("Error al guardar paquete:", err);
              res.writeHead(500);
              res.end("Error al guardar paquete");
            } else {
              res.writeHead(200);
              res.end("Paquete guardado con éxito");
            }
          }
        );
      } catch (e) {
        console.error("Error al parsear JSON:", e);
        res.writeHead(400);
        res.end("Error en el cuerpo de la solicitud");
      }
    });
  } else if (req.method === "GET" && req.url === "/obtener-autos") {
    const sql = "SELECT * FROM autos";
    conexion.query(sql, (err, resultados) => {
      if (err) {
        res.writeHead(500);
        res.end("Error al obtener autos");
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(resultados));
      }
    });
  } else if (req.method === "GET" && req.url === "/obtener-paquetes") {
    const sql = "SELECT * FROM paquetes";
    conexion.query(sql, (err, resultados) => {
      if (err) {
        res.writeHead(500);
        res.end("Error al obtener paquetes");
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(resultados));
      }
    });
  } else if (req.method === "POST" && req.url === "/borrar-auto") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const datos = JSON.parse(body);
        const id = Number(datos.id_auto);
        if (!id || isNaN(id)) {
          res.writeHead(400);
          res.end("ID no válido");
          return;
        }
        const sql = "DELETE FROM autos WHERE id_auto = ?";
        conexion.query(sql, [id], (err, resultado) => {
          if (err) {
            console.error("Error al borrar auto:", err);
            res.writeHead(500);
            res.end("Error al borrar auto");
            return;
          }
          if (resultado.affectedRows === 0) {
            res.writeHead(404);
            res.end("Auto no encontrado");
            return;
          }
          res.writeHead(200);
          res.end("Auto eliminado");
        });
      } catch (e) {
        console.error("Error al parsear JSON:", e);
        res.writeHead(400);
        res.end("Error en el cuerpo de la solicitud");
      }
    });
  } else if (req.method === "POST" && req.url === "/enviar-pedido") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const datos = JSON.parse(body);

        // Obtener email desde la cookie
        const cookie = req.headers.cookie;
        const email = cookie?.split("usuario_email=")[1]?.split(";")[0];

        const totalTexto = datos.total;
        const total = parseTotalStrToFloat(totalTexto);

        console.log("🟢 Email:", email);
        console.log("🟢 Total (convertido):", total);

        if (!email || isNaN(total)) {
          res.writeHead(400, { "Content-Type": "text/plain" });
          res.end("Datos incompletos o incorrectos");
          return;
        }

        const sql = "INSERT INTO pedidos (email, total) VALUES (?, ?)";
        conexion.query(sql, [email, total], (err, resultado) => {
          if (err) {
            console.error("🔴 Error al insertar pedido:", err);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Error al guardar el pedido");
            return;
          }

          console.log("✅ Pedido insertado con ID:", resultado.insertId);

          // Borrar TODO el carrito
          borrarTodoElCarrito((errBorrar) => {
            if (errBorrar) {
              console.error("🔴 Error al borrar carrito:", errBorrar);
              res.writeHead(500);
              res.end("Error al borrar carrito");
              return;
            }

            console.log("🧹 Carrito borrado con éxito");

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                mensaje: "Pedido guardado",
                id_pedido: resultado.insertId,
              })
            );
          });
        });
      } catch (e) {
        console.error("🔴 Error al parsear JSON:", e);
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("JSON inválido");
      }
    });
  } else if (req.method === "GET" && req.url === "/obtener-pedidos") {
    const sql = "SELECT * FROM pedidos ORDER BY id_pedido DESC"; // Si no tenés fecha, usa id_pedido
    conexion.query(sql, (err, resultados) => {
      if (err) {
        console.error("Error en /obtener-pedidos:", err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error al obtener pedidos");
        return;
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(resultados));
    });
  } else if (req.method === "POST" && req.url === "/cambiar-estado-pedido") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const { id_pedido, estado } = JSON.parse(body);

        if (
          !id_pedido ||
          !estado ||
          !["pendiente", "aceptado", "rechazado"].includes(estado)
        ) {
          res.writeHead(400, { "Content-Type": "text/plain" });
          res.end("Datos inválidos");
          return;
        }

        const sqlUpdate = "UPDATE pedidos SET estado = ? WHERE id_pedido = ?";
        conexion.query(sqlUpdate, [estado, id_pedido], (err, resultado) => {
          if (err) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Error al actualizar estado");
            return;
          }

          if (resultado.affectedRows === 0) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("Pedido no encontrado");
            return;
          }

          // Obtener el email directamente desde el pedido
          const sqlEmailPedido =
            "SELECT email FROM pedidos WHERE id_pedido = ?";
          conexion.query(sqlEmailPedido, [id_pedido], (err, resultados) => {
            if (err || resultados.length === 0) {
              res.writeHead(500, { "Content-Type": "text/plain" });
              res.end("No se encontró el email del pedido");
              return;
            }

            const email = resultados[0].email;
            console.log("📩 Email del pedido:", email);

            const asunto = "Estado de tu pedido";
            const mensaje =
              estado === "aceptado"
                ? "Tu pedido ha sido aceptado. ¡Gracias por confiar en nosotros!"
                : "Tu pedido ha sido rechazado. Si tenés dudas, contactanos.";

            transporter.sendMail(
              {
                from: "tolosamartintecnica@gmail.com", // correo emisor
                to: email,
                subject: asunto,
                text: mensaje,
              },
              (err, info) => {
                if (err) {
                  console.error("Error al enviar email:", err);
                } else {
                  console.log("Correo enviado:", info.response);
                }

                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ mensaje: "Estado actualizado" }));
              }
            );
          });
        });
      } catch {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("JSON inválido");
      }
    });
  } else {
    // Servir archivos estáticos para GET y otras solicitudes
    let filePath = path.join(
      __dirname,
      "..",
      "cliente",
      req.url === "/" ? "ini-reg/sesion.html" : req.url
    );
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || "text/plain";

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Archivo no encontrado");
      } else {
        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);
      }
    });
  }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});