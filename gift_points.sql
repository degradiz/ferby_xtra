-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 28-09-2017 a las 02:33:25
-- Versión del servidor: 10.1.16-MariaDB
-- Versión de PHP: 5.6.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `ferby`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gift_points`
--

CREATE TABLE `gift_points` (
  `gift_point_id` int(11) NOT NULL,
  `gift_place_id` int(11) NOT NULL,
  `gift_username` varchar(256) COLLATE utf8_unicode_ci NOT NULL,
  `gift_points` int(11) NOT NULL,
  `gift_bill_id` int(11) DEFAULT NULL,
  `gift_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `gift_points`
--

INSERT INTO `gift_points` (`gift_point_id`, `gift_place_id`, `gift_username`, `gift_points`, `gift_bill_id`, `gift_time`) VALUES
(1, 7, '100015899701211', 100, 3766, '2017-09-27 23:53:23'),
(2, 7, '100015899701211', 100, 3766, '2017-09-28 00:00:11'),
(3, 7, '100015899701211', 100, 3766, '2017-09-28 00:00:17');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `gift_points`
--
ALTER TABLE `gift_points`
  ADD PRIMARY KEY (`gift_point_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `gift_points`
--
ALTER TABLE `gift_points`
  MODIFY `gift_point_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
