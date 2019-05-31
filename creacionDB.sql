CREATE TABLE `plazos` (
        `id`    INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        `dnicliente`    INTEGER NOT NULL,
        `capital`       INTEGER NOT NULL,
        `plazo` INTEGER NOT NULL,
        `tasa`  INTEGER NOT NULL,
        `fechaSolicitud`        DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(`dnicliente`) REFERENCES `clientes`(`dni`)
);
CREATE TABLE "clientes" (
        `id`    INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        `dni`   INTEGER NOT NULL UNIQUE,
        `nombre`        TEXT NOT NULL,
        `apellido`      TEXT NOT NULL,
        `localidad`     TEXT NOT NULL,
        `telefono`      INTEGER NOT NULL,
        `email` INTEGER NOT NULL
);
CREATE TABLE "tasasPF" (
        `id`    INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        `dias`  INTEGER NOT NULL,
        `tasa`  NUMERIC NOT NULL
);
CREATE TABLE "tasasPrest" ( 
        `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
        `meses` INTEGER NOT NULL, 
        `tasa` NUMERIC NOT NULL
);
CREATE TABLE "prestamos" (
        `id`    INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        `dnicliente`    INTEGER NOT NULL,
        `capital`       INTEGER NOT NULL,
        `plazo` INTEGER NOT NULL,
        `tasa`  INTEGER NOT NULL,
        `sistema`  INTEGER NOT NULL,
        `fechaSolicitud`        DATETIME DEFAULT CURRENT_TIMESTAMP
)
