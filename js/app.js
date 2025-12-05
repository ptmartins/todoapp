(function() {

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
            let checkbox = document.createElement('INPUT');
            let deleteEl = document.createElement('SPAN');

            this.item.className = `todo`;
            this.item.textContent = this.name;
            this.item.setAttribute('data-id', this.id);
            deleteEl.textContent = 'delete'
            checkbox.className = 'check';
            deleteEl.className = 'delete';
            checkbox.setAttribute('type', 'checkbox');

            checkbox.addEventListener('click', this.toggleDone.bind(this));
            deleteEl.addEventListener('click', () => {
                let ev = new CustomEvent('deleteTodo', {
                    detail: this.id
                });
                window.dispatchEvent(ev);
            });

            this.item.append(checkbox, deleteEl);

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
    }

    /**
     * Setup event listeners
     */
    let setupEvents = () => {
        DOM.input.addEventListener('keydown', ev => {
            if(ev.key === 'Enter') {
                addTodo();
            }
        });
        DOM.addBtn.addEventListener('click', addTodo);
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