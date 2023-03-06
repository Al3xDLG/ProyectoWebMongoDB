let empleadoSeleccionado; // Líneas = 199
let empleados;
let datepicker = null;
const removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

function inicializar() {
    refrescarTabla();
    configureTableFilter(document.getElementById('txtBusqueda'),
            document.getElementById('tablaEmpleado'));
    document.getElementById("btnDelete").disabled = true;
}

function setDetalleVisible() {
    const form = document.getElementById('areaContenido');
    const tbl = document.getElementById('tblVideojuegosCompleta');
    if (form.style.display === 'none') {
        form.style.display = "block";
        document.getElementById("letreroFormulario").innerHTML = "Cerrar formulario.";
        tbl.style.display = "none";
    } else {
        form.style.display = "none";
        limpiarCampos();
        document.getElementById("letreroFormulario").innerHTML = "Abrir formulario.";
        tbl.style.display = "block";
    }
}

function guardarEmpleado() {
    let datos = null;
    let params = null;

    let empleado = new Object();
    empleado.usuario = new Object();
    empleado.persona = new Object();
    if (document.getElementById("txtIdEmpleado").value.trim().length < 1)
    {
        empleado.idEmpleado = 0;
        empleado.persona.idPersona = 0;
        empleado.usuario.idUsuario = 0;
    } else
    {
        empleado.idEmpleado = parseInt(document.getElementById("txtIdEmpleado").value);
        empleado.persona.idPersona = parseInt(document.getElementById("txtIdPersona").value);
        empleado.usuario.idUsuario = parseInt(document.getElementById("txtIdUsuario").value);
    }

// Persona datos personales
    let nombreEmpleado = removeAccents(document.getElementById("txtNombre").value.toUpperCase());
    let apellidoPaterno = removeAccents(document.getElementById("txtApellidoPat").value.toUpperCase());
    let apellidoMaterno = removeAccents(document.getElementById("txtApellidoMat").value.toUpperCase());
    let rfc = removeAccents(document.getElementById("txtRFC").value.toUpperCase());
    let nombreUsuario = removeAccents(document.getElementById("txtUsuario").value);
    let contrasenia = removeAccents(document.getElementById("txtContrasennia").value);
    let calle = removeAccents(document.getElementById("txtCalle").value.toUpperCase());
    empleado.persona.nombre = sanitize(nombreEmpleado);
    empleado.persona.apellidoPaterno = sanitize(apellidoPaterno);
    empleado.persona.apellidoMaterno = sanitize(apellidoMaterno);
    empleado.persona.genero = document.getElementById("txtGenero").value.toUpperCase();
    empleado.persona.rfc = sanitize(rfc);
    // Formar fecha de nacimiento
    let dia = document.getElementById("txtDia").value;
    let mes = document.getElementById("txtMes").value;
    let anio = document.getElementById("txtAnio").value;
    let fecha = dia + "/" + mes + "/" + anio;
    document.getElementById("txtFechaNac").value = fecha;
    empleado.persona.fechaNacimiento = fecha;
    // Persona datos de domicilio
    empleado.persona.cp = document.getElementById("txtCodigoPostal").value;
    empleado.persona.estado = document.getElementById("txtEntidad").value.toUpperCase();
    empleado.persona.ciudad = document.getElementById("txtCiudad").value.toUpperCase();
    empleado.persona.colonia = document.getElementById("txtColonia").value.toUpperCase();
    empleado.persona.calle = sanitize(calle);
    empleado.persona.numero = document.getElementById("txtNumDom").value;
    // Persona datos contacto
    empleado.persona.telCasa = document.getElementById("txtTelefonoCasa").value;
    empleado.persona.telMovil = document.getElementById("txtTelefonoMov").value;
    empleado.persona.email = removeAccents(document.getElementById("txtCorreo").value);
    // Usuario
    empleado.usuario.nombre = sanitize(nombreUsuario);
    empleado.usuario.contrasenia = CryptoJS.MD5(sanitize(contrasenia)).toString();
    alert(empleado.usuario.contrasenia);
    empleado.usuario.rol = document.getElementById("txtRol").value.toUpperCase();
    // Empleado
    empleado.numeroUnico = document.getElementById("txtNUE").value;
    //params = "token=" + currentUser.usuario.lastToken + "&datosEmpleado=" + JSON.stringify(empleado);
    let token = localStorage.getItem("lastToken");
    let rol = localStorage.getItem("rol");
    datos = {
        datosEmpleado: JSON.stringify(empleado),
        token: token,
        rol: rol
    };
    //params = "datosEmpleado=" + JSON.stringify(empleado);
    params = new URLSearchParams(datos);
    if (validarvacios() === true) {
        if (validarRFC() === true) {
            if (validarTelefonoMovil() === true) {
                if (validarTelefonoCasa() === true) {
                    if (validarLongitudTelefono() === true) {
                        if (validarUsuario() === true) {
                            fetch("api/empleado/save",
                                    {
                                        method: "POST",
                                        headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                                        body: params
                                    })
                                    .then(response => {
                                        return response.json();
                                    })
                                    .then(function (data)
                                    {
                                        if (data.exception != null)
                                        {
                                            Swal.fire('', 'Error interno del servidor. Intente nuevamente mas tarde.', 'error');
                                            return;
                                        }
                                        if (data.error != null)
                                        {
                                            Swal.fire('', data.error, 'warning');
                                            return;
                                        }
                                        if (data.errorperm != null)
                                        {
                                            Swal.fire('Error', data.errorperm, 'error');
                                            return;
                                        }
                                        if (data.errorsec != null) {
                                            localStorage.clear();
                                            Swal.fire({
                                                title: 'Token incorrecto',
                                                text: data.errorsec,
                                                icon: 'error',
                                                confirmButtonColor: '#3085d6',
                                                confirmButtonText: 'Iniciar sesion'
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    console.log(data);
                                                    alert("consola");
                                                    window.location = "index.html";
                                                }
                                            });
                                            return;
                                        }

                                        document.getElementById("txtIdEmpleado").value = data.idEmpleado;
                                        document.getElementById("txtIdUsuario").value = data.usuario.idUsuario;
                                        document.getElementById("txtIdPersona").value = data.persona.idPersona;
                                        document.getElementById("txtNUE").value = data.NumeroUnico;
                                        Swal.fire('', 'Datos del empleado actualizados correctamente.', 'success');
                                        empleadoSeleccionado = data;
                                        refrescarTabla();
                                        limpiarCampos();
                                        document.getElementById('areaContenido').style.display = "none";
                                        document.getElementById('letreroFormulario').innerHTML = "Abrir formulario.";
                                        document.getElementById('tblEmpleadoCompleta').style.display = "block";
                                    });
                        }
                    }
                }
            }
        }
    }
}

