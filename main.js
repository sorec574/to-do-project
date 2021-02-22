// Tasks
var tasks = localStorage.getItem('tasks') ? tasks = JSON.parse(localStorage.getItem('tasks')) : [];

// Categories object
var categories = {
    Education: {
        Class: '',
        Professor: ''
    },
    Grocery: {
        Store: ''
    },
    Sports: {
        Location: '',
        Coach: ''
    }
}

// Form mode - adding tasks or editing a task
var edit_mode = {
    active: false,
    index: '',
    // Show form to edit a task
    show_form: function(index){
        this.active = true;
        this.index = index;

        let task = tasks[index]


        document.querySelector('#name').value = task.name
        document.querySelector('#description').value = task.description
        document.querySelector('#date').value = task.date
        document.querySelector('#urgent').checked = task.urgent
        document.querySelector('#category').value = task.category_name
        document.querySelector('#order').value = task.order
        document.querySelector('#order').setAttribute('max', tasks.length)
        document.querySelector('#order_number').innerText = document.querySelector('#order').value

        $('#charts').fadeOut()

        $("#date").datepicker().datepicker("setDate", task.date); //jQuery UI Datepicker

        $('#display_tasks').fadeOut()
        $('#add_a_task_form').fadeIn(700)

        document.querySelector('#show_form').innerText = 'Show Tasks'

        document.querySelector('#add_task').innerText = 'Save Changes'

        // Set categories
        let category = document.querySelector('#category')
        category.innerHTML = '';

        for (let key of Object.keys(categories)) {
            category.innerHTML += `<option value="${key}">${key}</option>`
        }

        category.value = task.category_name

        // Show dynamic options for selected category when showing the form
        render_category_options(task.category_options)

        // When category is changed, show dynamic options 
        category.onchange = () => render_category_options(task.category_options)

    }
}

// Update order number
document.querySelector('#order').oninput = function () {
    document.querySelector('#order_number').innerText = document.querySelector('#order').value
}

// Render and display tasks
function render_tasks() {


    // Save tasks array to localStorage
    tasks.length > 0 ? localStorage.setItem('tasks', JSON.stringify(tasks)) : localStorage.setItem('tasks', '[]')

    if (tasks.length > 0) {

        let element = ''
        tasks.forEach(function (task, index) {

            element += `
                    <li>
                        <span>
                            ${index + 1}. ${task.name} 
                            <small class="${task.category_name}"> <em> ${task.category_name} </em> </small>
                        </span>
                        <span>
                            <button class="edit_btn" onclick="edit_mode.show_form(${index})">Edit</button>
                            <button class="view_btn" onclick="view_task(${index})">View</button>
                            <button class="delete_btn" onclick="delete_task(${index})">Delete</button>
                        </span>
                    </li>
                
                `
        })

        document.querySelector('#tasks').innerHTML = element;

        // Draw the charts
        $('#charts').fadeIn()
        setTimeout(() => {
            drawCharts()
        }, 800)



    } else {
        document.querySelector('#tasks').innerHTML = "<p>There are no tasks yet... </p>"

        $('#charts').fadeOut()
    }

    // Init jQuery UI buttons
    $('button').button()
}

// Dynamically change inputs depending on the selected category
function render_category_options(category_option_values) {
    let category_options = document.querySelector('#category_options')
    category_options.innerHTML = '';

    for (let key of Object.keys(categories[category.value])) {

        category_options.innerHTML += `
                    <label for ="category${key}" > ${key}: </label>
                    <input id="category${key}" type="text" value="${category_option_values && category_option_values[key] ? category_option_values[key] : ''}">
                `
    }
}

// Show add a task form
document.querySelector('#show_form').onclick = function () {

    edit_mode.active = false;

    if (document.querySelector('#display_tasks').style.display == '' || document.querySelector('#display_tasks').style.display == 'block') {
        $('#display_tasks').fadeOut()
        $('#add_a_task_form').fadeIn(700)
        $('#charts').fadeOut()

        document.querySelector('#show_form').innerText = 'Show Tasks'

        document.querySelector('#name').value = ''
        document.querySelector('#description').value = ''
        document.querySelector('#urgent').checked = false

        // Set max length of a task's order
        document.querySelector('#order').setAttribute('max', tasks.length + 1)
        document.querySelector('#order').value = tasks.length + 1
        document.querySelector('#order_number').innerText = document.querySelector('#order').value

        // Set current date as default when adding a new task - init jQuery UI datepicker
        $("#date").datepicker().datepicker("setDate", new Date());


        document.querySelector('#add_task').innerText = 'Add Task'

        // Set categories
        let category = document.querySelector('#category')
        category.innerHTML = '';

        for (let key of Object.keys(categories)) {
            category.innerHTML += `<option value="${key}">${key}</option>`
        }

        // Show dynamic options for selected category when showing the form
        render_category_options()

        // When category is changed, show dynamic options 
        category.onchange = () => render_category_options()

    } else {
        hide_add_a_task_form()
    }

}


