/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { getTodos, deleteTodo, createTodo, updateTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodoRow } from './components/toDoRow';
import { Header } from './components/Header';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [, /*errorMessage*/ setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const errorTimerId = useRef(0);

  const showErorr = (massage: string) => {
    setErrorMessage(massage);
    window.clearTimeout(errorTimerId.current);
    errorTimerId.current = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    return () => {
      window.clearTimeout(errorTimerId.current);
    };
  }, []);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => showErorr('Unable to load todos'));
  }, []);

  const deleteTodos = (todoId: number) => {
    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(error => {
        showErorr('Unable to delete a todo');
        throw error;
      });
  };

  const renameTodo = (todoToUpdate: Todo, newTitle: string) => {
    return updateTodo({ ...todoToUpdate, title: newTitle })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(error => {
        showErorr('Unable to rename a todo');
        throw error;
      });
  };

  const addTodo = (title: string) => {
    if (title === '') {
      showErorr('Title should not be empty');

      return;
    }

    if (tempTodo !== null) {
      return;
    }

    setTempTodo({
      id: 0,
      completed: false,
      title,
      userId: 11,
    });

    createTodo(title)
      .then(todo => {
        setTodos(currentTodos => [...currentTodos, todo]);
      })
      .catch(error => {
        showErorr('Unable to create a todo');
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const toggleTodo = (todoToUpdate: Todo): Promise<void> => {
    return updateTodo({
      ...todoToUpdate,
      completed: !todoToUpdate.completed,
    })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(error => {
        showErorr('Unable to toggle a todo');
        throw error;
      });
  };

  const toggleAllTodos = () => {};

  let todoToShow = todos;

  if (tempTodo != null) {
    todoToShow = [...todos, tempTodo];
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header onAdd={addTodo} toggleAllTodos={toggleAllTodos} todos={todos} />

        <section className="todoapp__main" data-cy="TodoList">
          {todoToShow.map((todo: Todo) => (
            <TodoRow
              todo={todo}
              onDelete={() => deleteTodos(todo.id)}
              onToggle={() => toggleTodo(todo)}
              onRename={title => renameTodo(todo, title)}
              key={todo.id}
            />
          ))}
        </section>

        {/* Hide the footer if there are no todos */}
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            3 items left
          </span>

          {/* Active link should have the 'selected' class */}
          <nav className="filter" data-cy="Filter">
            <a
              href="#/"
              className="filter__link selected"
              data-cy="FilterLinkAll"
            >
              All
            </a>

            <a
              href="#/active"
              className="filter__link"
              data-cy="FilterLinkActive"
            >
              Active
            </a>

            <a
              href="#/completed"
              className="filter__link"
              data-cy="FilterLinkCompleted"
            >
              Completed
            </a>
          </nav>

          {/* this button should be disabled if there are no completed todos */}
          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
          >
            Clear completed
          </button>
        </footer>
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className="notification is-danger is-light has-text-weight-normal"
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {/* show only one message at a time */}
        Unable to load todos
        <br />
        Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo
      </div>
    </div>
  );
};
