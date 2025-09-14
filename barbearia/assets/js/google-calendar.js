/**
 * Script para integração com Google Calendar
 * Este script permite que os clientes adicionem seus agendamentos ao Google Calendar
 */

document.addEventListener('DOMContentLoaded', function() {
    // Configuração da API do Google Calendar
    const calendarConfig = {
        apiKey: 'YOUR_API_KEY', // Substitua pela sua chave de API do Google
        clientId: 'YOUR_CLIENT_ID', // Substitua pelo seu ID de cliente OAuth
        scopes: 'https://www.googleapis.com/auth/calendar.events'
    };
    
    // Elementos do DOM
    const addToCalendarButtons = document.querySelectorAll('.add-to-calendar');
    const appointmentForm = document.getElementById('appointment-form');
    
    // Carregar a API do Google Calendar
    function loadGoogleCalendarApi() {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = initializeGoogleCalendarApi;
        document.body.appendChild(script);
    }
    
    // Inicializar a API do Google Calendar
    function initializeGoogleCalendarApi() {
        gapi.load('client:auth2', initClient);
    }
    
    // Inicializar o cliente da API
    function initClient() {
        gapi.client.init({
            apiKey: calendarConfig.apiKey,
            clientId: calendarConfig.clientId,
            scope: calendarConfig.scopes,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
        }).then(() => {
            // Adicionar listeners aos botões após a API estar carregada
            addToCalendarButtons.forEach(button => {
                button.addEventListener('click', handleAddToCalendar);
                button.removeAttribute('disabled');
                button.setAttribute('aria-disabled', 'false');
            });
            
            // Adicionar listener ao formulário de agendamento
            if (appointmentForm) {
                appointmentForm.addEventListener('submit', handleAppointmentSubmit);
            }
            
            // Verificar se o usuário já está autenticado
            updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
            
            // Ouvir mudanças no estado de autenticação
            gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        }).catch(error => {
            console.error('Erro ao inicializar a API do Google Calendar:', error);
            showCalendarError('Não foi possível carregar a API do Google Calendar. Por favor, tente novamente mais tarde.');
        });
    }
    
    // Atualizar a interface com base no status de autenticação
    function updateSigninStatus(isSignedIn) {
        addToCalendarButtons.forEach(button => {
            if (isSignedIn) {
                button.textContent = 'Adicionar ao Google Calendar';
                button.classList.remove('btn-secondary');
                button.classList.add('btn-success');
            } else {
                button.textContent = 'Entrar no Google Calendar';
                button.classList.remove('btn-success');
                button.classList.add('btn-secondary');
            }
        });
    }
    
    // Manipular clique no botão "Adicionar ao Calendar"
    function handleAddToCalendar(event) {
        event.preventDefault();
        
        const button = event.currentTarget;
        const appointmentData = JSON.parse(button.getAttribute('data-appointment'));
        
        // Verificar se o usuário está autenticado
        if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
            // Se não estiver autenticado, iniciar o processo de autenticação
            gapi.auth2.getAuthInstance().signIn().then(() => {
                // Após autenticação bem-sucedida, adicionar o evento
                addEventToCalendar(appointmentData);
            }).catch(error => {
                console.error('Erro de autenticação:', error);
                showCalendarError('Falha na autenticação com o Google. Por favor, tente novamente.');
            });
        } else {
            // Se já estiver autenticado, adicionar o evento diretamente
            addEventToCalendar(appointmentData);
        }
    }
    
    // Adicionar evento ao Google Calendar
    function addEventToCalendar(appointmentData) {
        const event = createCalendarEvent(appointmentData);
        
        gapi.client.calendar.events.insert({
            'calendarId': 'primary',
            'resource': event
        }).then(response => {
            console.log('Evento adicionado:', response);
            showCalendarSuccess('Agendamento adicionado ao seu Google Calendar com sucesso!');
            
            // Adicionar link para o evento
            const eventLink = response.result.htmlLink;
            if (eventLink) {
                showCalendarEventLink(eventLink);
            }
        }).catch(error => {
            console.error('Erro ao adicionar evento:', error);
            showCalendarError('Não foi possível adicionar o evento ao Google Calendar. Por favor, tente novamente.');
        });
    }
    
    // Criar objeto de evento para o Google Calendar
    function createCalendarEvent(appointmentData) {
        const { service, barber, date, time, duration, name, email, phone } = appointmentData;
        
        // Calcular data e hora de início
        const startDateTime = new Date(`${date}T${time}`);
        
        // Calcular data e hora de término (duração padrão: 30 minutos)
        const endDateTime = new Date(startDateTime.getTime() + (duration || 30) * 60000);
        
        // Formatar datas para o formato ISO 8601
        const start = startDateTime.toISOString();
        const end = endDateTime.toISOString();
        
        // Criar descrição do evento
        const description = `Serviço: ${service}\nBarbeiro: ${barber}\nCliente: ${name}\nTelefone: ${phone}\nEmail: ${email}`;
        
        // Retornar objeto de evento
        return {
            'summary': `Agendamento: ${service} - Barbearia`,
            'location': 'Barbearia, Rua Principal, 123',
            'description': description,
            'start': {
                'dateTime': start,
                'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            'end': {
                'dateTime': end,
                'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            'reminders': {
                'useDefault': false,
                'overrides': [
                    {'method': 'email', 'minutes': 24 * 60}, // 1 dia antes
                    {'method': 'popup', 'minutes': 60} // 1 hora antes
                ]
            }
        };
    }
    
    // Manipular envio do formulário de agendamento
    function handleAppointmentSubmit(event) {
        // Não impedir o envio do formulário, apenas capturar os dados
        const form = event.currentTarget;
        
        // Verificar se o botão de adicionar ao calendário está presente
        const addToCalendarCheckbox = form.querySelector('#add-to-calendar-checkbox');
        if (addToCalendarCheckbox && addToCalendarCheckbox.checked) {
            // Capturar dados do formulário
            const appointmentData = {
                service: form.querySelector('#service').value,
                barber: form.querySelector('#barber').value,
                date: form.querySelector('#date').value,
                time: form.querySelector('#time').value,
                duration: getServiceDuration(form.querySelector('#service').value),
                name: form.querySelector('#name').value,
                email: form.querySelector('#email').value,
                phone: form.querySelector('#phone').value
            };
            
            // Armazenar temporariamente os dados do agendamento
            sessionStorage.setItem('pendingAppointment', JSON.stringify(appointmentData));
        }
    }
    
    // Obter duração do serviço em minutos
    function getServiceDuration(service) {
        const serviceDurations = {
            'corte': 30,
            'barba': 20,
            'combo': 45,
            'outros': 30
        };
        
        return serviceDurations[service.toLowerCase()] || 30;
    }
    
    // Exibir mensagem de sucesso
    function showCalendarSuccess(message) {
        const alertContainer = document.createElement('div');
        alertContainer.className = 'alert alert-success mt-3';
        alertContainer.setAttribute('role', 'alert');
        alertContainer.textContent = message;
        
        // Adicionar ao DOM
        const container = document.querySelector('.calendar-alerts') || document.querySelector('.container');
        if (container) {
            container.prepend(alertContainer);
            
            // Remover após 5 segundos
            setTimeout(() => {
                alertContainer.remove();
            }, 5000);
        }
    }
    
    // Exibir mensagem de erro
    function showCalendarError(message) {
        const alertContainer = document.createElement('div');
        alertContainer.className = 'alert alert-danger mt-3';
        alertContainer.setAttribute('role', 'alert');
        alertContainer.textContent = message;
        
        // Adicionar ao DOM
        const container = document.querySelector('.calendar-alerts') || document.querySelector('.container');
        if (container) {
            container.prepend(alertContainer);
            
            // Remover após 5 segundos
            setTimeout(() => {
                alertContainer.remove();
            }, 5000);
        }
    }
    
    // Exibir link para o evento
    function showCalendarEventLink(eventLink) {
        const linkContainer = document.createElement('div');
        linkContainer.className = 'mt-3';
        
        const link = document.createElement('a');
        link.href = eventLink;
        link.target = '_blank';
        link.className = 'btn btn-outline-primary btn-sm';
        link.textContent = 'Ver no Google Calendar';
        link.setAttribute('aria-label', 'Abrir evento no Google Calendar (abre em nova janela)');
        
        linkContainer.appendChild(link);
        
        // Adicionar ao DOM
        const container = document.querySelector('.calendar-alerts') || document.querySelector('.container');
        if (container) {
            container.prepend(linkContainer);
        }
    }
    
    // Verificar se há um agendamento pendente no sessionStorage
    function checkPendingAppointment() {
        const pendingAppointment = sessionStorage.getItem('pendingAppointment');
        if (pendingAppointment) {
            try {
                const appointmentData = JSON.parse(pendingAppointment);
                
                // Criar botão para adicionar ao calendário
                const button = document.createElement('button');
                button.className = 'btn btn-success mt-3';
                button.textContent = 'Adicionar agendamento ao Google Calendar';
                button.setAttribute('aria-label', 'Adicionar este agendamento ao seu Google Calendar');
                button.setAttribute('data-appointment', pendingAppointment);
                button.addEventListener('click', handleAddToCalendar);
                
                // Adicionar ao DOM
                const successMessage = document.querySelector('.appointment-success');
                if (successMessage) {
                    successMessage.appendChild(button);
                }
                
                // Limpar o agendamento pendente
                sessionStorage.removeItem('pendingAppointment');
            } catch (error) {
                console.error('Erro ao processar agendamento pendente:', error);
                sessionStorage.removeItem('pendingAppointment');
            }
        }
    }
    
    // Inicializar
    loadGoogleCalendarApi();
    
    // Verificar agendamentos pendentes
    checkPendingAppointment();
});