function eliminarEmpleado() {
    let id = null;
    let param = null;
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Eliminarás el empleado seleccionado",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            let idEmpleado = parseInt(document.getElementById("txtIdEmpleado").value);
            let token = localStorage.getItem("lastToken");
            let rol = localStorage.getItem("rol");
            id = {
                id: JSON.stringify(idEmpleado),
                token: token,
                rol: rol
            };
            param = new URLSearchParams(id);
            fetch("api/empleado/delete",
                    {
                        method: "POST",
                        headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                        body: param
                    }).then(response => {
                return response.json();
            }).then(function (data)
            {
                if (data.response != null) {
                    Swal.fire(
                            'Eliminado',
                            'El empleado ha sido eliminado',
                            'success'
                            );
                    limpiarCampos();
                    document.getElementById('areaContenido').style.display = "none";
                    document.getElementById('letreroFormulario').innerHTML = "Abrir formulario.";
                    document.getElementById('tblEmpleadoCompleta').style.display = "block";
                    refrescarTabla();
                    document.getElementById("btnDelete").disabled = true;
                }
                if (data.exception != null) {
                    Swal.fire(
                            'Error',
                            'Hubo un error interno en el servidor.',
                            'error'
                            );
                }
                if (data.errorsec != null) {
                    localStorage.clear();
                    Swal.fire({
                        title: 'Token incorrecto',
                        text: data.errorsec,
                        icon: 'error',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Iniciar sesion'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            console.log(data);
                            alert("consola");
                            window.location = "index.html";
                        }
                    });
                }
                if (data.errorperm != null)
                {
                    Swal.fire('Error', data.errorperm, 'error');

                }

            });
        }
    });
}

