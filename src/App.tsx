/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useRef,
  useState,
  Dispatch,
  SetStateAction,
} from 'react';
import { USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';
import cN from 'classnames';
import { TodoItem } from './components/TodoItem';
import { Filter } from './types/Filter';
import { Error } from './types/Error';
import { ErrorNotification } from './components/ErrorNotification';

function filterTodosByStatus(todos: Todo[], completedStatus: boolean | null) {
  if (completedStatus === null) {
    return todos;
  }

  return todos.filter(todo => todo.completed === completedStatus);
}

function removeTodoById(todos: Todo[], id: number) {
  return todos.filter(todo => todo.id !== id);
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Error | null>(null);
  const [activeFilter, setActiveFilter] = useState<Filter>(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoToDeleteIds, setTodoToDeleteIds] = useState<number[] | null>(null);

  const [inputText, setInputText] = useState<string>('');
  const [isDeletingTodo, setIsDeletingTodo] = useState<boolean>(false);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);

  const addTodoField = useRef<HTMLInputElement>(null);
  const errorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAllCompleted = !todos.some(todo => todo.completed === false);
  const hasCompleted = todos.some(todo => todo.completed === true);

  const activeCount: number = todos.reduce((acc, todo) => {
    if (todo.completed === false) {
      return acc + 1;
    }

    return acc;
  }, 0);
  const filterValues = Object.values(Filter);

  function ShowError(message: Error) {
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }

    setErrorMessage(message);
    errorTimeoutRef.current = setTimeout(() => setErrorMessage(null), 3000);
  }

  function changeStatus(
    id: number,
    todosState: Dispatch<SetStateAction<Todo[]>>,
  ) {
    todosState(prev => {
      return prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      );
    });
  }

  function handleTodoStatusChange(id: number) {
    changeStatus(id, setFilteredTodos);
    changeStatus(id, setTodos);
  }

  useEffect(() => {
    client
      .get<Todo[]>(`/todos?userId=${USER_ID}`)
      .then(fetchedTodos => {
        setTodos(fetchedTodos);
        setFilteredTodos(fetchedTodos);
        if (addTodoField.current !== null) {
          addTodoField.current.focus();
        }
      })
      .catch(() => ShowError(Error.LoadError));
  }, []);

  useEffect(() => {
    if (addTodoField.current !== null && tempTodo === null) {
      /*tempTodo === null для того, не виконувати це два рази (бо стейт tempTodo спочатку змінюється на об'єкт а потім змінюється на null)*/
      addTodoField.current.focus();
    }
  }, [tempTodo]);

  function handleFilter(filterParam: Filter) {
    let filter;

    if (filterParam === Filter.All) {
      filter = null;
    } else if (filterParam === Filter.Active) {
      filter = false;
    } else {
      filter = true;
    }

    setFilteredTodos(filterTodosByStatus(todos, filter));
    setActiveFilter(filterParam);
  }

  function handleAddTodoOnEnter(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = inputText.replace(/\s+/g, ' ').trim();

    if (title === '') {
      ShowError(Error.EmptyTitleError);
    } else {
      const newTodo = {
        id: 0,
        title: title,
        userId: USER_ID,
        completed: false,
      };

      setTempTodo(newTodo);

      client
        .post<Todo>(`/todos`, newTodo)
        .then(fetchedTodo => {
          setInputText('');
          setTodos(prevTodos => [...prevTodos, fetchedTodo]);
          setFilteredTodos(prevTodos => [...prevTodos, fetchedTodo]);
        })
        .catch(() => ShowError(Error.AddError))
        .finally(() => {
          setTempTodo(null);
        });
    }
  }

  function onDelete(id: number): Promise<void> {
    setIsDeletingTodo(true);

    return client
      .delete(`/todos/${id}`)
      .then(() => {
        setTodos(prevTodos => removeTodoById(prevTodos, id));
        setFilteredTodos(prevTodos => removeTodoById(prevTodos, id));
      })
      .catch(() => ShowError(Error.DeleteError))
      .finally(() => {
        setIsDeletingTodo(false);
      });
  }

  function handleClearCompleted() {
    const completedTodoIds = todos.reduce(
      (acc, todo) => (todo.completed ? [...acc, todo.id] : acc),
      [] as number[],
    );

    setTodoToDeleteIds(completedTodoIds);

    const promises: Promise<void>[] = [];

    completedTodoIds.forEach(id => {
      promises.push(onDelete(id));
    });

    Promise.all(promises).then(() => {
      //винести
      if (addTodoField.current !== null) {
        addTodoField.current.focus();
      }
    });
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed +++*/}
          <button
            type="button"
            className={cN('todoapp__toggle-all', { active: isAllCompleted })}
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit -*/}
          <form onSubmit={handleAddTodoOnEnter}>
            <input
              ref={addTodoField}
              data-cy="NewTodoField"
              type="text"
              value={inputText}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              onChange={event => setInputText(event.target.value)}
              disabled={tempTodo !== null}
            />
          </form>
        </header>
        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              handleTodoStatusChange={handleTodoStatusChange}
              onDelete={onDelete}
              isDeletingTodo={isDeletingTodo}
              todoToDeleteIds={todoToDeleteIds}
              setTodoToDeleteIds={setTodoToDeleteIds}
              addTodoField={addTodoField}
            />
          ))}
          {tempTodo !== null && (
            <TodoItem key={tempTodo.id} todo={tempTodo} isTemp={true} />
          )}
        </section>

        {false && (
          <section className="todoapp__main" data-cy="TodoList">
            {/* This is a completed todo +*/}
            <div data-cy="Todo" className="todo completed">
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                Completed Todo
              </span>

              {/* Remove button appears only on hover ок*/}
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
              >
                ×
              </button>

              {/* overlay will cover the todo while it is being deleted or updated ок*/}
              <div data-cy="TodoLoader" className="modal overlay">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>

            {/* This todo is an active todo +*/}
            <div data-cy="Todo" className="todo">
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                Not Completed Todo
              </span>
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
              >
                ×
              </button>

              <div data-cy="TodoLoader" className="modal overlay">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>

            {/* This todo is being edited -*/}
            <div data-cy="Todo" className="todo">
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                />
              </label>

              {/* This form is shown instead of the title and remove button -*/}
              <form>
                <input
                  data-cy="TodoTitleField"
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  value="Todo is being edited now"
                />
              </form>

              <div data-cy="TodoLoader" className="modal overlay">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>

            {/* This todo is in loadind state -*/}
            <div data-cy="Todo" className="todo">
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                Todo is being saved now
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
              >
                ×
              </button>

              {/* 'is-active' class puts this modal on top of the todo --- */}
              <div data-cy="TodoLoader" className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          </section>
        )}
        {/* Hide the footer if there are no todos +++*/}
        {todos.length !== 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeCount} items left
            </span>

            {/* Active link should have the 'selected' class +++*/}
            <nav className="filter" data-cy="Filter">
              {filterValues.map(filter => {
                return (
                  <a
                    key={filter}
                    href={`#/${filter === 'All' ? '' : filter}`}
                    className={cN('filter__link', {
                      selected: activeFilter === filter,
                    })}
                    data-cy={`FilterLink${filter}`}
                    onClick={() => handleFilter(filter)}
                  >
                    {filter}
                  </a>
                );
              })}
            </nav>

            {/* this button should be disabled if there are no completed todos +++*/}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!hasCompleted}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification +++*/}
      {/* Add the 'hidden' class to hide the message smoothly +++*/}
      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
