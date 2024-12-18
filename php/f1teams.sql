-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1 
-- Tiempo de generación: 17-12-2024 a las 21:17:07
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
-- Base de datos: `f1teams`
--
CREATE DATABASE IF NOT EXISTS `f1teams` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `f1teams`;

DROP TABLE IF EXISTS `es_patrocinador`;
DROP TABLE IF EXISTS `pilotos`;
DROP TABLE IF EXISTS `coches`;
DROP TABLE IF EXISTS `patrocinador`;
DROP TABLE IF EXISTS `equipos`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `coches`
--

CREATE TABLE `coches` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `motor` varchar(255) NOT NULL,
  `id_equipo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `coches`
--

INSERT INTO `coches` (`id`, `nombre`, `motor`, `id_equipo`) VALUES
(1, 'Renault', 'A524', 1),
(2, 'Honda RBPT', 'RB20', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `equipos`
--

CREATE TABLE `equipos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `base` varchar(255) NOT NULL,
  `jefe` varchar(255) NOT NULL,
  `fundation_date` date NOT NULL,
  `world_championships` int(11) NOT NULL,
  `pole_positions` int(11) NOT NULL,
  `vueltas_rapidas` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `equipos`
--

INSERT INTO `equipos` (`id`, `nombre`, `base`, `jefe`, `fundation_date`, `world_championships`, `pole_positions`, `vueltas_rapidas`) VALUES
(1, 'Alpine', 'Enstone, Reino Unido', 'Oliver Oakes', '1955-06-22', 2, 20, 16),
(2, 'RedBull', 'Milton Keynes, United Kingdom', 'Christian Horner', '1997-11-15', 6, 103, 99);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `es_patrocinador`
--

CREATE TABLE `es_patrocinador` (
  `id_equipo` int(11) NOT NULL,
  `id_patrocinador` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `es_patrocinador`
--

INSERT INTO `es_patrocinador` (`id_equipo`, `id_patrocinador`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(2, 1),
(2, 16),
(2, 17),
(2, 19),
(2, 20);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `patrocinador`
--

CREATE TABLE `patrocinador` (
  `id` int(11) NOT NULL,
  `nombre_patrocinador` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `patrocinador`
--

INSERT INTO `patrocinador` (`id`, `nombre_patrocinador`) VALUES
(1, 'Pirelli'),
(2, 'BWT'),
(3, 'Renault E-Tech'),
(4, 'Castrol'),
(5, 'Microsoft'),
(16, 'Built For Athletes'),
(17, 'Castore'),
(19, 'CashApp'),
(20, 'Walmart');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pilotos`
--

CREATE TABLE `pilotos` (
  `id` int(11) NOT NULL,
  `n_pista` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `nacionalidad` varchar(100) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `id_equipo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pilotos`
--

INSERT INTO `pilotos` (`id`, `n_pista`, `nombre`, `nacionalidad`, `fecha_nacimiento`, `id_equipo`) VALUES
(2, 10, 'Pierre Gasly', 'Francia', '1996-02-07', 1),
(3, 61, 'Jack Doohan', 'Australia', '2003-01-20', 1),
(4, 1, 'Max Verstappen', 'Paises Bajos', '1997-09-30', 2),
(5, 11, 'Sergio Perez', 'Mexico', '1990-01-26', 2);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `coches`
--
ALTER TABLE `coches`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_equipo` (`id_equipo`);

--
-- Indices de la tabla `equipos`
--
ALTER TABLE `equipos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `es_patrocinador`
--
ALTER TABLE `es_patrocinador`
  ADD PRIMARY KEY (`id_equipo`,`id_patrocinador`),
  ADD KEY `id_patrocinador` (`id_patrocinador`);

--
-- Indices de la tabla `patrocinador`
--
ALTER TABLE `patrocinador`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pilotos`
--
ALTER TABLE `pilotos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_equipo` (`id_equipo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `coches`
--
ALTER TABLE `coches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `equipos`
--
ALTER TABLE `equipos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `patrocinador`
--
ALTER TABLE `patrocinador`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `pilotos`
--
ALTER TABLE `pilotos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `coches`
--
ALTER TABLE `coches`
  ADD CONSTRAINT `coches_ibfk_1` FOREIGN KEY (`id_equipo`) REFERENCES `equipos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `es_patrocinador`
--
ALTER TABLE `es_patrocinador`
  ADD CONSTRAINT `es_patrocinador_ibfk_1` FOREIGN KEY (`id_equipo`) REFERENCES `equipos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `es_patrocinador_ibfk_2` FOREIGN KEY (`id_patrocinador`) REFERENCES `patrocinador` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `pilotos`
--
ALTER TABLE `pilotos`
  ADD CONSTRAINT `pilotos_ibfk_1` FOREIGN KEY (`id_equipo`) REFERENCES `equipos` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
