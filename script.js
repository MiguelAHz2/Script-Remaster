// Constantes y configuración
const ANIMATION = {
    DURATION: {
        FAST: 150,
        NORMAL: 300,
        SLOW: 500
    },
    EASING: {
        BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        SMOOTH: 'cubic-bezier(0.4, 0, 0.2, 1)',
        SHARP: 'cubic-bezier(0.4, 0, 0.6, 1)'
    }
};

const THEME = {
    COLORS: {
        SUCCESS: '#10b981',
        ERROR: '#ef4444',
        WARNING: '#f59e0b',
        INFO: '#3b82f6'
    }
};

// Función mejorada para animar elementos
function animate(element, keyframes, options = {}) {
    const defaultOptions = {
        duration: ANIMATION.DURATION.NORMAL,
        easing: ANIMATION.EASING.SMOOTH,
        fill: 'forwards'
    };
    
    return element.animate(keyframes, { ...defaultOptions, ...options });
}

// Función mejorada para mostrar notificaciones estilizadas
function showNotification(title, type = 'success', message = '') {
    return Swal.fire({
        title,
        text: message,
        icon: type,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: 'rgba(17, 25, 40, 0.9)',
        color: '#fff',
        iconColor: {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        }[type],
        customClass: {
            popup: 'modern-toast',
            timerProgressBar: 'timer-progress-bar'
        },
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const elements = {
        modal: document.getElementById('textModal1'),
        modalScript: document.getElementById('cardModal'),
        openModalBtn: document.getElementById('openModal1'),
        openModalScriptBtn: document.getElementById('openModal'),
        closeModalBtn: document.getElementById('closeModal1'),
        closeModalScriptBtn: document.getElementById('closeModal'),
        resultText: document.getElementById('resultText'),
        form: document.getElementById('textForm1'),
        copyBtn: document.getElementById('copyBtn'),
        downloadBtn: document.getElementById('downloadButton'),
        toggleButtons: document.querySelectorAll('.toggle-btn')
    };

    // Estado global
    const state = {
        gpsStatus: 'ok',
        contactoStatus: 'ok',
        evidenciaStatus: false,
        clienteReagendaStatus: false,
        clientenoreconoceStatus: false,
        clientedesconoceStatus: false,
        fusionadoraStatus: false,
        squadStatus: false,
        showNumbers: true,
        todasLasGestiones: ''
    };

    // Función para mostrar notificaciones estilizadas
    function showNotification(title, type = 'success', message = '') {
        Swal.fire({
            title,
            text: message,
            icon: type,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: 'rgba(0, 0, 0, 0.9)',
            color: '#fff',
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        });
    }

    // Función mejorada para abrir modal
    function openModal(modalElement) {
        modalElement.style.display = 'flex';
        // Forzar un reflow para que las transiciones funcionen
        modalElement.offsetHeight;
        modalElement.classList.add('show');
    }

    // Función mejorada para cerrar modal
    function closeModal(modalElement) {
        modalElement.classList.remove('show');
        // Esperar a que termine la animación antes de ocultar
        setTimeout(() => {
            modalElement.style.display = 'none';
        }, 300); // 300ms es la duración de la transición
    }

    // Función mejorada para generar texto
    function generateText() {
        const formData = {
            activityId: document.getElementById('activityId1').value,
            ticketId: document.getElementById('ticketId1').value,
            technicianName: document.getElementById('technicianName1').value,
            comments: document.getElementById('comments1').value,
            numbers: Array.from(document.querySelectorAll('.numbers-grid input'))
                .map(input => input.value.trim())
                .filter(Boolean),
            reason: document.getElementById('reason').value
        };

        const statusTexts = {
            gps: state.gpsStatus === 'ok' ? '@conGPS' : '@sinGPS',
            contacto: state.contactoStatus === 'ok' ? '@concontacto' : '@sincontacto',
            evidencia: state.evidenciaStatus ? ' @conevidencia' : '',
            clienteReagenda: state.clienteReagendaStatus ? ' @clientereagenda' : '',
            clientenoreconoce: state.clientenoreconoceStatus ? ' @noreconoceagenda' : '',
            clientedesconoce: state.clientedesconoceStatus ? ' @desconoceagenda' : '',
            fusionadora: state.fusionadoraStatus ? ' @fusionadora' : '',
            squad: state.squadStatus ? ' @SQUAD' : ''
        };

        const numbersText = state.showNumbers && formData.numbers.length > 0
            ? `# Se llama a los números: ${formData.numbers.join(' ')}`
            : '';

        const finalText = `@convisita ${statusTexts.gps} @IVR ${statusTexts.contacto}${statusTexts.evidencia}${statusTexts.clienteReagenda}${statusTexts.clientenoreconoce}${statusTexts.clientedesconoce}${statusTexts.fusionadora}${statusTexts.squad} @IDactividad${formData.activityId} @IDTicketBlip${formData.ticketId} / ${formData.technicianName} / @${formData.reason}. ${formData.comments}. ${numbersText}`;

        const resultContent = elements.resultText.querySelector('.result-content');
        if (resultContent) {
            resultContent.textContent = finalText;
        }
    }

    // Función mejorada para limpiar formulario
    function limpiarFormulario() {
        elements.form.reset();
        
        // Resetear estados de botones y sus textos
        elements.toggleButtons.forEach(btn => {
            btn.classList.remove('active');
            
            // Restablecer texto según el ID del botón
            switch(btn.id) {
                case 'gpsBtn':
                    btn.innerHTML = '<i class="fas fa-map-marker-alt"></i> GPS ok';
                    state.gpsStatus = 'ok';
                    break;
                case 'contactBtn':
                    btn.innerHTML = '<i class="fas fa-phone-alt"></i> Con contacto';
                    state.contactoStatus = 'ok';
                    break;
                case 'evidenceBtn':
                    btn.innerHTML = '<i class="fas fa-camera"></i> Sin evidencia';
                    state.evidenciaStatus = false;
                    break;
                case 'clientReagendaBtn':
                    btn.innerHTML = '<i class="fas fa-calendar-alt"></i> Cliente no reagenda';
                    state.clienteReagendaStatus = false;
                    break;
                case 'clientenoreconoce':
                    btn.innerHTML = '<i class="fas fa-user-check"></i> Cliente reconoce agenda';
                    state.clientenoreconoceStatus = false;
                    break;
                case 'clientedesconoce':
                    btn.innerHTML = '<i class="fas fa-user-times"></i> Cliente no desconoce agenda';
                    state.clientedesconoceStatus = false;
                    break;
                case 'fusionadora':
                    btn.innerHTML = '<i class="fas fa-tools"></i> Sin fusionadora';
                    state.fusionadoraStatus = false;
                    break;
                case 'squad':
                    btn.innerHTML = '<i class="fas fa-users"></i> SQUAD';
                    state.squadStatus = false;
                    break;
            }
        });

        // Resetear estados globales
        state.gpsStatus = 'ok';
        state.contactoStatus = 'ok';
        state.evidenciaStatus = false;
        state.clienteReagendaStatus = false;
        state.clientenoreconoceStatus = false;
        state.clientedesconoceStatus = false;
        state.fusionadoraStatus = false;
        state.squadStatus = false;
        
        // Limpiar resultado
        const resultContent = elements.resultText.querySelector('.result-content');
        if (resultContent) {
            resultContent.textContent = '';
        }
    }

    // Función mejorada para copiar al portapapeles
    async function copyToClipboard() {
        try {
            const resultContent = elements.resultText.querySelector('.result-content');
            if (!resultContent || !resultContent.textContent) {
                await showNotification('No hay texto para copiar', 'warning');
                return;
            }

            await navigator.clipboard.writeText(resultContent.textContent);
            await showNotification(resultContent.textContent, 'success');
            saveGestion();
            limpiarFormulario();
        } catch (err) {
            console.error('Error al copiar:', err);
            await showNotification('Error al copiar el texto', 'error');
        }
    }

    // Función para guardar gestión
    function saveGestion() {
        const resultContent = elements.resultText.querySelector('.result-content');
        if (!resultContent || !resultContent.textContent) return;

        const gestionData = {
            idActividad: document.getElementById('activityId1').value,
            ticketBlip: document.getElementById('ticketId1').value,
            nombreTecnico: document.getElementById('technicianName1').value,
            comentariosGestion: document.getElementById('comments1').value,
            numeros: Array.from(document.querySelectorAll('.numbers-grid input'))
                .map(input => input.value.trim())
                .filter(Boolean),
            motivoCierre: document.getElementById('reason').value,
            comentariosGenerados: resultContent.textContent
        };

        const gestionFormateada = 
            `ID de actividad: ${gestionData.idActividad}\n\n` +
            `TicketBlip: ${gestionData.ticketBlip}\n\n` +
            `Nombre técnico: ${gestionData.nombreTecnico}\n\n` +
            `Comentarios de gestión: ${gestionData.comentariosGestion}\n\n` +
            `Números agregados: ${gestionData.numeros.join(' ')}\n\n` +
            `Motivo de cierre: ${gestionData.motivoCierre}\n\n` +
            `Comentarios generados: ${gestionData.comentariosGenerados}\n` +
            `°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\n\n`;

        state.todasLasGestiones += gestionFormateada;
    }

    // Event Listeners para los modales
    elements.openModalBtn.addEventListener('click', () => {
        openModal(elements.modal);
    });

    elements.openModalScriptBtn.addEventListener('click', () => {
        openModal(elements.modalScript);
    });

    elements.closeModalBtn.addEventListener('click', () => {
        closeModal(elements.modal);
    });

    elements.closeModalScriptBtn.addEventListener('click', () => {
        closeModal(elements.modalScript);
    });

    // Cerrar modales al hacer clic fuera
    window.addEventListener('click', (event) => {
        if (event.target === elements.modal) closeModal(elements.modal);
        if (event.target === elements.modalScript) closeModal(elements.modalScript);
    });

    // Cerrar modales con Escape
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (elements.modal.style.display === 'flex') closeModal(elements.modal);
            if (elements.modalScript.style.display === 'flex') closeModal(elements.modalScript);
        }
    });

    // Eventos para inputs
    elements.form.querySelectorAll('input, select').forEach(element => {
        element.addEventListener('input', generateText);
    });

    // Manejo de botones toggle
    elements.toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('active');
            
            // Actualizar estado y texto según el botón
            const buttonId = this.id;
            switch(buttonId) {
                case 'gpsBtn':
                    state.gpsStatus = this.classList.contains('active') ? 'no-ok' : 'ok';
                    this.innerHTML = this.classList.contains('active') ? 
                        '<i class="fas fa-map-marker-alt"></i> GPS no ok' : 
                        '<i class="fas fa-map-marker-alt"></i> GPS ok';
                    break;
                case 'contactBtn':
                    state.contactoStatus = this.classList.contains('active') ? 'no-ok' : 'ok';
                    this.innerHTML = this.classList.contains('active') ? 
                        '<i class="fas fa-phone-alt"></i> Sin contacto' : 
                        '<i class="fas fa-phone-alt"></i> Con contacto';
                    break;
                case 'evidenceBtn':
                    state.evidenciaStatus = this.classList.contains('active');
                    this.innerHTML = this.classList.contains('active') ? 
                        '<i class="fas fa-camera"></i> Con evidencia' : 
                        '<i class="fas fa-camera"></i> Sin evidencia';
                    break;
                case 'clientReagendaBtn':
                    state.clienteReagendaStatus = this.classList.contains('active');
                    this.innerHTML = this.classList.contains('active') ? 
                        '<i class="fas fa-calendar-alt"></i> Cliente reagenda' : 
                        '<i class="fas fa-calendar-alt"></i> Cliente no reagenda';
                    break;
                case 'clientenoreconoce':
                    state.clientenoreconoceStatus = this.classList.contains('active');
                    this.innerHTML = this.classList.contains('active') ? 
                        '<i class="fas fa-user-check"></i> Cliente no reconoce agenda' : 
                        '<i class="fas fa-user-check"></i> Cliente reconoce agenda';
                    break;
                case 'clientedesconoce':
                    state.clientedesconoceStatus = this.classList.contains('active');
                    this.innerHTML = this.classList.contains('active') ? 
                        '<i class="fas fa-user-times"></i> Cliente desconoce agenda' : 
                        '<i class="fas fa-user-times"></i> Cliente no desconoce agenda';
                    break;
                case 'fusionadora':
                    state.fusionadoraStatus = this.classList.contains('active');
                    this.innerHTML = this.classList.contains('active') ? 
                        '<i class="fas fa-tools"></i> Con fusionadora' : 
                        '<i class="fas fa-tools"></i> Sin fusionadora';
                    break;
                case 'squad':
                    state.squadStatus = this.classList.contains('active');
                    // El botón SQUAD mantiene su texto original
                    break;
            }
            
            generateText();
        });
    });

    // Evento para descargar gestiones
    elements.downloadBtn.addEventListener('click', async () => {
        if (!state.todasLasGestiones) {
            await showNotification('No hay gestiones para descargar', 'warning');
            return;
        }

        try {
            const today = new Date();
            const filename = `gestiones_${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}.txt`;
            
            const blob = new Blob([state.todasLasGestiones], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            await showNotification('Gestiones descargadas correctamente', 'success');
        } catch (error) {
            console.error('Error al descargar gestiones:', error);
            await showNotification('Error al descargar las gestiones', 'error');
        }
    });

    elements.copyBtn.addEventListener('click', copyToClipboard);

    // Inicializar texto
    generateText();
});

