/* const child_process = require("child_process"); */
const { Client } = require('pg');
const config = {
    user: 'postgres',
    host: 'localhost',
    database: 'estudiantes',
    password: 'postgres',
    port: 5432,
}
const client = new Client(config);

client.connect()

const argumentos = process.argv.slice(2);
const funcion = argumentos[0];
const nombre = argumentos[1];
const rut = argumentos[2];
const curso = argumentos[3];
const nivel = argumentos[4];

async function validarRut(rut) {

    try {
        const res = await client.query(`
        SELECT * FROM estudiantes WHERE rut = '${rut}'`);
        let filas = res.rowCount;
        console.log('res.rowCount ', filas)
        return filas;
    } catch (error) {
        console.log('Ha ocurido un error: ', error)
    }
    client.end();
}

async function ingresar(nombre, rut, curso, nivel) {

    let filaAfectada = await validarRut(rut);
    if (filaAfectada == 0) {
        const res = await client.query(
            `INSERT INTO estudiantes(nombre, rut, curso, nivel) VALUES('${nombre}','${rut}', '${curso}', '${nivel}') RETURNING *;`);
        console.log(`Estudiante ${nombre} agregado con éxito.`, res.rows[0]);
        console.log("Cantidad de registros afectados: ", res.rowCount);
    } else {
        console.log(`Estudiante con Rut ${rut} ya se encuentra en la Base de Datos.`);
    }
    client.end();
}

async function consulta() {
    const res = await client.query('SELECT * FROM estudiantes', (err, res) => {
        console.log('Campos del registro: ', res.fields.map(r => r.name).join(" - "));
        console.log('Registro actual:', res.rows);
        console.log("Cantidad de registros afectados: ", res.rowCount);
        client.end();
    })
};

async function editar(nombre, rut, curso, nivel) {

    let filaAfectada = await validarRut(rut);
    if (filaAfectada == 1) {
        const res = await client.query(
            `UPDATE estudiantes SET nombre = '${nombre}', curso = '${curso}', nivel = '${nivel}' WHERE rut = '${rut}' RETURNING * ;`);
        console.log(`Estudiante ${nombre} editado con éxito.`, res.rows[0]);
        console.log("Cantidad de registros afectados: ", res.rowCount);
    } else {
        console.log(`Estudiante con Rut ${rut} no se encuentra en la Base de Datos.`);
    }
    client.end();
}

async function consultaRut(rut) {

    let filaAfectada = await validarRut(rut);
    if (filaAfectada == 1) {
        const res = await client.query(`
                SELECT * FROM estudiantes WHERE rut = '${rut}'
                `);
        console.log('Registro a Consultar:', res.rows[0]);
        console.log("Cantidad de registros afectados: ", res.rowCount);
    } else {
        console.log(`Estudiante con Rut ${rut} no se encuentra en la Base de Datos.`);
    }
    client.end();
};

async function eliminar(rut) {

    let filaAfectada = await validarRut(rut);
    if (filaAfectada == 1) {
        const res = await client.query(`
                DELETE FROM estudiantes WHERE rut = '${rut}'
                `);
        console.log(`Registro de estudiante con rut ${rut} ha sido eliminado.`, res.rows);
        console.log("Cantidad de registros afectados: ", res.rowCount);
    } else {
        console.log(`Estudiante con Rut ${rut} no se encuentra en la Base de Datos.`);
    }
    client.end();
};

// Funciones : Nuevo estudiante, Consulta, Editar estudiante, Consultar por rut, Eliminar registro de estudiante

// Nuevo estudiante: node index.js nuevo <nombre> <rut> <curso> <nivel>
if (funcion == 'nuevo') {
    console.log(nombre, rut, curso, nivel);
    ingresar(nombre, rut, curso, nivel);
}

// Consulta estudiante: node index.js consulta
if (funcion == 'consulta') {
    consulta();
}

// Editar estudiante: node index.js editar <nombre> <rut> <curso> <nivel>
if (funcion == 'editar') {
    console.log(nombre, rut, curso, nivel)
    editar(nombre, rut, curso, nivel);
}

// Consultar por rut estudiante: node index.js rut <rut>
if (funcion == 'rut') {
    const rut = argumentos[1];
    console.log(rut);
    consultaRut(rut);
}

// Eliminar registro de estudiante: node index.js eliminar <rut>
if (funcion == 'eliminar') {
    const rut = argumentos[1];
    console.log(rut);
    eliminar(rut);
}