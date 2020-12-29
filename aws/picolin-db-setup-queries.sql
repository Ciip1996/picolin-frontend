CREATE DATABASE picolin;

USE picolin;

CREATE TABLE `usuario` (
  `idUsuario` int NOT NULL AUTO_INCREMENT,
  `usuario` varchar(45) DEFAULT NULL,
  `password` varchar(250) DEFAULT NULL,
  `fechaRegistro` datetime DEFAULT NULL,
  `ultimoLogin` datetime DEFAULT NULL,
  `rol` varchar(15) DEFAULT NULL,
  `nombre` varchar(45) DEFAULT NULL,
  `apellidoMaterno` varchar(45) DEFAULT NULL,
  `apellidoPaterno` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idUsuario`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

# SELECT * FROM picolin.usuario;


CREATE TABLE `producto` (
  `codigoProducto` varchar(20) NOT NULL,
  `descripcion` varchar(250) DEFAULT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `caracteristica` varchar(50) DEFAULT NULL,
  `proveedor` varchar(100) DEFAULT NULL,
  `talla` int DEFAULT NULL,
  `piezas` int DEFAULT NULL,
  `costo` double DEFAULT NULL,
  `precioVenta` double DEFAULT NULL,
  `genero` varchar(10) DEFAULT NULL,
  `color` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`codigoProducto`),
  UNIQUE KEY `idproducto_UNIQUE` (`codigoProducto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `venta` (
  `idVenta` int NOT NULL AUTO_INCREMENT,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `cantidad` int DEFAULT NULL,
  `total` double DEFAULT NULL,
  `subtotal` double DEFAULT NULL,
  `iva` double DEFAULT NULL,
  `descuento` double DEFAULT NULL,
  `recibi` double DEFAULT NULL,
  `formaPago` varchar(20) DEFAULT NULL,
  `deposito` double DEFAULT NULL,
  `tipoVenta` json DEFAULT NULL,
  `factura` tinyint DEFAULT NULL,
  `sucursal` varchar(50) DEFAULT NULL,
  `usuario` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`idVenta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `detalle_venta` (
  `fkVenta` int DEFAULT NULL,
  `idDetalleVenta` int NOT NULL AUTO_INCREMENT,
  `codigoProducto` varchar(20) DEFAULT NULL,
  `cantidad` int DEFAULT NULL,
  PRIMARY KEY (`idDetalleVenta`),
  KEY `fkVenta` (`fkVenta`),
  KEY `detalle_venta_prod_idx` (`codigoProducto`),
  CONSTRAINT `detalle_venta_ibfk_1` FOREIGN KEY (`fkVenta`) REFERENCES `venta` (`idVenta`),
  CONSTRAINT `detalle_venta_prod` FOREIGN KEY (`codigoProducto`) REFERENCES `producto` (`codigoProducto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `transferir_producto` (
  `fechaAlta` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `codigoProducto` varchar(20) DEFAULT NULL,
  `fechaCambioATienda` datetime DEFAULT NULL,
  `origen` varchar(50) DEFAULT NULL,
  `destino` varchar(50) DEFAULT NULL,
  `cantidad` int DEFAULT NULL,
  `usuario` varchar(50) DEFAULT NULL,
  KEY `fk_transferir_producto_idx` (`codigoProducto`),
  CONSTRAINT `fk_transferir_producto` FOREIGN KEY (`codigoProducto`) REFERENCES `producto` (`codigoProducto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `inventario` (
  `codigoProducto` varchar(20) DEFAULT NULL,
  `lugar` varchar(50) DEFAULT NULL,
  `stock` int DEFAULT NULL,
  `cantidadApartada` int DEFAULT NULL,
  KEY `fk_inventario_prod_idx` (`codigoProducto`),
  CONSTRAINT `fk_inventario_prod` FOREIGN KEY (`codigoProducto`) REFERENCES `producto` (`codigoProducto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;




CREATE TABLE `apartado` (
  `idapartado` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(250) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `usuario` varchar(50) DEFAULT NULL,
  `importeAoartado` double DEFAULT NULL,
  `total` double DEFAULT NULL,
  `sucursal` varchar(50) DEFAULT NULL,
  `fechaRecoleccion` date DEFAULT NULL,
  `telefono` varchar(10) DEFAULT NULL,
  `correo` varchar(250) DEFAULT NULL,
  `vendido` tinyint DEFAULT NULL,
  `referenciaVenta` int DEFAULT NULL,
  PRIMARY KEY (`idapartado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `detalle_apartado` (
  `idDetalleApartado` int NOT NULL AUTO_INCREMENT,
  `fkApartado` int DEFAULT NULL,
  `codigoProducto` varchar(20) DEFAULT NULL,
  `cantidad` int DEFAULT NULL,
  PRIMARY KEY (`idDetalleApartado`),
  KEY `fk_apartado_idx` (`fkApartado`),
  KEY `fk_producto_idx` (`codigoProducto`),
  CONSTRAINT `fk_apartado` FOREIGN KEY (`fkApartado`) REFERENCES `apartado` (`idapartado`),
  CONSTRAINT `fk_producto` FOREIGN KEY (`codigoProducto`) REFERENCES `producto` (`codigoProducto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `pago` (
  `idpago` int NOT NULL AUTO_INCREMENT,
  `concepto` varchar(150) DEFAULT NULL,
  `categoria` varchar(50) DEFAULT NULL,
  `costo` double DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `sucursal` varchar(50) DEFAULT NULL,
  `usuario` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`idpago`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


