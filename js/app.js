window.onload = () => {
    TodoEvent.getInstance().setCurrentDay();
    TodoEvent.getInstance().addEventAddTodoClick();
    TodoEvent.getInstance().addEventTodoListAllShow();
    TodoEvent.getInstance().addEventTodoListSelectedInprogress();
    TodoEvent.getInstance().addEventTodoListSelectedDone();

    TodoService.getInstance();
}