function refrescarTabla() {
    let datos = null;
    let param = null;
//let url = "api/empleado/getAll?token=" + currentUser.usuario.lastToken;
    let showInactivos;
    if (document.getElementById("radActivo").checked) {
        showInactivos = false;
    } else if (document.getElementById("radInactivo").checked) {
        showInactivos = true;
    }
    let lastToken = localStorage.getItem("lastToken");
    let rol = localStorage.getItem("rol");
    let filtro = document.getElementById("txtBusqueda").value;
    datos = {
        filtro: filtro,
        showDeleted: showInactivos,
        token: lastToken
    };
    param = new URLSearchParams(datos);
    fetch("api/empleado/getAll",
            {
                method: "POST",
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                body: param
            }).then(response => {
        return response.json();
    })
            .then(function (data)
            {
                if (data.exception != null)
                {
                    Swal.fire('',
                            'Error interno del servidor. Intente nuevamente mas tarde.',
                            'error');
                    return;
                }
                if (data.error != null)
                {
                    Swal.fire('', data.error, 'warning');
                    return;
                }
                if (data.errorperm != null){
                    Swal.fire('Error', data.errorperm, 'error');
                    return;
                }
                if (data.errorsec != null)
                {
                    localStorage.clear();
                    Swal.fire({
                        title: 'Token incorrecto',
                        text: data.errorsec,
                        icon: 'error',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Iniciar sesion'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            console.log(data);
                            alert("consola");
                            window.location = "index.html";
                        }
                    });
                    return;
                }
                cargarTabla(data);
            });
}

function cargarTabla(data) {
    let contenido = "";
    empleados = data;
    console.log(empleados);
    empleados.forEach(function (empleado) {
        let registro =
                "<tr>" +
                "<td>" + empleado.numeroUnico + "</td>" +
                "<td>" + empleado.persona.nombre + "</td>" +
                "<td>" + empleado.persona.apellidoPaterno + "</td>" +
                "<td>" + empleado.persona.apellidoMaterno + "</td>" +
                "<td>" + empleado.persona.telMovil + "</td>" +
                "<td>" + empleado.usuario.nombre + "</td>" +
                "<td><a onclick='moduloEmpleados.mostrarDetalle(" + empleado.idEmpleado + ");'><i class='fa-solid fa-pen-to-square'></i></td></tr>";
        contenido += registro;
    });
    document.getElementById("tblEmpleados").innerHTML = contenido;
}

function mostrarDetalle(idEmpleado) {
    validarToken();
    document.getElementById("btnDelete").disabled = false;
    document.getElementById('areaContenido').style.display = "block";
    document.getElementById('letreroFormulario').innerHTML = "Cerrar formulario.";
    document.getElementById('tblEmpleadoCompleta').style.display = "none";
    for (var i = 0; i < empleados.length; i++) {
        if (idEmpleado === empleados[i].idEmpleado) {
            document.getElementById("txtNombre").value = empleados[i].persona.nombre;
            document.getElementById("txtApellidoPat").value = empleados[i].persona.apellidoPaterno;
            document.getElementById("txtApellidoMat").value = empleados[i].persona.apellidoMaterno;
            document.getElementById("txtGenero").value = empleados[i].persona.genero;
            // Mostrar la fecha en los select
            document.getElementById("txtFechaNac").value = empleados[i].persona.fechaNacimiento;
            let fecha = document.getElementById("txtFechaNac").value;
            let selectDia = fecha.substring(0, 2);
            let selectMes = fecha.substring(3, 5);
            let selectAnio = fecha.substring(6);
            asignarFecha(selectDia, selectMes, selectAnio);
            // Datos de domicilio
            document.getElementById("txtCalle").value = empleados[i].persona.calle;
            document.getElementById("txtNumDom").value = empleados[i].persona.numero;
            // Mostrar la colonia
            let select = document.getElementById("txtColonia");
            let option = document.createElement('option');
            option.value = empleados[i].persona.colonia;
            option.text = empleados[i].persona.colonia;
            option.selected = true;
            option.disabled = false;
            select.appendChild(option);
            document.getElementById("txtCodigoPostal").value = empleados[i].persona.cp;
            document.getElementById("txtCiudad").value = empleados[i].persona.ciudad;
            document.getElementById("txtEntidad").value = empleados[i].persona.estado;
            //Datos de contacto
            document.getElementById("txtTelefonoCasa").value = empleados[i].persona.telCasa;
            document.getElementById("txtTelefonoMov").value = empleados[i].persona.telMovil;
            document.getElementById("txtRFC").value = empleados[i].persona.rfc;
            document.getElementById("txtCorreo").value = empleados[i].persona.email;
            // Datos de seguridad
            document.getElementById("txtUsuario").value = empleados[i].usuario.nombre;
            document.getElementById("txtContrasennia").value = CryptoJS.MD5(empleados[i].usuario.contrasenia).toString();
            alert(empleados[i].usuario.contrasenia);
            document.getElementById("txtRol").value = empleados[i].usuario.rol;
            // Datos de identificación
            document.getElementById("txtIdEmpleado").value = empleados[i].idEmpleado;
            document.getElementById("txtIdPersona").value = empleados[i].persona.idPersona;
            document.getElementById("txtIdUsuario").value = empleados[i].usuario.idUsuario;
            document.getElementById("txtNUE").value = empleados[i].numeroUnico;
        }
    }
    document.getElementById("btnDelete").classList.remove("disabled");
}