// Hide add a task form 
function hide_add_a_task_form() {

    $('#add_a_task_form').fadeOut()
    setTimeout(() => {
        $('#display_tasks, #charts').fadeIn(500)
    }, 500);

    document.querySelector('#empty_inputs_error').style.display = 'none'
    document.querySelector('#show_form').innerText = 'Add A Task'
}
// Hide add a task form on cancel button
document.querySelector('#hide_add_a_task_form').onclick = function () {
    hide_add_a_task_form()
}

// Add a new task
document.querySelector('#add_task').onclick = function () {

    let name = document.querySelector('#name')
    let description = document.querySelector('#description')
    let date = document.querySelector('#date')
    let urgent = document.querySelector('#urgent')
    let order = document.querySelector('#order')
    let category_options = document.querySelectorAll('#category_options input')

    // Function to validate 'dynamic' category inputs
    function validate_category_inputs() {
        let empty = false;
        category_options.forEach(e => {
            if (!e.value) {
                empty = true;
            }
        })
        return empty;
    }

    // Save task if all inputs are filled - add a new task or edit an existing task
    if (name.value && description.value && date.value && order.value && !validate_category_inputs()) {

        let selected_category = document.querySelector('#category').value

        var task = {}

        task.name = name.value;
        task.description = description.value;
        task.date = date.value;
        task.urgent = urgent.checked;
        task.order = order.value;
        task.category_name = selected_category;


        // Declare prototype 
        task.category_options = Object.create(categories[selected_category])


        // Save the category's dynamic inputs to the object
        for (let key of Object.keys(categories[selected_category])) {
            task.category_options[key] = document.querySelector(`#category${key}`).value;
        }


        // Add a new task
        if (!edit_mode.active) {
            tasks.splice(order.value - 1, 0, task)
        }
        // Edit a task
        else {
            tasks.splice(edit_mode.index, 1)
            tasks.splice(order.value - 1, 0, task)
        }

        // Clear all inputs
        name.value = '';
        description.value = '';
        urgent.checked = false;
        category.value = '';
        order.value = '';

        // Render and show all tasks
        render_tasks()

        // Hide add a new task - form
        hide_add_a_task_form();
    }
    // Show error if there are empty inputs
    else {
        document.querySelector('#empty_inputs_error').style.display = 'block'
    }

}


// View a task
function view_task(index) {

    document.querySelector('#display_tasks').style.display = 'none';
    document.querySelector('#display_task').classList.add('display_task');
    document.querySelector('#quick_action_buttons').style.display = 'none';

    $('#charts').fadeOut()

    let task = tasks[index];

    document.querySelector('#display_task').innerHTML = `
        <em >${task.date}</em>
        <h1>${task.name}</h1>
        <small class="${task.urgent ? 'urgent' : 'not_urgent'}">${task.urgent ? 'Urgent' : 'Not Urgent'}</small>
        <p class="${task.category_name}">${task.category_name}</p>
        <div id="addtional_information"></div>
        <hr>
        <p> ${task.description} </p>

        <button onclick="hide_the_task()" id="close_task_view">Close</button>
    `

    for (let key of Object.keys(task.category_options)) {
        document.querySelector('#addtional_information').innerHTML += `
            <p> <strong>${key} : </strong> ${task.category_options[key]} </p> 
        `
    }

}

// Hide the currently visible task
function hide_the_task() {
    document.querySelector('#display_tasks').style.display = 'block';
    document.querySelector('#display_task').classList.remove('display_task');
    document.querySelector('#quick_action_buttons').style.display = 'flex';

    $('#charts').fadeIn()
}

// Delete a task
function delete_task(index) {

    setTimeout(() => {

        $($('#tasks li')[index]).addClass('slideLeftDelete')

        tasks.splice(index, 1)

        // Timeout to finish delete animation before rendering
        setTimeout(() => {
            render_tasks();
        }, 1200)

    }, 400)


}

// Delete all tasks
function delete_all_tasks() {
    tasks = [];
    render_tasks()
}

// Show / hide all tasks
function hide_all_tasks(hide) {
    if (hide) {
        $('#hide_tasks_overlay').css('display', 'flex').hide().fadeIn(600)
    } else {
        $('#hide_tasks_overlay').fadeOut(600)
    }
}



document.addEventListener("DOMContentLoaded", function (event) {

    render_tasks();

    // Init jQuery UI's sortable interaction to enable drag & drop sorting
    let oldIndex, newIndex;

    $('#tasks').sortable({

        start: function (event, ui) {
            oldIndex = ui.item.index()
        },
        update: function (event, ui) {
            newIndex = ui.item.index()
        },
        stop: function (event, ui) {

            // When user changes the order of the list visually, change the 'tasks' array's order
            tasks[oldIndex].order = newIndex + 1;
            let tempTask = tasks[oldIndex]
            tasks.splice(oldIndex, 1)
            tasks.splice(newIndex, 0, tempTask)

            render_tasks()
        }

    })

});
