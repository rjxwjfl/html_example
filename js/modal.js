class ModalEvent {
    static #instance = null;
    static getInstance() {
        if (this.#instance == null) {
            this.#instance = new ModalEvent();
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

    addEventCancelClick() {
        const modalCancelButton = document.querySelector(".modal-cancel-button");
        modalCancelButton.onclick = () => {
            ModalService.getInstance().closeWindow();
        }
    }

    addEventClickToAdd() {
        const modalAddButton = document.querySelector(".modal-submit-button");
        const todoTitleView = document.querySelector(".todo-title-view");
        const todoContentView = document.querySelector(".todo-content-view");
        const todoTime = document.querySelector(".todo-time");
        const todoState = document.getElementById("done");
        const now = new Date();

        const setTodoDateTime = (dateTime) => {
            todoObj.todoDateTime = dateTime;
        }

        todoTime.addEventListener("change", (event) => {
            const selectedTime = event.target.value;
            const timeParts = selectedTime.split(":");
            const selectedDate = + new Date(now.getFullYear(), now.getMonth(), now.getDate());
            setTodoDateTime(selectedDate + (timeParts[0]) * 3600000 + timeParts[1] * 60000);
        });

        const todoObj = {
            
            todoDateTime: setTodoDateTime.length < 2 ? + new Date() : setTodoDateTime,
            todoTitle: null,
            todoContent: null,
            todoState: null,
            todoCompleteAt: null
        }

        modalAddButton.onclick = () => {

            todoObj.todoTitle = todoTitleView.value;
            todoObj.todoContent = todoContentView.value;
            todoObj.todoState = todoState.checked ? "done" : "inprogress";

            console.log(todoObj);

            TodoService.getInstance().addTodo(todoObj);
            ModalService.getInstance().closeWindow();
        }
    }



    addEventClickToModify() {
        const modalModifyButton = document.querySelector(".modal-modify-button");
        const modalApplyButton = document.querySelector(".modal-submit-button");
        modalModifyButton.onclick = () => {
            console.log("Clicked");
            modalModifyButton.disabled = true;
            modalApplyButton.disabled = false;
            document.querySelector(".todo-title-view").readOnly = false;
            document.querySelector(".todo-content-view").readOnly = false;
            document.querySelector("#done").disabled = false;
            document.querySelector(".todo-time input").disabled = false;
        }
    }

    addEventClickToModifyApply(index) {
        const modalModifyButton = document.querySelector(".modal-modify-button");
        const modalApplyButton = document.querySelector(".modal-submit-button");
        const title = document.querySelector(".todo-title-view");
        const content = document.querySelector(".todo-content-view");
        const time = document.querySelector(".todo-time input");
        const state = document.querySelector("#done");
        const now = new Date();
        const pastTodo = TodoService.getInstance().todoList[index];

        const setTodoDateTime = (dateTime) => {
            pastTodo.todoDateTime = dateTime;
        }

        time.addEventListener("change", (event) => {
            const selectedTime = event.target.value;
            const timeParts = selectedTime.split(":");
            const selectedDate = + new Date(now.getFullYear(), now.getMonth(), now.getDate());
            console.log(selectedDate);
            console.log(timeParts[0]);
            console.log(timeParts[1]);
            setTodoDateTime(selectedDate + (timeParts[0]) * 3600000 + timeParts[1] * 60000);
        });

        
        pastTodo.todoDateTime = setTodoDateTime.length < 2 ? + pastTodo.todoDateTime : setTodoDateTime;

        modalApplyButton.onclick = () => {
            console.log("has clicked");
            modalModifyButton.disabled = false;
            modalApplyButton.disabled = true;
            title.readOnly = true;
            content.readOnly = true;
            time.disabled = true;
            state.disabled = true;

            pastTodo.todoState = state.checked
                ? (pastTodo.todoDateTime > now.getTime()
                    ? "inprogress"
                    : "done")
                : "inprogress";
            pastTodo.todoCompleteAt = state.checked
                ? (pastTodo.todoDateTime > now.getTime()
                    ? null
                    : now.getTime())
                : null;

            TodoService.getInstance().updateLocalStorage();
            ModalService.getInstance().closeWindow();
        }
    }
}


class ModalService {
    static #instance = null;
    static getInstance() {
        if (this.#instance == null) {
            this.#instance = new ModalService();
        }
        return this.#instance;
    }


    showTodoAddWindow() {
        const modalSection = document.querySelector(".todo-modal-container");
        const now = new Date();
        modalSection.innerHTML = `
                <div class="todo-time">
                    <input type="time" id="picker" value="${now.getHours() < 10 ? "0" + now.getHours() : now.getHours()}:${now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes()}">
                </div>
                <div class="todo-modal-content">
                    <div class="todo-title-container">
                        <div class="todo-title">
                            <textarea class="todo-title-view" placeholder="제목을 입력하세요."></textarea>
                        </div>
                        <div class="now">
                            <i class="fa-solid fa-check hidden-icon"></i>
                            <i class="fa-solid fa-ellipsis "></i>
                        </div>
                        
                    </div>
                    <div class="todo-content">
                        <textarea class="todo-content-view" placeholder="내용을 입력하세요."></textarea>
                        <div class="state-check-list">
                            <label for="done">done</label>
                            <input id="done" type="checkbox" value="done" disabled>
                        </div>
                    </div>
                    <footer class="todo-submit-buttons">
                        <button class="modal-submit-button">submit</button>
                        <button class="modal-cancel-button">확인</button>
                    </footer>
                </div>
        `;

        ModalEvent.getInstance().addEventClickToAdd();
        ModalEvent.getInstance().addEventCancelClick();
        this.showWindow();
    }

    showTodoContentWindow(index) {
        const modalSection = document.querySelector(".todo-modal-container");
        const selectedItem = TodoService.getInstance().todoList[index];
        console.log(selectedItem.todoDateTime);
        const time = new Date(selectedItem.todoDateTime);
        const completeAt = selectedItem.todoCompleteAt != null? new Date(selectedItem.todoCompleteAt) : null;
        modalSection.innerHTML = `
                <div class="todo-time">
                    <label for="picker">시작 시간</label>
                    <input type="time" id="picker" value="${time.getHours() < 10 ? "0" + time.getHours() : time.getHours()}:${time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes()}" disabled="true">
                    ${completeAt != null ? `<label for="complete">완료 시간</label>`:""}
                    ${completeAt != null ? `<input type="time" id="complete"  value="${completeAt.getHours() < 10 ? "0" + completeAt.getHours() : completeAt.getHours()}:${completeAt.getMinutes() < 10 ? "0" + completeAt.getMinutes() : completeAt.getMinutes()}" disabled>` : ''}
                </div>
                <div class="todo-modal-content">
                    <div class="todo-title-container">
                        <div class="todo-title">
                            <textarea class="todo-title-view" readOnly>${selectedItem.todoTitle}</textarea>
                        </div>
                        <div class="now">
                            <i class="fa-solid fa-check ${selectedItem.todoState == "done" ? "" : "hidden-icon"}"></i>
                            <i class="fa-solid fa-ellipsis ${selectedItem.todoState == "done" ? "hidden-icon" : ""}"></i>
                        </div>
                        
                    </div>
                    <div class="todo-content">
                        <textarea class="todo-content-view" readOnly>${selectedItem.todoContent}</textarea>
                        <div class="state-check-list">
                            <label for="done">done</label>
                            <input id="done" type="checkbox" value="done" ${selectedItem.todoState == "done" ? "checked" : ""} disabled>
                        </div>
                    </div>
                    <footer class="todo-submit-buttons">
                        <button class="modal-modify-button"  ${selectedItem.todoState == "done" ? "disabled" : ""}>편집</button>
                        <button class="modal-submit-button" disabled>저장</button>
                        <button class="modal-cancel-button">뒤로</button>
                    </footer>
                </div>
        `;

        ModalEvent.getInstance().addEventClickToModify();
        ModalEvent.getInstance().addEventClickToModifyApply(index);
        ModalEvent.getInstance().addEventCancelClick();
        this.showWindow();
    }


    showWindow() {
        const modalContainer = document.querySelector(".todo-modal-container");
        modalContainer.classList.remove("hidden-modal");
    }

    closeWindow() {
        const modalContainer = document.querySelector(".todo-modal-container");
        modalContainer.classList.add("hidden-modal");
    }
}