function limpiarCampos() {
    document.getElementById("txtIdVideojuego").value = "";
    document.getElementById("txtTitulo").value = "";
    document.getElementById("cmbClasificacion").value = "Escoge una opción";
    document.getElementById("cmbDesarrolladora").value = "Escoge una opción";
    document.getElementById("fechaPublicacion").value = "";
    document.getElementById("txtTitulo").focus();
    document.getElementById("btnDelete").disabled = true;
}

// Validaciones

function validarvacios() {
// Datos personales
    let nombre = document.getElementById("txtNombre").value;
    let apePaterno = document.getElementById("txtApellidoPat").value;
    let genero = document.getElementById("txtGenero").value;
    let rfc = document.getElementById("txtRFC").value;
    let dia = document.getElementById("txtDia").value;
    let mes = document.getElementById("txtMes").value;
    let anio = document.getElementById("txtAnio").value;
    // Datos de domicilio
    let calle = document.getElementById("txtCalle").value;
    let numero = document.getElementById("txtNumDom").value;
    let colonia = document.getElementById("txtColonia").value;
    let codigoPostal = document.getElementById("txtCodigoPostal").value;
    let ciudad = document.getElementById("txtCiudad").value;
    let entidad = document.getElementById("txtEntidad").value;
    // Datos de contacto
    let telefonoMovil = document.getElementById("txtTelefonoMov").value;
    let correo = document.getElementById("txtCorreo").value;
    // Datos de seguridad
    let usuario = document.getElementById("txtUsuario").value;
    let contrasenia = document.getElementById("txtContrasennia").value;
    let rol = document.getElementById("txtRol").value;
    // Bandera
    let valid = true;
    let input = document.formEmpleado;
    // If datos personales
    if (nombre === "") {
        notificacion(input.txtNombre, "Ingrese un nombre");
        input.txtNombre.focus();
        valid = false;
    }
    if (apePaterno === "") {
        notificacion(input.txtApellidoPat, "Ingrese un apellido paterno");
        input.txtApellidoPat.focus();
        valid = false;
    }
    if (genero === "Escoge una opción") {
        notificacion(input.txtGenero, "Escoga una opción");
        input.txtGenero.focus();
        valid = false;
    }
    if (rfc === "") {
        notificacion(input.txtRFC, "Ingrese una RFC");
        input.txtRFC.focus();
        valid = false;
    }
    if (dia === "Día" || mes === "Mes" || anio === "Año") {
        notificacion(input.txtMes, "Ingrese una fecha de nacimiento");
        input.txtFechaNac.focus();
        valid = false;
    }

// If datos de domicilio
    if (calle === "") {
        notificacion(input.txtCalle, "Ingrese un nombre de calle");
        input.txtCalle.focus();
        valid = false;
    }
    if (numero === "") {
        notificacion(input.txtNumDom, "Ingrese un número de domicilio");
        input.txtNumDom.focus();
        valid = false;
    }
    if (colonia === "Selecciona una colonia") {
        notificacion(input.txtColonia, "Ingrese una colonia");
        input.txtColonia.focus();
        valid = false;
    }
    if (codigoPostal === "") {
        notificacion(input.txtCodigoPostal, "Ingrese un código postal");
        input.txtCodigoPostal.focus();
        valid = false;
    }
    if (ciudad === "") {
        notificacion(input.txtCiudad, "Ingrese una ciudad");
        input.txtCiudad.focus();
        valid = false;
    }
    if (entidad === "") {
        notificacion(input.txtEntidad, "Ingrese un estado");
        input.txtEntidad.focus();
        valid = false;
    }

// If datos de contacto
    if (telefonoMovil === "") {
        notificacion(input.txtTelefonoMov, "Ingrese un número de teléfono");
        input.txtTelefonoMov.focus();
        valid = false;
    }
    if (correo === "") {
        notificacion(input.txtCorreo, "Ingrese un correo");
        input.txtCorreo.focus();
        valid = false;
    }

// If datos de seguridad
    if (usuario === "") {
        notificacion(input.txtUsuario, "Ingrese un usuario");
        input.txtUsuario.focus();
        valid = false;
    }
    if (contrasenia === "") {
        notificacion(input.txtContrasennia, "Ingrese una contraseña");
        input.txtContrasennia.focus();
        valid = false;
    }
    if (rol === "Escoge una opción") {
        notificacion(input.txtRol, "Escoge una opción");
        input.txtRol.focus();
        valid = false;
    }

    return valid;
}

