export const verificarPermisos = (permisosRequeridos) => {
  return (req, res, next) => {
    try {
      if (!permisosRequeridos.includes(req.payload.rol)) {
        return res
          .status(403)
          .json({ mensaje: "No tiene permisos para acceder a este modulo." });
      }
      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ mensaje: "Error al verificar permisos" });
    }
  };
};
