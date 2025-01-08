document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('appointment-form');
    const tableBody = document.querySelector('#appointments-table tbody');
    const noDataRow = document.getElementById('no-data');

    // Función para actualizar la tabla
    const updateTable = (appointments) => {
        if (appointments.length > 0) {
            tableBody.innerHTML = '';
            noDataRow.style.display = 'none';
            appointments.forEach((appointment, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
            <td>${index + 1}</td>
            <td>${appointment.date}</td>
            <td>${appointment.dni}</td>
            <td>${appointment.name}</td>
            <td>${appointment.lastname}</td>
            <td>${appointment.phone}</td>
            <td>${appointment.birthdate}</td>
            <td>${appointment.notes}</td>
            <td>
                <button class="edit-btn" data-id="${appointment.id}">Editar</button>
                <button class="delete-btn" data-id="${appointment.id}">Eliminar</button>
            </td>
        `;
                tableBody.appendChild(row);
            });
        }
    };

    // Cargar citas desde el almacenamiento local
    const loadAppointments = () => {
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        updateTable(appointments);
    };

    // Validar formulario
    const validateForm = () => {
        const inputs = form.querySelectorAll('input, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value == "") {
                input.classList.add('error');
                isValid = false;
            } else {
                input.classList.remove('error');
            }
        });

        const phoneInput = document.getElementById('phone');
        if (isNaN(phoneInput.value)) {
            phoneInput.classList.add('error');
            isValid = false;
        } else {
            phoneInput.classList.remove('error');
        }

        return isValid;
    };

    // Manejar envío del formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (validateForm()) {
            const appointment = {
            id: Date.now(),
            date: form.date.value,
            name: form.name.value,
            dni: form.dni.value,
            lastname: form.lastname.value,
            phone: form.phone.value,
            birthdate: form.birthdate.value,
            notes: form.notes.value
        };
            let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
            appointments.push(appointment);
            localStorage.setItem('appointments', JSON.stringify(appointments));

            updateTable(appointments);

            form.reset();
        }
    });

    // Manejar eliminación de citas
    tableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.dataset.id;
            let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
            appointments = appointments.filter(appt => appt.id != id);
            localStorage.setItem('appointments', JSON.stringify(appointments));
            updateTable(appointments);
        }
    });

    // Manejar edición de citas
    tableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-btn')) {
            const id = e.target.dataset.id;
            const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
            const appointment = appointments.find(appt => appt.id == id);

            if (appointment) {
                form.date.value = appointment.date;
                form.dni.value = appointment.dni;
                form.name.value = appointment.name;
                form.lastname.value = appointment.lastname;
                form.phone.value = appointment.phone;
                form.birthdate.value = appointment.birthdate;
                form.notes.value = appointment.notes;
            }
        }
    });

    // Cargar citas al iniciar
    loadAppointments();
});