function validarRFC() {
    let rfc = document.getElementById("txtRFC").value;
    let input = document.formEmpleado;
    let valid = true;
    if (rfc.length !== 13) {
        notificacion(input.txtRFC, "Ingresa una RFC valida (13 dígitos)");
        input.txtRFC.focus();
        valid = false;
    }
    return valid;
}

function validarTelefonoMovil() {
    let telefonoMovil = document.getElementById("txtTelefonoMov").value;
    let input = document.formEmpleado;
    let valid = true;
    if (isNaN(telefonoMovil)) {
        notificacion(input.txtTelefonoMov, "Ingresa un número de teléfono válido");
        input.txtTelefonoMov.focus();
        valid = false;
    }
    return valid;
}

function validarTelefonoCasa() {
    let telefonoCasa = document.getElementById("txtTelefonoCasa").value;
    let input = document.formEmpleado;
    let valid = true;
    if (telefonoCasa !== "") {
        if (isNaN(telefonoCasa)) {
            notificacion(input.txtTelefonoCasa, "Ingresa un número de teléfono válido");
            input.txtTelefonoCasa.focus();
            valid = false;
        }
    }
    return valid;
}

function validarLongitudTelefono() {
    let telefonoMovil = document.getElementById("txtTelefonoMov").value;
    let telefonoCasa = document.getElementById("txtTelefonoCasa").value;
    let input = document.formEmpleado;
    let valid = true;
    if (telefonoMovil.length !== 10) {
        notificacion(input.txtTelefonoMov, "Ingresa un número de teléfono válido: 10 dígitos");
        input.txtTelefonoMov.focus();
        valid = false;
    }
    if (telefonoCasa !== "") {
        if (telefonoCasa.length !== 10) {
            notificacion(input.txtTelefonoCasa, "Ingresa un número de teléfono válido: 10 dígitos");
            input.txtTelefonoCasa.focus();
            valid = false;
        }
    }
    return valid;
}

function validarUsuario() {
    let input = document.formEmpleado;
    let usuario = document.getElementById("txtUsuario").value.toUpperCase();
    let idEmpleado = parseInt(document.getElementById("txtIdEmpleado").value);
    let idPersona = parseInt(document.getElementById("txtIdPersona").value);
    if (idEmpleado === 0 && idPersona === 0) {
        for (var i = 0; i < empleados.length; i++) {
            if (usuario === empleados[i].usuario.nombre) {
                Swal.fire("Verifica el usuario asignado", "Ya existe un empleado con ese usuario", "warning");
                input.txtUsuario.focus();
                return false;
            }
        }
    }
    return true;
}

function notificacion(elm, msg) {
// agrega un elemento p con el texto luego del input seleccionado
    if (!$(elm).next().is("p")) {
        $(elm).after(`<p style='color: red;'><strong><small>${msg}</small></strong></p>`);
        // elimina el mensaje luego de 2 segundos
        setTimeout(function () {
            $(elm).next().remove();
        }, 3000);
    }
}

// Servicio api rest copomex mailBox

