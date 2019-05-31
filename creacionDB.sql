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

-- Insertar 3 tasas Plazo Fijo(id, días, % interés)
-- TODO - Form ABM
INSERT INTO tasasPF VALUES(1,60,48);
INSERT INTO tasasPF VALUES(2,120,47);
INSERT INTO tasasPF VALUES(3,365,45);

CREATE TABLE "tasasPrest" ( 
        `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
        `meses` INTEGER NOT NULL, 
        `tasa` NUMERIC NOT NULL
);

-- Insertar 3 tasas Préstamo(id, meses, % interés)
INSERT INTO tasasPrest VALUES(1,24,56);
INSERT INTO tasasPrest VALUES(2,48,65);
INSERT INTO tasasPrest VALUES(3,72,75);

CREATE TABLE "prestamos" (
        `id`    INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        `dnicliente`    INTEGER NOT NULL,
        `capital`       INTEGER NOT NULL,
        `plazo` INTEGER NOT NULL,
        `tasa`  INTEGER NOT NULL,
        `sistema`  INTEGER NOT NULL,
        `fechaSolicitud`        DATETIME DEFAULT CURRENT_TIMESTAMP
);

DELETE FROM sqlite_sequence;
-- Actualizar índices de las tablas modificadas
INSERT INTO sqlite_sequence VALUES('tasasPF',3);
INSERT INTO sqlite_sequence VALUES('tasasPrest',3);
