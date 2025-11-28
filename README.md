Práctica de MongoDB y Mongoose

1. Justificación de Relaciones


- Relación Embebida (1:1): User → Profile

	Justificación: La información básica del perfil (first_name, last_name) se embebida directamente en el esquema User. Esta elección se hizo porque los datos del perfil son consultados casi siempre junto con el usuario principal. Al ser datos que no tienen un ciclo de vida propio fuera del documento User, se optimiza el rendimiento de lectura al evitar una consulta adicional a otra colección.

- Relación Referenciada (1:N): Post → Author (User)

	Justificación: Un Post tiene una referencia (author) al User que lo creó. Se eligió referenciada porque un User puede ser autor de muchos Posts. Almacenar la información completa del autor en cada post resultaría en una enorme duplicación de datos. La referencia simple (ObjectId) mantiene los documentos ligeros y permite actualizar la información del autor en un solo lugar.

- Relación Referenciada (N:M): Post ↔ Tag

	Justificación: Un Post puede tener varios Tags y un Tag puede estar asociado a varios Posts. Se eligió referenciada mediante un array de ObjectIds (tags) en el esquema Post. Esto es el estándar en Mongoose para gestionar las relaciones Muchos a Muchos, permitiendo consultar la relación en ambas direcciones usando populate.

2. Investigaciones 

a) Populate desde Colecciones que no tienen Referencias (Virtual Populate)

El populate() se utiliza habitualmente en un campo que tiene una referencia explícita (ObjectId) a otro modelo. Para colecciones que son el "lado N" de una relación (ej: el User quiere ver sus Posts), pero no tienen un array de ObjectIds de los posts en su esquema, se utiliza Virtual Populate.

Aplicación: En los modelos User y Tag, definimos un campo virtual (posts) que Mongoose utiliza para "mirar" la colección Post y traer los documentos cuyo campo (foreignField: author o tags) coincide con el _id del documento actual (localField).

b) Eliminaciones Lógicas y en Cascada

Eliminación Lógica

Se implementa agregando un flag booleano `isDeleted: { type: Boolean, default: false }` en los esquemas. Al "eliminar", simplemente se actualiza este campo a `true`, manteniendo el documento en la base de datos. Todas las consultas (`getAll...`) están filtradas para excluir los documentos donde `isDeleted` sea `true`.

Eliminación en Cascada

Al eliminar lógicamente un documento principal, se realizan acciones automáticas en los documentos relacionados:

- User → Post (1:N Cascada): Al eliminar un User, se usa `PostModel.updateMany({ author: user._id }, { isDeleted: true })` para eliminar lógicamente todos los Posts escritos por ese usuario.

- Tag → Post (N:M Cascada): Al eliminar un Tag, se usa `$pull` (`PostModel.updateMany({ tags: tag._id }, { $pull: { tags: tag._id } })`) para remover la referencia del Tag de todos los arrays de tags en los Posts relacionados.

c) Endpoint para Agregar un Nuevo Vínculo en una Relación Muchos a Muchos

Para gestionar la relación N:M (Post a Tag), se implementó el controlador `addTagToPost`.

Este endpoint permite crear el vínculo de manera atómica:

- Verifica la existencia del Post y el Tag.
- Comprueba que la referencia (`tagId`) no exista ya en el array `post.tags` para evitar duplicados.
- Si no existe, se utiliza el método `.push()` en el array de referencias y luego se llama a `.save()` en el Post para guardar el nuevo vínculo en la base de datos.