function obtenerDatosDomicilio() {
    const token_glasscode6 = "45a670f1-500e-460d-869d-17314d297e40";
    //const token = "11ef7121-0baa-4ee9-8499-eb1c8c3d2f57";
    /*const token_glasscode6 = "45a670f1-500e-460d-869d-17314d297e40";
     const token_glasscode7 = "1732fdc8-6159-4679-8c46-792dfd94908f";
     const token_chilisquis = "ea71b1f5-41f9-4862-8f77-522d32784254";
     const token_glasscode8 = "39d9ac49-5774-4a3a-98d7-c431412cafec";
     const token_glasscode9 = "f68f5b61-1ac4-43ee-83eb-31726b60c2f6";
     const token_glasscode11 = "3ea0351d-ecfc-421d-a0c6-c40b6387fca7";
     const token_glasscode10 = "f2c9fd82-318c-4839-981f-641b944354dd";
     const token_glasscode4 = "be5c8d47-9403-4deb-8ca0-a1efb0330dd1";
     const token_glasscode6 = "45a670f1-500e-460d-869d-17314d297e40";
     const token_glasscode7 = "1732fdc8-6159-4679-8c46-792dfd94908f";
     const token_chilisquis = "ea71b1f5-41f9-4862-8f77-522d32784254";
     const token_glasscode8 = "39d9ac49-5774-4a3a-98d7-c431412cafec";
     const token_glasscode9 = "f68f5b61-1ac4-43ee-83eb-31726b60c2f6";*/
    let select = document.getElementById("txtColonia");
    let options = select.getElementsByTagName('OPTION');
    for (var i = 0; i < options.length; i++) {
        select.removeChild(options[i]);
        i--;
    }
    let option = document.createElement('option');
    option.value = "Selecciona una colonia";
    option.text = "Selecciona una colonia";
    option.selected = true;
    option.disabled = true;
    select.appendChild(option);

    let input = document.formEmpleado;
    let codigoPostal = document.getElementById("txtCodigoPostal").value;

    if (codigoPostal !== "") {
        if (codigoPostal.length < 5) {
            notificacion(input.txtCodigoPostal, "Ingresa un codigo postal de 5 dígitos");
            document.getElementById("txtCodigoPostal").value = "";
        } else {
            if (isNaN(codigoPostal)) {
                document.getElementById("txtCodigoPostal").value = "";
                notificacion(input.txtCodigoPostal, "Ingresa un codigo postal válido");
            } else {
                codigoPostal = parseInt(codigoPostal);
                let url = 'https://api.copomex.com/query/info_cp/' + codigoPostal + '?type=simplified&token=' + token_glasscode6;
                fetch(url)
                        .then(datosNaturales => {
                            return datosNaturales.json();
                        })
                        .then(datos => {
                            let entidad = datos.response["estado"];
                            let ciudad = datos.response["municipio"];
                            document.getElementById("txtEntidad").value = entidad;
                            document.getElementById("txtCiudad").value = ciudad;
                            let colonias = datos.response["asentamiento"];
                            let select = document.getElementById("txtColonia");
                            colonias.forEach(colonia => {
                                let opt = document.createElement('option');
                                opt.value = colonia;
                                opt.text = colonia;
                                select.appendChild(opt);
                            });
                        });
            }
        }
    } else {
        notificacion(input.txtCodigoPostal, "Ingresa un codigo postal");
    }
}

function validarCorreo() {
    const acces_key = "b63aeffb0c8f45d1b06c3a721fec1669";
    let correo = document.getElementById("txtCorreo").value;
    let url = "";
    let input = document.formEmpleado;
    if (correo !== "") {
        url = "https://emailvalidation.abstractapi.com/v1/?api_key=" + acces_key + "&email=" + correo;
        fetch(url)
                .then(datosNaturales => {
                    return datosNaturales.json();
                })
                .then(datos => {
                    let correo = datos.email;
                    let formatoValido = datos.is_valid_format["value"];
                    let encotrado = datos.is_mx_found["value"];
                    let smtp = datos.is_smtp_valid["value"];
                    if (formatoValido === true) {
                        notificacion(input.txtCorreo, "Correo válido");
                    } else {
                        document.getElementById("txtCorreo").value = "";
                        notificacion(input.txtCorreo, "Correo inválido");
                    }
                });
    } else {
        notificacion(input.txtCorreo, "Ingresa un correo");
    }
}

function sanitize(string) {
  const map = {
      '&': '',
      '<': '',
      '>': '',
      '"': '',
      "'": '',
      "/": '',
      ";": '',
      "´": ''
  };
  const reg = /[&<>"'/;´]/ig;
  return string.replace(reg, (match)=>(map[match]));
}
