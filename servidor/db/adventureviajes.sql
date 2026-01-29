-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 27-06-2025 a las 23:58:14
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `adventureviajes`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `autos`
--

CREATE TABLE `autos` (
  `id_auto` int(15) NOT NULL,
  `modelo` varchar(25) NOT NULL,
  `ciudad` varchar(50) NOT NULL,
  `plazas` int(10) NOT NULL,
  `precio_dia` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detallepedido`
--

CREATE TABLE `detallepedido` (
  `id_detalle` int(15) NOT NULL,
  `id_pedido` int(15) NOT NULL,
  `id_paquete` int(15) NOT NULL,
  `id_vuelo` int(15) NOT NULL,
  `id_auto` int(15) NOT NULL,
  `cantidad` double NOT NULL,
  `subtotal` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paquetes`
--

CREATE TABLE `paquetes` (
  `id_paquete` int(15) NOT NULL,
  `destino` varchar(50) NOT NULL,
  `fecha` date NOT NULL,
  `pasajeros` int(10) NOT NULL,
  `precio` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id_pedido` int(11) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `total` varchar(50) DEFAULT NULL,
  `estado` varchar(20) DEFAULT 'pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id_pedido`, `email`, `total`, `estado`) VALUES
(1, 'Martin', '319982.00', 'aceptado'),
(2, 'Valentin', '25616.00', 'pendiente'),
(3, 'Valentin', '3011.00', 'pendiente'),
(4, 'Valentin', '76803.00', 'rechazado'),
(5, 'tolosamartintecnica@gmail.com', '27931.00', 'rechazado'),
(6, 'tolosafabio34@gmail.com', '162178.00', 'aceptado'),
(7, 'valenolas39@gmail.com', '28350.00', 'aceptado'),
(8, 'tolosafabio34@gmail.com', '259968.00', 'aceptado'),
(9, 'tolosamartintecnica@gmail.com', '2622.60', 'rechazado'),
(10, 'tolosamartintecnica@gmail.com', '1022.53', 'pendiente'),
(11, 'tolosamartintecnica@gmail.com', '2039.84', 'pendiente'),
(12, 'tolosamartintecnica@gmail.com', '2012.84', 'pendiente'),
(13, 'tolosamartintecnica@gmail.com', '1180.80', 'pendiente'),
(14, 'tolosamartintecnica@gmail.com', '304848.00', 'pendiente'),
(15, 'tolosamartintecnica@gmail.com', '1156.80', 'pendiente'),
(16, 'tolosamartintecnica@gmail.com', '2234.85', 'pendiente'),
(17, 'tolosamartintecnica@gmail.com', '2323.60', 'pendiente'),
(18, 'tolosamartintecnica@gmail.com', '2320683', 'pendiente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(15) NOT NULL,
  `nombre` varchar(25) NOT NULL,
  `email` varchar(50) NOT NULL,
  `contrasena` varchar(25) NOT NULL,
  `tipo_usuario` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `email`, `contrasena`, `tipo_usuario`) VALUES
(1, 'Martin', 'tolosamartintecnica@gmail.com', '123123', ''),
(3, 'a', 'tolosamartintecnica@gmail.com', 'a', ''),
(4, 'a', 'tolosamartintecnica@gmail.com', 'a', ''),
(5, 'Valentin', 'valenolas39@gmail.com', 'uyuyuy', ''),
(6, 'Fabio', 'tolosafabio34@gmail.com', '123123', ''),
(7, 'fabio', 'tolosafabio34@gmail.com', 'fabio', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vuelos`
--

CREATE TABLE `vuelos` (
  `id_vuelo` int(15) NOT NULL,
  `origen` varchar(25) NOT NULL,
  `destino` varchar(25) NOT NULL,
  `fecha` date NOT NULL,
  `precio` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `autos`
--
ALTER TABLE `autos`
  ADD PRIMARY KEY (`id_auto`);

--
-- Indices de la tabla `detallepedido`
--
ALTER TABLE `detallepedido`
  ADD PRIMARY KEY (`id_detalle`,`id_pedido`);

--
-- Indices de la tabla `paquetes`
--
ALTER TABLE `paquetes`
  ADD PRIMARY KEY (`id_paquete`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id_pedido`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`);

--
-- Indices de la tabla `vuelos`
--
ALTER TABLE `vuelos`
  ADD PRIMARY KEY (`id_vuelo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `autos`
--
ALTER TABLE `autos`
  MODIFY `id_auto` int(15) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `detallepedido`
--
ALTER TABLE `detallepedido`
  MODIFY `id_detalle` int(15) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `paquetes`
--
ALTER TABLE `paquetes`
  MODIFY `id_paquete` int(15) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id_pedido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(15) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `vuelos`
--
ALTER TABLE `vuelos`
  MODIFY `id_vuelo` int(15) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
