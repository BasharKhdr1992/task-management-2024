const monthsDict = {
    "1": 'Jan',
    "2": "Feb",
    "3": "Mar",
    "4": "Apr",
    "5": "May",
    "6": "Jun",
    "7": "Jul",
    "8": "Aug",
    "9": "Sep",
    "10": "Oct",
    "11": "Nov",
    "12": "Dec"
}

function getUpcomingTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    if (tasks === null || tasks.length === 0) {

        let message = document.createElement('p');
        message.innerText = 'There are no upcoming Tasks for you at the time being...';
        message.style.color = 'red';
        message.style.textAlign = 'center';
        let headerNode = document.getElementById('upcoming-title');
        headerNode.after(message);
    } else {
        let dateArray = getCurrentDayMonthYear(); // [day, month, year]
        const upcomingTasks = []
        for (let task of tasks) {
            const dateParts = task.deadline.split(' ');

            let day = +dateParts[0];
            let month = dateParts[1].replace(',', '');
            let year = dateParts[2];
            if (month !== monthsDict[dateArray[1]] || year !== dateArray[2].toString().substring(2)) continue;

            if (Math.abs(dateArray[0] - day) <= 7) upcomingTasks.push(task)
        }
        let message = document.createElement('p');
        message.innerText = `You have ${upcomingTasks.length.toString()} for this week`

        const upcomingList = document.getElementById('upcoming-list');

        for(let task of upcomingTasks) {
            appendNewTask(task, upcomingList)
        }
    }
}

function getCurrentDayMonthYear() {
    var today = new Date(Date.now());

    const year = today.getFullYear(); // returns a 4-digit year
    let month = today.getMonth() + 1; // get the month / 0-indexed / + 1
    let day = today.getDate(); // get the day of the month
    return [day, month, year]
}

function formatDate(date) {
    const deadline = new Date(date);
    const year = deadline.getFullYear();
    const month = deadline.getMonth() + 1;
    const day = deadline.getDate();

    const _2digitYear = year.toString().substring(2);
    
    return `${day} ${monthsDict[month.toString()]}, ${_2digitYear}`
}

function appendNewTask (task, items, isNewTask=true) {

    var newTask = document.createElement('li');
    newTask.classList.add('list-item');
    newTask.classList.add('card');
    newTask.classList.add('incomplete');
    const title = document.createElement('h3');
    title.classList.add('task-title');
    title.innerText = task.title;
    const deadlineEl = document.createElement('small');
    const idField = document.createElement('input');
    idField.type = 'hidden';
    idField.value = task.id;
    deadlineEl.classList.add('deadline');
    deadlineEl.innerText = `Must be accomplished before ${task.deadline}`;

    newTask.appendChild(idField);
    newTask.appendChild(title);
    newTask.appendChild(deadlineEl);
    items.appendChild(newTask);
}

function setMinDate() {

    var deadlineInput = document.getElementById('task-deadline');

    let dateArray = getCurrentDayMonthYear();

    let day = dateArray[0];
    let month = dateArray[1];
    let year = dateArray[2];

    if (month < 10) {
        month = `0${month}`
    }

    if (day < 10 ) {
        day = `0${day}`
    }
    deadlineInput.min = `${year}-${month}-${day}`;

    delete deadlineInput;
    delete minDate;
}

function clearTasks () {
    document.getElementById("tasks-list").innerHTML = "";
    document.getElementById('upcoming-list').innerHTML = "";
}

function submitInput() {

    let validationErrors = {};
    var items = document.getElementById('tasks-list')
    var deadlineInput = document.getElementById('task-deadline');

    var taskInput = document.getElementById('task-text');
    var taskText = taskInput.value;
    var taskDeadline = deadlineInput.value;
    
    const formattedDate = formatDate(taskDeadline);
    var errorMessage = document.getElementsByClassName('error-message')[0];
    if (taskDeadline === '' || taskDeadline === null) {
        deadlineInput.classList.add('input-error');
        validationErrors['taskDeadline'] = 1;
    } else {
        delete validationErrors['taskDeadline'];
    }
    if (taskText === null || taskText === '') {
        taskInput.classList.add('input-error');
        errorMessage.style.display = 'block';
        validationErrors['taskText'] = 1;
    } else {
        delete validationErrors['taskText'];
    }

    if (Object.keys(validationErrors).length === 0) {
        appendNewTask(
            {id: generateId().toString(),title: taskText, deadline: formattedDate}, items);
        errorMessage.style.display = 'none';
        taskInput.classList.remove('input-error');
        deadlineInput.classList.remove('input-error');
    }
}

function generateId() {
    return Math.floor(Math.random() * 100000001)
}

window.addEventListener('beforeunload', function() {
    var tasks = [];
    var items = document.getElementById('tasks-list').children;
    for (let item of items) {
        var id = item.getElementsByTagName('input')[0].value;
        var title = item.getElementsByClassName('task-title')[0].innerText;
        var deadline = item.getElementsByClassName('deadline')[0]
            .innerText
            .replace('Must be accomplished before ', '');
        tasks.push({
            id,
            title,
            deadline
        })
    }

    localStorage.setItem('tasks', JSON.stringify(tasks))
});

window.addEventListener('load', function() {

        setMinDate();

        getUpcomingTasks();
    
        var tasks = JSON.parse(this.localStorage.getItem('tasks'));
    
        if (tasks.length > 0) {
            var items = this.document.getElementById('tasks-list');
            for (let task of tasks) {
                appendNewTask(task, items, isNewTask = false)
            }
        }
    
    var buttonSubmit = document.getElementsByTagName('button')[0];
    var clearButton = document.getElementsByTagName('button')[1];
    buttonSubmit.addEventListener('click', submitInput);
    clearButton.addEventListener('click', clearTasks);

})
