const pool = require("../../src/config/db");

const detalleLaboralFields = [
  "cargo", "tipo_organizacion", "activo", "pausa", "fecha_ingreso", 
  "fecha_nombramiento", "antiguedad", "antiguedad_detalle", "tipo_entidad", 
  "tipo_direccion", "plaza_id", "z_e", "nombramiento", "grado"
];

const ubicCctsFields = ["zona_id", "sector_id", "municipio_id", "comunidad_id", "cct_id"];

const EditarPerfilPersonal = async (req, res) => {
  const { id } = req.params;
  const datosActualizados = req.body; // Datos de texto
  const archivoImagen = req.file; // Archivo de imagen

  try {
    // Validar si hay datos
    if (!Object.keys(datosActualizados).length && !archivoImagen) {
      return res.status(400).json({ mensaje: "No se enviaron datos para actualizar" });
    }

    const camposParaActualizar = [];
    const valoresParaActualizar = [];

    // Si hay un archivo de imagen, agregarlo a los campos para actualizar
    if (archivoImagen) {
      camposParaActualizar.push(`imagen = ?`);
      valoresParaActualizar.push(archivoImagen.filename); // Nombre del archivo guardado
    }

    // Agregar otros campos de datos al arreglo
    for (const [campo, valor] of Object.entries(datosActualizados)) {
      camposParaActualizar.push(`${campo} = ?`);
      valoresParaActualizar.push(valor);
    }

    valoresParaActualizar.push(id); // Agregar ID para la condición WHERE

    // Determinar la tabla
    let tabla = "personal";
    if (Object.keys(datosActualizados).some(campo => detalleLaboralFields.includes(campo))) {
      tabla = "detalle_laboral";
    } else if (Object.keys(datosActualizados).some(campo => ubicCctsFields.includes(campo))) {
      tabla = "ubic_ccts";
    }

    const consultaSQL = `UPDATE ${tabla} SET ${camposParaActualizar.join(", ")} WHERE personal_id = ?`;

    const [resultado] = await pool.query(consultaSQL, valoresParaActualizar);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: "No se encontró el registro para actualizar" });
    }

    return res.json({ mensaje: "Perfil actualizado correctamente", imagen: archivoImagen?.filename || null });
  } catch (error) {
    console.error("Error al actualizar los datos del personal:", error);
    res.status(500).json({ mensaje: "Error al actualizar los datos del personal" });
  }
};




module.exports = {EditarPerfilPersonal
};



