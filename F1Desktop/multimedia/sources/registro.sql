-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 13-12-2024 a las 14:44:27
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
-- Base de datos: `records`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registro`
--

CREATE TABLE `registro` (
  `id` int(11) NOT NULL,
  `nombre` text NOT NULL,
  `apellidos` text NOT NULL,
  `nivel` text NOT NULL,
  `tiempo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `registro`
--

INSERT INTO `registro` (`id`, `nombre`, `apellidos`, `nivel`, `tiempo`) VALUES
(1, 'Diego', 'Garcia', 'Facil', 87),
(2, 'Diego ', 'Garcia Gonzalez', 'Dificil', 167),
(3, 'Diego', 'Garcia', 'Dificil', 153),
(4, 'Diego', 'King', 'Dificil', 73),
(5, 'Diego', 'Cervero', 'Facil', 47),
(6, 'Diego', 'Lentolinni', 'Medio', 757),
(7, 'Diego', 'Garcia Glez', 'Facil', 238),
(8, 'MCarmen', 'Fernandez', 'Medio', 93),
(9, 'Paco', 'Gutierrez', 'Dificil', 284),
(10, 'Diego', 'Garcia att2', 'Medio', 241),
(11, 'Diego', 'Garcia att3', 'Medio', 678),
(12, 'Diego', 'Garcia att3', 'Medio', 80),
(13, 'asdfasdfad', 'asdfasfasdf', 'Dificil', 97),
(14, 'asdfa', 'sdfad', 'Dificil', 360),
(15, 'asdf', 'asdfa', 'Facil', 1368),
(16, 'fausto', 'claveria', 'Dificil', 238),
(17, 'AFASDF', 'ASDFA', 'Medio', 213),
(18, 'asdf', 'asd', 'Facil', 121),
(19, 'a', 'a', 'Medio', 200);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `registro`
--
ALTER TABLE `registro`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `registro`
--
ALTER TABLE `registro`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
