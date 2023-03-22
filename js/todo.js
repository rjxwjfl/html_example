class TodoEvent {
    static #instance = null;
    static getInstance() {
        if (this.#instance == null) {
            this.#instance = new TodoEvent();
        }
        return this.#instance;
    }

    convertDay = (day) => {
        return day == 0 ? "일"
            : day == 1 ? "월"
                : day == 2 ? "화"
                    : day == 3 ? "수"
                        : day == 4 ? "목"
                            : day == 5 ? "금" : "토";
    }

    setCurrentDay(){
        const currentDay = document.querySelector(".current-day");
        const now = new Date();

        currentDay.innerHTML = `
            <div class="year-month-date">  
                ${now.getMonth() + 1}월 ${now.getDate()}일, ${now.getFullYear()}년
            </div>
            <div class="day">
                ${this.convertDay(now.getDay())}요일
            </div>
        `;
    }

    addEventTodoListAllShow() {
        const allButton = document.querySelector('.select-all');
        allButton.onclick = () => {
            TodoService.getInstance().loadTodoList();
        }
    }

    addEventTodoListSelectedInprogress() {
        const inprogressButton = document.querySelector('.select-progress');
        inprogressButton.onclick = () => {
            TodoService.getInstance().loadFilterTodoList('inprogress');

        }
    }

    addEventTodoListSelectedDone() {
        const doneButton = document.querySelector('.select-done');
        doneButton.onclick = () => {
            TodoService.getInstance().loadFilterTodoList('done');

        }
    }

    addEventShowTodoDtl() {
        const showTodoDtls = Array.from(document.querySelectorAll(".todo-context-title"));
        showTodoDtls.forEach((showTodoDtl, index) => {
            showTodoDtl.onclick = () => {
                ModalService.getInstance().showTodoContentWindow(index);
            }
        })
    }

    addEventAddTodoClick() {
        const addTodoButton = document.querySelector(".add-todo-list-button");
        addTodoButton.onclick = () => {
            console.log("has Clicked");
            ModalService.getInstance().showTodoAddWindow();
        }
    }

    addEventRemoveTodoClick() {
        const removeButtons = Array.from(document.querySelectorAll(".todo-delete-button"));
        removeButtons.forEach((removeButton, index) => {
            removeButton.onclick = () => {
                console.log("has clicked")
                TodoService.getInstance().todoList.splice(index, 1);
                TodoService.getInstance().updateLocalStorage();
            }
        });
    }
}

class TodoService {
    static #instance = null;
    static getInstance() {
        if (this.#instance == null) {
            this.#instance = new TodoService();
        }
        return this.#instance;
    }

    todoList = null;

    constructor() {
        if (localStorage.getItem("todoList") == null) {
            this.todoList = new Array();
        } else {
            this.todoList = JSON.parse(localStorage.getItem("todoList"));
        }
        this.loadTodoList();
    }

    updateLocalStorage() {
        localStorage.setItem("todoList", JSON.stringify(this.todoList));
        this.loadTodoList();
    }

    addTodo(todoObj) {
        this.todoList.push(todoObj);
        this.updateLocalStorage();
    }


    loadTodoList() {
        const todoContentList = document.querySelector(".todo-list ul");
        todoContentList.innerHTML = ``;
        this.todoList = this.todoList.sort((a, b) => {
            if (a.todoDateTime < b.todoDateTime) {
                return -1;
            }
        })

        if (this.todoList.length < 1){
            todoContentList.innerHTML += `
                ToDo 가 없습니다. 추가해주세요.
            `;
        } else {
            this.todoList.forEach(todoObj => {
                const time = new Date(todoObj.todoDateTime);


                todoContentList.innerHTML += `
                    
                    <li class="">
                        <span class="time-indicator">${time.getHours() < 10 ? "0" + time.getHours() : time.getHours()}:${time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes()}</span>
                        <span class="todo-context-title">${todoObj.todoTitle}</span> 
                        <div class="todo-list-state">
                            <span><i class="fa-solid fa-check ${todoObj.todoState == "done" ? "" : "hidden-icon"}"></i></span>
                            <span><i class="fa-solid fa-ellipsis ${todoObj.todoState == "done" ? "hidden-icon" : ""}"></i></span>
                            <button class="todo-delete-button"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </li>
                    
                    `;
            });
        }
        TodoEvent.getInstance().addEventShowTodoDtl();
        TodoEvent.getInstance().addEventRemoveTodoClick();
    }

    loadFilterTodoList(value) {
        const todoContentList = document.querySelector(".todo-list ul");
        todoContentList.innerHTML = ``;
        this.todoList = this.todoList.sort((a, b) => {
            if (a.todoDateTime < b.todoDateTime) {
                return -1;
            }
        });

        let hasVisibleTodo = false;

        this.todoList.forEach(todoObj => {
            const time = new Date(todoObj.todoDateTime);
            const isTodoHidden = todoObj.todoState != value;
            if (!isTodoHidden) {
                hasVisibleTodo = true;
            }
            todoContentList.innerHTML += `
            
            <li class=${isTodoHidden ? "hidden-list" : ""}>
                <span class="time-indicator">${time.getHours() < 10 ? "0" + time.getHours() : time.getHours()}:${time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes()}</span>
                <span class="todo-context-title">${todoObj.todoTitle}</span> 
                <div class="todo-list-state">
                    <span><i class="fa-solid fa-check ${todoObj.todoState == 'done' ? "" : "hidden-icon"}"></i></span>
                    <span><i class="fa-solid fa-ellipsis ${todoObj.todoState == 'done' ? "hidden-icon" : ""}"></i></span>
                    <button class="todo-delete-button"><i class="fa-solid fa-trash"></i></button>
                </div>
            </li>
            
            `;
        });

        if (!hasVisibleTodo) {
            todoContentList.innerHTML = '항목이 없습니다.';
        }
        TodoEvent.getInstance().addEventShowTodoDtl();
        TodoEvent.getInstance().addEventRemoveTodoClick();
    }
}
