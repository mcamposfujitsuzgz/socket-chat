var params = new URLSearchParams(window.location.search);

// funcion para renderizar usuarios
function renderizarUsuarios(personas) {
    //console.log(personas);

    var html = '<li><a href="javascript:void(0)" class="active"> ' + params.get('sala') + ' </span></a></li>';

    for (var i = 0; i < personas.length; i++) {
        html += '<li><a data-id="' + personas[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span> ' + personas[i].nombre + '<small class="text-success">online</small></span></a></li>';
    }

    $('#divUsuarios').html(html);
}

$('#divUsuarios').on('click', 'a', function() {
    var id = $(this).data('id');

    if (id) {
        console.log(id);
    }
});

$('#formEnviar').on('submit', function(e) {
    console.log($('#txtMensaje').val());
    e.preventDeafult();

    if ($('#txtMensaje').val().trim().length === 0) {
        return;
    }

    socket.emit('crearMensaje', {
        nombre: params.get('nombre'),
        sala: params.get('sala'),
        mensaje: $('#txtMensaje').val()
    }, function(mensaje) {
        //console.log('respuesta server: ', mensaje);
        $('#txtMensaje').val('').focus();
        renderizarMensajes(mensaje, true);
    });
});

function renderizarMensajes(mensaje, yo) {
    var html = '';
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes;
    var adminClass = 'info';

    if (mensaje.nombre === 'Administrador') {
        adminClass = 'danger';
    }

    if (yo) {
        html += '<li class="reverse">';
        html += '<div class="chat-content">';
        html += '<h5>' + mensaje.nombre + '</h5>';
        html += '<div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '</div>';
        html += '<div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '<div class="chat-time">' + hora + '/div>';
        html += '</li>';
    } else {
        html += '<li><div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        html += '<div class="chat-content">';
        html += '<h5>' + mensaje.nombre + '</h5>';
        html += '<div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>';
        html += '</div>';
        html += '<div class="chat-time">' + hora + '</div>';
        html += '</li>';
    }

    $('#divChatbox').append(html);
    scrollBottom();
}

function scrollBottom() {
    var divChatbox = $('#divChatbox');

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}