//2
document.addEventListener('DOMContentLoaded', () => {
    const openModalBtn = document.getElementById('openModal');
    const closeModalBtn = document.getElementById('closeModal');
    const modal = document.getElementById('cardModal');
    const cardForm = document.getElementById('cardForm');
    const cardContainer = document.getElementById('cardContainer');

    // Función para abrir el modal
    openModalBtn.addEventListener('click', () => {
        openModal(modal);
    });

    // Función para cerrar el modal
    closeModalBtn.addEventListener('click', () => {
        closeModal(modal);
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal(modal);
        }
    });

    // Cierra el modal si se presiona la tecla Escape
    window.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal(modal);
        }
    });

    // Crear tarjeta
    cardForm.addEventListener('submit', (e) => {
      e.preventDefault();
    
      const title = document.getElementById('cardTitle').value;
      const content = document.getElementById('cardContent').value;
      const color = document.getElementById('cardColor').value;
    
      const card = createCardElement(title, content, color);
      cardContainer.appendChild(card);
    
      saveCardsToLocalStorage();
    
      cardForm.reset();
      modal.style.display = 'none';
    });
    
    let cardIdCounter = 1;

    function createCardElement(title, content, color) {
        const card = document.createElement('div');
        card.className = 'card';
        card.id = `card-${cardIdCounter}`;
        cardIdCounter++;
        
        // Asegurarse de que el color sea válido
        const validColor = color || '#000000';
        
        card.innerHTML = `
            <div class="card-header" style="background-color: ${validColor}">
                <input type="color" class="color-picker" value="${validColor}" style="display: none;">
                <h5 class="card-title" contenteditable="false">${title}</h5>
            </div>
            <div class="card-body">
                <p class="card-text" contenteditable="false">${content}</p>
            </div>
            <div class="card-buttons">
                <button class="edit-btn"><img src="public/edit.svg" alt="edit" style="width: 17px;"></button>
                <button class="copy-btn"><img src="public/copy.svg" alt="copy" style="width: 17px;"></button>
                <button class="delete-btn"><img src="public/trash.svg" alt="delete" style="width: 17px;"></button>
            </div>
        `;

        // Agregar event listeners
        card.querySelector('.edit-btn').addEventListener('click', () => toggleEditMode(card));
        card.querySelector('.copy-btn').addEventListener('click', () => copyCardContent(card));
        card.querySelector('.delete-btn').addEventListener('click', () => confirmDeleteCard(card));

        return card;
    }

    // Función para copiar contenido de la tarjeta
    function copyCardContent(card) {
        const content = card.querySelector('.card-text').textContent;
        navigator.clipboard.writeText(content)
            .then(() => {
                showNotification(content, 'success');
            })
            .catch(err => {
                console.error('Error al copiar:', err);
                showNotification('Error al copiar el contenido', 'error');
            });
    }

    // Función para confirmar y eliminar tarjeta
    function confirmDeleteCard(card) {
        const swalConfig = {
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#3f3f46',
            background: 'rgb(17, 25, 40)',
            color: '#fff',
            allowOutsideClick: true,
            allowEscapeKey: true,
            allowEnterKey: true,
            stopKeydownPropagation: false
        };

        Swal.fire(swalConfig)
            .then(result => {
                if (result.isConfirmed) {
                    deleteCard(card);
                }
            });
    }

    // Función para eliminar la tarjeta
    function deleteCard(card) {
        try {
            // Animación de salida
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';

            setTimeout(() => {
                card.remove();
                saveCardsToLocalStorage();
                showNotification('Tarjeta eliminada', 'success');
            }, 300);
        } catch (error) {
            console.error('Error al eliminar la tarjeta:', error);
            showNotification('Error al eliminar la tarjeta', 'error');
        }
    }

    // Función para guardar las tarjetas
    function saveCardsToLocalStorage() {
        try {
            const cardElements = Array.from(cardContainer.children);
            const cards = cardElements.map(card => ({
                title: card.querySelector('.card-title').textContent,
                content: card.querySelector('.card-text').textContent,
                color: card.querySelector('.card-header').style.backgroundColor
            }));
            localStorage.setItem('cards', JSON.stringify(cards));
        } catch (error) {
            console.error('Error al guardar las tarjetas:', error);
            showNotification('Error al guardar los cambios', 'error');
        }
    }

    // Función para convertir RGB a Hexadecimal
    function rgbToHex(rgb) {
        // Si no hay color o es inválido, retornar un color por defecto
        if (!rgb) return '#000000';
        
        // Si ya es un color hex, retornarlo
        if (rgb.startsWith('#')) return rgb;
        
        // Extraer los valores RGB
        const rgbValues = rgb.match(/\d+/g);
        if (!rgbValues || rgbValues.length < 3) return '#000000';
        
        // Convertir a hex
        const r = parseInt(rgbValues[0]);
        const g = parseInt(rgbValues[1]);
        const b = parseInt(rgbValues[2]);
        
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    // Función unificada para manejar el modo de edición
    function toggleEditMode(card) {
        const textElement = card.querySelector('.card-text');
        const titleElement = card.querySelector('.card-title');
        const editBtn = card.querySelector('.edit-btn');
        const copyBtn = card.querySelector('.copy-btn');
        const colorPicker = card.querySelector('.color-picker');
        const cardHeader = card.querySelector('.card-header');

        const isEditing = textElement.isContentEditable;

        if (isEditing) {
            // Salir del modo edición
            textElement.contentEditable = "false";
            titleElement.contentEditable = "false";
            editBtn.innerHTML = `<img src="public/edit.svg" alt="edit" style="width: 17px;">`;
            editBtn.style.backgroundColor = "rgba(255, 255, 255, 0.1)"; // Volver al color original
            copyBtn.disabled = false;
            colorPicker.style.display = 'none';
            saveCardsToLocalStorage();
        } else {
            // Entrar al modo edición
            textElement.contentEditable = "true";
            titleElement.contentEditable = "true";
            editBtn.innerHTML = `<img src="public/save.png" alt="save" style="width: 17px;">`;
            editBtn.style.backgroundColor = "green";
            copyBtn.disabled = true;
            colorPicker.style.display = 'block';
            
            // Obtener el color actual y convertirlo a hex
            const currentColor = cardHeader.style.backgroundColor;
            colorPicker.value = rgbToHex(currentColor);

            // Manejar el cambio de color en tiempo real
            colorPicker.oninput = function(e) {
                cardHeader.style.backgroundColor = e.target.value;
                saveCardsToLocalStorage(); // Guardar cambios inmediatamente
            };
        }
    }

    // Función para importar tarjetas desde un string JSON
    function importarTarjetas(datosImportados) {
        // Convertir el string JSON en un objeto JavaScript
        const tarjetas = JSON.parse(datosImportados);
      
        // Recorrer cada objeto de tarjeta en los datos importados
        tarjetas.forEach(card => {
            const nuevaTarjeta = createCardElement(card.titulo, card.contenido, card.color);
            cardContainer.appendChild(nuevaTarjeta);
          });
      
        // Actualizar el almacenamiento local (opcional)
        saveCardsToLocalStorage();
      }
      
      // Función para exportar las tarjetas como un string JSON
      function exportarTarjetas() {
        const tarjetas = Array.from(cardContainer.children).map(tarjeta => {
          const titulo = tarjeta.querySelector('.card-title').textContent;
          const contenido = tarjeta.querySelector('.card-text').textContent;
          const color = tarjeta.querySelector('.card-header').style.backgroundColor;
          return {titulo, contenido, color};
        });
      
        const datosTarjetas = JSON.stringify(tarjetas);
      
        const opcionesExportacion = {
          copiarAlPortapapeles: async () => {
            try {
                await navigator.clipboard.writeText(datosTarjetas);
                await showNotification('¡Tarjetas exportadas al portapapeles!', 'success');
            } catch (err) {
                console.error('Error al copiar al portapapeles:', err);
                await showNotification('Error al exportar las tarjetas', 'error');
            }
          },
          descargarArchivo: async () => {
            try {
                const blob = new Blob([datosTarjetas], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'script.json';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                await showNotification('¡Archivo descargado correctamente!', 'success');
            } catch (error) {
                console.error('Error al descargar archivo:', error);
                await showNotification('Error al descargar el archivo', 'error');
            }
          }
        };
      
        Swal.fire({
            title: 'Exportar script',
            text: '¿Cómo deseas exportar el script?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Copiar al portapapeles',
            cancelButtonText: 'Cancelar',
            showDenyButton: true,
            denyButtonText: 'Descargar JSON',
            customClass: {
              container: 'swal2-container',
              popup: 'swal2-modal',
            },
            didOpen: (modal) => {
              modal.setAttribute('data-modal', 'import-export');
              modal.parentElement.setAttribute('data-modal', 'import-export');
            },
            background: 'rgba(17, 25, 40, 0.95)',
            color: '#fff',
            confirmButtonColor: '#10b981',
            denyButtonColor: '#3b82f6',
            cancelButtonColor: '#ef4444'
        }).then((result) => {
            if (result.isConfirmed) {
                opcionesExportacion.copiarAlPortapapeles();
            } else if (result.isDenied) {
                opcionesExportacion.descargarArchivo();
            }
        });
      }
      
      // Agregar eventos a los botones de importar y exportar
      document.getElementById('importarButton').addEventListener('click', () => {
        Swal.fire({
          title: 'Importar script',
          input: 'textarea',
          inputLabel: 'Pega el script JSON aquí:',
          inputPlaceholder: '{}',
          showCancelButton: true,
          confirmButtonText: 'Importar',
          cancelButtonText: 'Cancelar',
          customClass: {
            container: 'swal2-container',
            popup: 'swal2-modal',
          },
          didOpen: (modal) => {
            modal.setAttribute('data-modal', 'import-export');
            modal.parentElement.setAttribute('data-modal', 'import-export');
          },
          background: 'rgba(17, 25, 40, 0.95)',
          color: '#fff',
          confirmButtonColor: '#10b981',
          cancelButtonColor: '#ef4444'
        }).then((result) => {
          if (result.isConfirmed) {
            importarTarjetas(result.value);
          }
        });
      });
      
      document.getElementById('exportarButton').addEventListener('click', exportarTarjetas);

    // Load cards from local storage (or create new cards if no data)
    function loadCardsFromLocalStorage() {
        const storedCards = JSON.parse(localStorage.getItem('cards')) || []; // Default to empty array if no data
        storedCards.forEach(card => {
            const cardElement = createCardElement(card.title, card.content, card.color);
            cardContainer.appendChild(cardElement);
        });
    }

    // Cargar tarjetas al inicio
    loadCardsFromLocalStorage();

    const sortable = Sortable.create(cardContainer, {
        animation: 150, // Animation duration (optional)
        handle: '.card-header', // Element used to initiate dragging (optional)
        ghostClass: 'sortable-ghost', // Class for the ghost element (optional)
        onEnd: () => {
            saveCardsToLocalStorage(); // Save new order after dragging
        },
    });
});

