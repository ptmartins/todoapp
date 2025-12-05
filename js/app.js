(function() {

    // ToDo: Add edit to each todo
    // ToDo: Add date/time when adding Todo and show it on each list item
    // ToDo: Show total of todos done on the app header
    // ToDo: Add 'sort' feature - by date added, by due date, etc...

    class ToDo {

        id;
        name;
        done;
        item;
        
        constructor(txt) {
            this.id = `todo_${new Date().getTime()}`;
            this.name = txt;
            this.done = false;
        }

        toggleDone () {
            this.item.classList.toggle('todo--done');
        }

        render() {
            this.item = document.createElement('LI');
            let title = document.createElement('DIV');
            let actions = document.createElement('DIV');
            let checkbox = document.createElement('LABEL');
            let checkboxInput = document.createElement('INPUT');
            let editEl = document.createElement('SPAN');
            let deleteEl = document.createElement('SPAN');

            this.item.className = `todo`;
            title.textContent = this.name;
            this.item.setAttribute('data-id', this.id);
            editEl.textContent = 'edit';
            deleteEl.textContent = 'delete';
            title.className = 'todo__title';
            actions.className = 'todo__actions';
            checkbox.className = 'todo__label';
            checkboxInput.className = 'todo__input';
            editEl.className = 'todo__edit material-symbols-outlined';
            deleteEl.className = 'todo__delete material-symbols-outlined';

            checkboxInput.setAttribute('type', 'checkbox');
            editEl.setAttribute('title', 'Edit task');
            deleteEl.setAttribute('title', 'Delete task');

            let modalObj = {
                title: 'Delete todo',
                content: 'Are you sure you want to delete the current ToDo?',
                actionBtnTxt: 'Delete',
                cbFn: () => {
                    let ev = new CustomEvent('deleteTodo', {
                        detail: this.id
                    });
                    window.dispatchEvent(ev);
                    modal.close();
                }
            }

            checkbox.appendChild(checkboxInput);

            checkbox.addEventListener('click', this.toggleDone.bind(this));
            deleteEl.addEventListener('click', () => {
                modal.render(modalObj);
            });

            actions.append(editEl, deleteEl);
            this.item.append(checkbox, title, actions);

            return(this.item);
        }
    }

    /**
     * DOM elements object
     */
    let DOM = {}

    /**
     * Array of ToDo's
     */
    let todos = null;

    /**
     * Cache DOM elements
     */
    let cacheDOM = () => {
        DOM.input = document.getElementById('todoInput');
        DOM.addBtn = document.getElementById('addBtn');
        DOM.todosList = document.getElementById('todosList');
        DOM.deleteAllTodos = document.getElementById('deleteAllTodos');
        DOM.dateTimeBtn = document.getElementById('dateTimeBtn');
    }

    /**
     * Setup event listeners
     */
    let setupEvents = () => {
        // Add todo on ENTER
        DOM.input.addEventListener('keydown', ev => {
            if(ev.key === 'Enter') {
                addTodo();
            }
        });

        // Add todo on Add button click
        DOM.addBtn.addEventListener('click', addTodo);

        DOM.dateTimeBtn.addEventListener('click', () => console.log('from datime'))

        // Delete todo
        window.addEventListener('deleteTodo', ev => {
            deleteToDo(ev.detail);
        });
    }

    /**
     * 
     */
    let renderList = () => {
        DOM.todosList.innerHTML = '';
        todos.forEach(todo => {
            let item = todo.render();
            DOM.todosList.appendChild(item);
        });
    }

    /**
     * Add a new todo item
     */
    let addTodo = () => {
        let todo;
        let txt = DOM.input.value; 
        if(txt !== ''){
            todo = new ToDo(txt);
            todos.push(todo);
            localStorage.setItem('todos', JSON.stringify(todos));
        }

        renderList();
        clearInput();
    }

    /**
     * Delete Todo
     */
    let deleteToDo = id => {
        let _index = null;
        todos.forEach((todo, index) => {
            if(todo.id === id) {
                _index = index;
                todos.splice(_index, 1); 
                localStorage.setItem('todos', JSON.stringify(todos));
            }
        });
        
        renderList();
    }

    /**
     * Clear input
     */
    let clearInput = () => {
        DOM.input.value = '';
    }

    /**
     * Quick-off logic
     */
    let init = () => {
        cacheDOM();
        if(localStorage.todos === undefined) {
            localStorage.setItem('todos', JSON.stringify([]));
            todos = [];
        } else {
            let savedTodos = JSON.parse(localStorage.getItem('todos'));
            // Recreate obj instances
            todos = savedTodos.map(savedTodo => {
                let todo = new ToDo(savedTodo.name);
                todo.id = savedTodo.id;
                todo.done = savedTodo.done;
                return todo;
            });
            renderList();
        }
        setupEvents();
    };

    window.addEventListener('DOMContentLoaded', init);
})();