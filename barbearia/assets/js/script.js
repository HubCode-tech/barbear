document.addEventListener('DOMContentLoaded', function() {
    // Gallery filter com acessibilidade
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (filterBtns.length > 0 && galleryItems.length > 0) {
        // Configurar navegação por teclado para os filtros
        const enableFilterNavigation = () => {
            const filters = Array.from(filterBtns);
            let filterFocus = filters.findIndex(filter => filter.classList.contains('active'));
            
            filters.forEach(filter => {
                filter.addEventListener('keydown', e => {
                    // Mover para a esquerda/direita com as setas
                    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                        filters[filterFocus].setAttribute('tabindex', '-1');
                        
                        if (e.key === 'ArrowRight') {
                            filterFocus++;
                            if (filterFocus >= filters.length) {
                                filterFocus = 0;
                            }
                        } else if (e.key === 'ArrowLeft') {
                            filterFocus--;
                            if (filterFocus < 0) {
                                filterFocus = filters.length - 1;
                            }
                        }
                        
                        filters[filterFocus].setAttribute('tabindex', '0');
                        filters[filterFocus].focus();
                    }
                    
                    // Ativar o filtro com Enter ou Space
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.target.click();
                    }
                });
            });
        };
        
        // Configurar inicialmente
        filterBtns.forEach(btn => {
            btn.setAttribute('tabindex', btn.classList.contains('active') ? '0' : '-1');
        });
        enableFilterNavigation();
        
        // Adicionar evento de clique para filtrar
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Atualizar atributos ARIA e classes
                filterBtns.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                    btn.setAttribute('tabindex', '-1');
                });
                
                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');
                this.setAttribute('tabindex', '0');
                
                // Filtrar os itens da galeria
                galleryItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    
                    if (filter === 'all' || filter === category) {
                        item.classList.remove('hide');
                        item.removeAttribute('aria-hidden');
                    } else {
                        item.classList.add('hide');
                        item.setAttribute('aria-hidden', 'true');
                    }
                });
                
                // Anunciar para leitores de tela
                const liveRegion = document.getElementById('gallery-grid');
                if (liveRegion) {
                    liveRegion.setAttribute('aria-live', 'polite');
                    setTimeout(() => {
                        liveRegion.removeAttribute('aria-live');
                    }, 1000);
                }
            });
        });
    }
    // Mobile menu toggle com acessibilidade
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            // Atualizar o texto do aria-label
            if (!isExpanded) {
                menuToggle.setAttribute('aria-label', 'Fechar menu');
            } else {
                menuToggle.setAttribute('aria-label', 'Abrir menu');
            }
        });
        
        // Adicionar suporte para navegação por teclado
        menuToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                menuToggle.click();
            }
        });
    }
    
    // Booking tabs com acessibilidade
    const bookingTabs = document.querySelectorAll('.booking-tab');
    const bookingContents = document.querySelectorAll('.booking-content');
    
    if (bookingTabs.length > 0) {
        // Configurar navegação por teclado para as abas
        const enableTabNavigation = () => {
            const tabs = Array.from(bookingTabs);
            let tabFocus = tabs.findIndex(tab => tab.classList.contains('active'));
            
            // Adicionar eventos de teclado para navegação acessível
            tabs.forEach(tab => {
                tab.setAttribute('role', 'tab');
                tab.setAttribute('tabindex', tab.classList.contains('active') ? '0' : '-1');
                tab.setAttribute('aria-selected', tab.classList.contains('active') ? 'true' : 'false');
                
                const tabId = tab.getAttribute('data-tab');
                const tabPanel = document.getElementById(`${tabId}-content`);
                if (tabPanel) {
                    tabPanel.setAttribute('role', 'tabpanel');
                    tabPanel.setAttribute('aria-labelledby', tab.id || tabId);
                    tab.setAttribute('aria-controls', tabPanel.id);
                }
                
                tab.addEventListener('keydown', e => {
                    // Mover para a esquerda/direita com as setas
                    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                        tabs[tabFocus].setAttribute('tabindex', '-1');
                        
                        if (e.key === 'ArrowRight') {
                            tabFocus++;
                            if (tabFocus >= tabs.length) {
                                tabFocus = 0;
                            }
                        } else if (e.key === 'ArrowLeft') {
                            tabFocus--;
                            if (tabFocus < 0) {
                                tabFocus = tabs.length - 1;
                            }
                        }
                        
                        tabs[tabFocus].setAttribute('tabindex', '0');
                        tabs[tabFocus].focus();
                    }
                    
                    // Ativar a aba com Enter ou Space
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.target.click();
                    }
                });
            });
        };
        
        // Configurar inicialmente
        enableTabNavigation();
        
        bookingTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and contents
                bookingTabs.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                    t.setAttribute('tabindex', '-1');
                });
                bookingContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');
                tab.setAttribute('tabindex', '0');
                
                // Show corresponding content
                const tabId = tab.getAttribute('data-tab');
                document.getElementById(`${tabId}-content`).classList.add('active');
            });
        });
    }
    
    // FAQ accordion com acessibilidade
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            // Configurar atributos ARIA
            question.setAttribute('role', 'button');
            question.setAttribute('aria-expanded', 'false');
            const answerId = 'answer-' + Math.random().toString(36).substr(2, 9);
            const answer = question.nextElementSibling;
            answer.id = answerId;
            question.setAttribute('aria-controls', answerId);
            
            // Adicionar suporte para navegação por teclado
            question.setAttribute('tabindex', '0');
            question.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
            
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                const icon = question.querySelector('i');
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                
                // Atualizar estado ARIA
                question.setAttribute('aria-expanded', !isExpanded);
                
                // Toggle active class
                question.classList.toggle('active');
                
                // Toggle icon
                if (icon) {
                    icon.classList.toggle('fa-chevron-down');
                    icon.classList.toggle('fa-chevron-up');
                }
                
                // Toggle answer visibility
                if (answer.style.maxHeight) {
                    answer.style.maxHeight = null;
                } else {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        });
    }
    
    // Form validation for appointment form com acessibilidade
    const appointmentForm = document.getElementById('appointment-form');
    
    if (appointmentForm) {
        // Adicionar atributos ARIA para campos obrigatórios
        const requiredFields = appointmentForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.setAttribute('aria-required', 'true');
        });
        
        // Criar elemento para mensagens de erro acessíveis
        const errorContainer = document.createElement('div');
        errorContainer.id = 'form-errors';
        errorContainer.className = 'error-container';
        errorContainer.setAttribute('role', 'alert');
        errorContainer.setAttribute('aria-live', 'assertive');
        appointmentForm.prepend(errorContainer);
        
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            let isValid = true;
            let errorMessages = [];
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    field.setAttribute('aria-invalid', 'true');
                    
                    // Obter o label associado ao campo
                    const fieldId = field.id;
                    const fieldLabel = document.querySelector(`label[for="${fieldId}"]`);
                    const fieldName = fieldLabel ? fieldLabel.textContent : field.name;
                    
                    errorMessages.push(`O campo ${fieldName} é obrigatório.`);
                } else {
                    field.classList.remove('error');
                    field.setAttribute('aria-invalid', 'false');
                }
            });
            
            if (isValid) {
                // Capturar dados do formulário para possível uso com Google Calendar
                const appointmentData = {
                    service: this.querySelector('#service')?.value,
                    barber: this.querySelector('#barber')?.value,
                    date: this.querySelector('#date')?.value,
                    time: this.querySelector('#time')?.value,
                    name: this.querySelector('#name')?.value,
                    email: this.querySelector('#email')?.value,
                    phone: this.querySelector('#phone')?.value,
                    notes: this.querySelector('#notes')?.value
                };
                
                // Verificar se o usuário quer adicionar ao Google Calendar
                const addToCalendarCheckbox = this.querySelector('#add-to-calendar-checkbox');
                if (addToCalendarCheckbox && addToCalendarCheckbox.checked) {
                    // Armazenar dados para uso pelo script do Google Calendar
                    sessionStorage.setItem('pendingAppointment', JSON.stringify(appointmentData));
                    // Disparar evento personalizado para notificar o script do Google Calendar
                    document.dispatchEvent(new CustomEvent('appointmentCreated', { detail: appointmentData }));
                }
                
                // Here you would typically send the form data to a server
                // For now, we'll just show an alert and update ARIA live region
                errorContainer.innerHTML = '';
                errorContainer.textContent = 'Agendamento realizado com sucesso! Em breve entraremos em contato para confirmar.';
                errorContainer.className = 'success-container';
                appointmentForm.reset();
                
                // Focar no container de mensagem para leitores de tela
                errorContainer.focus();
            } else {
                // Exibir mensagens de erro no container acessível
                errorContainer.innerHTML = '';
                errorContainer.className = 'error-container';
                
                const errorList = document.createElement('ul');
                errorMessages.forEach(message => {
                    const errorItem = document.createElement('li');
                    errorItem.textContent = message;
                    errorList.appendChild(errorItem);
                });
                
                errorContainer.appendChild(errorList);
                errorContainer.focus();
            }
        });
    }
    
    // Form validation for contact form com acessibilidade
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        // Adicionar atributos ARIA para campos obrigatórios
        const requiredFields = contactForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.setAttribute('aria-required', 'true');
        });
        
        // Criar elemento para mensagens de erro acessíveis
        const errorContainer = document.createElement('div');
        errorContainer.id = 'contact-form-errors';
        errorContainer.className = 'error-container';
        errorContainer.setAttribute('role', 'alert');
        errorContainer.setAttribute('aria-live', 'assertive');
        contactForm.prepend(errorContainer);
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            let isValid = true;
            let errorMessages = [];
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    field.setAttribute('aria-invalid', 'true');
                    
                    // Obter o label associado ao campo
                    const fieldId = field.id;
                    const fieldLabel = document.querySelector(`label[for="${fieldId}"]`);
                    const fieldName = fieldLabel ? fieldLabel.textContent : field.name;
                    
                    errorMessages.push(`O campo ${fieldName} é obrigatório.`);
                } else {
                    field.classList.remove('error');
                    field.setAttribute('aria-invalid', 'false');
                }
            });
            
            if (isValid) {
                // Here you would typically send the form data to a server
                // For now, we'll just update ARIA live region
                errorContainer.innerHTML = '';
                errorContainer.textContent = 'Mensagem enviada com sucesso! Responderemos em breve.';
                errorContainer.className = 'success-container';
                contactForm.reset();
                
                // Focar no container de mensagem para leitores de tela
                errorContainer.focus();
            } else {
                // Exibir mensagens de erro no container acessível
                errorContainer.innerHTML = '';
                errorContainer.className = 'error-container';
                
                const errorList = document.createElement('ul');
                errorMessages.forEach(message => {
                    const errorItem = document.createElement('li');
                    errorItem.textContent = message;
                    errorList.appendChild(errorItem);
                });
                
                errorContainer.appendChild(errorList);
                errorContainer.focus();
            }
        });
    }
    
    // Add CSS class for form field validation styling
    const addErrorStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            .error {
                border: 1px solid var(--danger-color) !important;
                background-color: rgba(220, 53, 69, 0.05);
            }
        `;
        document.head.appendChild(style);
    };
    
    addErrorStyles();
});