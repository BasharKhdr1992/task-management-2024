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

function formatDate(date) {
    const deadline = new Date(date);
    const year = deadline.getFullYear();
    const month = deadline.getMonth() + 1;
    const day = deadline.getDate();

    const _2digitYear = year.toString().substring(2);
    
    return `${day} ${monthsDict[month.toString()]}, ${_2digitYear}`
}

function appendNewTask (taskText, formattedDate, items) {
    var newTask = document.createElement('li');
    newTask.classList.add('list-item');
    newTask.classList.add('card')
    const title = document.createElement('h3');
    title.classList.add('task-title');
    title.innerText = taskText;
    const deadlineEl = document.createElement('small');
    deadlineEl.classList.add('deadline');
    deadlineEl.innerText = `Must be accomplished before ${formattedDate}`;
    newTask.appendChild(title);
    newTask.appendChild(deadlineEl);
    items.appendChild(newTask);
}

function setMinDate(dateInput) {
    var minDate = new Date(Date.now());

    const year = minDate.getFullYear(); // returns a 4-digit year
    const month = minDate.getMonth() + 1; // get the month / 0-indexed / + 1
    const day = minDate.getDate(); // get the day of the month
    dateInput.min = `${year}-0${month}-${day}`;
}

function clearTasks () {
    document.getElementById("tasks-list").innerHTML = "";
}

function submitInput() {

    var items = document.getElementById('tasks-list')

    var taskInput = document.getElementById('task-text');
    var taskText = taskInput.value;
    var deadline = deadlineInput.value;
    
    const formattedDate = formatDate(deadline);
    var errorMessage = document.getElementsByClassName('error-message')[0];
    if (taskText === null || taskText === '') {
        taskInput.classList.add('task-text-error');
        errorMessage.style.display = 'block';
    } else {
        appendNewTask(taskText, formattedDate, items);
        errorMessage.style.display = 'none';
        taskInput.classList.remove('task-text-error');
    }
}

window.addEventListener('beforeunload', function() {
    var tasks = [];
    var items = document.getElementsByTagName('li')
    for (let item of items) {
        var title = item.getElementsByClassName('task-title')[0].innerText;
        var deadline = item.getElementsByClassName('deadline')[0]
            .innerText
            .replace('Must be accomplished before ', '');
        tasks.push({
            title,
            deadline
        })
    }

    localStorage.setItem('tasks', JSON.stringify(tasks))
});

window.addEventListener('load', function() {

    var tasks = JSON.parse(this.localStorage.getItem('tasks'));

    if (tasks.length > 0) {
        var items = this.document.getElementById('tasks-list');
        for (let task of tasks) {
            appendNewTask(task.title, task.deadline, items)
        }
    }

    var deadlineInput = document.getElementById('task-deadline');
    setMinDate(deadlineInput)
    
    var buttonSubmit = document.getElementsByTagName('button')[0];
    var clearButton = document.getElementsByTagName('button')[1];
    buttonSubmit.addEventListener('click', submitInput);
    clearButton.addEventListener('click', clearTasks);

})
