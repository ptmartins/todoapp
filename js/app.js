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
            this.done = !this.done;

            let ev = new CustomEvent('changeDone', {
                detail: this
            })
            window.dispatchEvent(ev);
        }

        render() {
            this.item = document.createElement('LI');
            let title = document.createElement('DIV');
            let actions = document.createElement('DIV');
            let checkbox = document.createElement('LABEL');
            let checkboxInput = document.createElement('INPUT');
            let editEl = document.createElement('SPAN');
            let deleteEl = document.createElement('SPAN');

            this.item.className = `${this.done ? 'todo todo--done' : 'todo'}`;
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

            if(this.done) {
                checkboxInput.setAttribute('checked', true);
            } else {
                if(checkboxInput.hasAttribute('checked', true)) {
                    checkboxInput.setAttribute('checked', false);
                }
            }

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

            checkbox.addEventListener('click', () => {
                this.toggleDone();
            });
            
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
    let todos = [];

    /**
     * Cache DOM elements
     */
    let cacheDOM = () => {
        DOM.input = document.getElementById('todoInput');
        DOM.addBtn = document.getElementById('addBtn');
        DOM.todosList = document.getElementById('todosList');
        DOM.deleteAllTodos = document.getElementById('deleteAllTodos');
        DOM.dateTimeBtn = document.getElementById('dateTimeBtn');
        DOM.copyrightYear = document.getElementById('copyrightYear');
        DOM.totalDone = document.getElementById('totalDone');
    }

    let enableInputBtns = val => {
        if(val === true) {
            if(!DOM.dateTimeBtn.classList.contains('active')) {
                DOM.dateTimeBtn.classList.add('active');
            }
            if(!DOM.addBtn.classList.contains('active')) {
                DOM.addBtn.classList.add('active');
            }
        } else {
            if(DOM.dateTimeBtn.classList.contains('active')) {
                DOM.dateTimeBtn.classList.remove('active');
            }
            if(DOM.addBtn.classList.contains('active')) {
                DOM.addBtn.classList.remove('active');
            }
        }
    }

    /**
     * Delete all todos
     */
    let deleteAllTodos = () => {
        todos = [];
        localStorage.setItem('todos', '');
        renderList();
    }

    /**
     * Updates loclaStorage
     */
    let updateLocalStorage = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    /**
     * Updates total of ToDos done
     */
    let updateTotalDone = () => {
        let total = 0;

        todos.forEach(todo => {
            if(todo.done) {
                total++;
            }
        });

        DOM.totalDone.textContent = total;
    }

    /**
     * Setup event listeners
     */
    let setupEvents = () => {
        DOM.input.addEventListener('keydown', ev => {
            // Add todo on ENTER
            if(ev.key === 'Enter') {
                addTodo();
            }

            // Blur input when hiting Escape 
            if(ev.key === 'Escape') {
                DOM.input.blur();
            }
        });

        DOM.input.addEventListener('input', ev => {
            if(ev.target.value !== '') {
                enableInputBtns(true);
            } else {
                enableInputBtns(false);
            }
        });

        // Add todo on Add button click
        DOM.addBtn.addEventListener('click', addTodo);

        // ToDo: Add date/time
        DOM.dateTimeBtn.addEventListener('click', () => console.log('from datime'));

        // Clear todos
        DOM.deleteAllTodos.addEventListener('click', () => {
            let modalObj = {
                title: 'Delete all',
                content: 'Are you sure you wan tot delete all tasks? The action cannot be reverted.',
                actionBtnTxt: 'Delete all',
                cbFn: deleteAllTodos
            };
            modal.render(modalObj);
        });

        // Delete todo
        window.addEventListener('deleteTodo', ev => {
            deleteToDo(ev.detail);
        });
        
        window.addEventListener('changeDone', ev => {
            updateLocalStorage(); 
            updateTotalDone();
        })
    }

    /**
     * Renders list of todos
     */
    let renderList = () => {
        DOM.todosList.innerHTML = '';
        todos.forEach(todo => {
            let item = todo.render();
            DOM.todosList.appendChild(item);
        });

        if(todos.length > 0) {
            DOM.deleteAllTodos.classList.add('active');
        } else {
            if(DOM.deleteAllTodos.classList.contains('active')) {
                DOM.deleteAllTodos.classList.remove('active');
            }
        }

        updateTotalDone();
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
        enableInputBtns(false);
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
     * Sets footer copyright year
     */
    let setCopyrightYear = () => {
        let year = new Date().getFullYear();
        DOM.copyrightYear.textContent = year
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
            if(localStorage.todos !== '') {
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
        }
        setupEvents();
        setCopyrightYear();

        // Init flatpickr
        flatpickr("#dateTimeBtn", {
            enableTime: true,
            dateFormat: "Y-m-d H:i"
        });
    };

    window.addEventListener('DOMContentLoaded', init);
})();