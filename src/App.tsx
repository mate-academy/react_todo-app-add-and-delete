import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoItem } from './components/TodoItem';

type Status = 'All' | 'Active' | 'Completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);

  let filteredTodos: Todo[] = [];
  let todosLeft = 0;

  const [selected, setSelected] = useState<Status>('All');
  const [inputTodoTitle, setInputTodoTitle] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    inputRef.current?.focus();

    getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  function handleAddTodo(event: FormEvent) {
    event.preventDefault();

    const trimmedTitle = inputTodoTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return;
    }

    if (inputRef.current) {
      inputRef.current.disabled = true;
    }

    const newTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
    });

    setLoadingTodos(current => [...current, 0]);

    addTodo(newTodo)
      .then(newTodoFromServer => {
        setTodos(currentTodos => [...currentTodos, newTodoFromServer]);
        setInputTodoTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        if (inputRef.current) {
          inputRef.current.disabled = false;
          inputRef.current.focus();
        }

        setTempTodo(null);
        setLoadingTodos(current => current.filter(todoId => todoId !== 0));
      });
  }

  function handleDeleteTodo(todoId: number) {
    setLoadingTodos(current => [...current, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setLoadingTodos(current =>
          current.filter(deletingTodoId => deletingTodoId !== todoId),
        );
        if (inputRef.current) {
          inputRef.current.disabled = false;
          inputRef.current.focus();
        }
      });
  }

  function handleDeleteAllCompleted() {
    const completedTodosIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    completedTodosIds.forEach(todoId => handleDeleteTodo(todoId));
  }

  function handleFilterSelected(selectedType: Status) {
    setSelected(selectedType);
  }

  switch (selected) {
    case 'Active':
      filteredTodos = todos.filter(todo => !todo.completed);
      break;
    case 'Completed':
      filteredTodos = todos.filter(todo => todo.completed);
      break;
    default:
      filteredTodos = [...todos];
  }

  todosLeft = todos.filter(todo => !todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />
          {/* Add a todo on form submit */}
          <form onSubmit={handleAddTodo}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={inputTodoTitle}
              onChange={event => setInputTodoTitle(event.target.value)}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoItem
              todo={todo}
              onDelete={handleDeleteTodo}
              isLoading={loadingTodos.includes(todo.id)}
              key={todo.id}
            />
          ))}

          {tempTodo && (
            <TodoItem
              todo={tempTodo}
              onDelete={() => {}}
              isLoading={loadingTodos.includes(0)}
            />
          )}
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length !== 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todosLeft} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${selected === 'All' && 'selected'}`}
                data-cy="FilterLinkAll"
                onClick={() => handleFilterSelected('All')}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${selected === 'Active' && 'selected'}`}
                data-cy="FilterLinkActive"
                onClick={() => handleFilterSelected('Active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${selected === 'Completed' && 'selected'}`}
                data-cy="FilterLinkCompleted"
                onClick={() => handleFilterSelected('Completed')}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={() => handleDeleteAllCompleted()}
              disabled={todos.length - todosLeft === 0}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-wheght-normal ${!errorMessage && 'hidden'}`}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </div>
  );
};