document.addEventListener('DOMContentLoaded', (event) => {
    var cardContainer = document.getElementById('cardContainer');
    var sortable = Sortable.create(cardContainer, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        handle: '.card-header',
        onEnd: (evt) => {
            // Guarda el nuevo orden de las tarjetas en el almacenamiento local
            saveCardsToLocalStorage();
            loadCardsFromLocalStorage()
        }
    });
});

// Función para aplicar la imagen de fondo almacenada
function applyBackground() {
    const backgroundImage = localStorage.getItem('backgroundImage');
    if (backgroundImage) {
        animate(document.body, [
            { opacity: 0 }
        ], {
            duration: 0,
            fill: 'forwards'
        });

        document.body.style.backgroundImage = `url(${backgroundImage})`;
        
        animate(document.body, [
            { opacity: 0 },
            { opacity: 1 }
        ], {
            duration: ANIMATION.DURATION.SLOW,
            easing: ANIMATION.EASING.SMOOTH
        });
    }
}

// Función para manejar el cambio de imagen
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const imageUrl = e.target.result;
            
            animate(document.body, [
                { opacity: 1 },
                { opacity: 0 }
            ], {
                duration: ANIMATION.DURATION.NORMAL
            }).finished.then(() => {
                document.body.style.backgroundImage = `url(${imageUrl})`;
                localStorage.setItem('backgroundImage', imageUrl);
                
                animate(document.body, [
                    { opacity: 0 },
                    { opacity: 1 }
                ], {
                    duration: ANIMATION.DURATION.SLOW,
                    easing: ANIMATION.EASING.SMOOTH
                });
            });
        };

        reader.readAsDataURL(file);
    }
});

// Aplica la imagen de fondo al cargar la página
applyBackground();

const scrollUpBtn = document.getElementById('scroll-up-btn');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrolled > 100) {
        scrollUpBtn.classList.add('visible');
    } else {
        scrollUpBtn.classList.remove('visible');
    }
});

scrollUpBtn.addEventListener('click', () => {
    // Obtener la posición actual
    const startPosition = window.pageYOffset;
    const duration = 1000; // Duración de la animación en ms
    const startTime = performance.now();

    function scrollAnimation(currentTime) {
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Función de easing para un movimiento más suave
        const easing = t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        
        const newPosition = startPosition * (1 - easing(progress));
        window.scrollTo(0, newPosition);

        if (progress < 1) {
            requestAnimationFrame(scrollAnimation);
        }
    }

    requestAnimationFrame(scrollAnimation);
});