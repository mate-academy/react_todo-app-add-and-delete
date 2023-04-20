/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import {
  addTodo,
  deleteTodo,
  getTodos,
} from './api/todos';
import { Todo } from './types/Todo';
import { ErrorMessage } from './components/ErrorMesage/ErrorMesage';
import { TodoForm } from './components/TodoForm/TodoForm';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { FilterType } from './types/FilterType';
import { USER_ID } from './utils/fetchClient';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [todoTitle, setTodoTitle] = useState('');
  const [
    currentFilter,
    setCurrentFilter,
  ] = useState<FilterType>(FilterType.All);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todosFromServer = await getTodos(USER_ID);

        setTodos(todosFromServer);
      } catch {
        setHasError(true);
        setErrorMessage('Unable to update a todo');
      }
    };

    fetchTodos();
  }, []);

  const addNewTodo = (title: string) => {
    if (!title) {
      setErrorMessage("Title can't be empty");
    }

    const newTodo = {
      userId: USER_ID,
      completed: false,
      title,
    };

    return addTodo(USER_ID, newTodo)
      .then((todo: Todo[]) => {
        setTodos((prevTodos) => {
          return prevTodos.concat(todo);
        });
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo!');
      });
  };

  const removeTodo = (id: number) => {
    deleteTodo(id)
      .then(() => {
        const newTodosList = todos.filter(todo => todo.id !== id);

        setTodos(newTodosList);
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      });
  };

  const filteredTodos: Todo[] = useMemo(() => {
    return todos.filter((todo) => {
      switch (currentFilter) {
        case FilterType.Active:
          return !todo.completed;
        case FilterType.Completed:
          return todo.completed;
        default:
          return true;
      }
    });
  }, [todos, currentFilter]);

  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {activeTodos.length > 0
            && (
              <button type="button" className="todoapp__toggle-all active" />
            )}

          <TodoForm
            setTodoTitle={setTodoTitle}
            todoTitle={todoTitle}
            onAdd={addNewTodo}
          />
        </header>

        <section className="todoapp__main">
          <TodoList todos={filteredTodos} onDelete={removeTodo} />
        </section>

        {todos.length > 0
          && (
            <footer className="todoapp__footer">
              <span className="todo-count">
                {`${todos.length} items left`}
              </span>

              <TodoFilter
                onChangeFilter={setCurrentFilter}
                currentFilter={currentFilter}
              />

              <button
                type="button"
                className="todoapp__clear-completed"
                style={{
                  opacity: completedTodos.length > 0 ? 1 : 0,
                }}
              >
                Clear completed
              </button>
            </footer>
          )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        hasError={hasError}
        setHasError={setHasError}
      />
    </div>
  );
};
