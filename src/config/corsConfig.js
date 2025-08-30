const origenesPermitidos = ["http://localhost:5173", "http://localhost:3000"];

export const opcionesCors = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }
    if (origenesPermitidos.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(
        new Error(
          "El origen (URL, dominio) no tiene permiso para acceder a esta API!"
        )
      );
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
