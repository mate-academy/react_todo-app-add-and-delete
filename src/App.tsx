/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo,
  deleteTodo,
  getTodos,
} from './api/todos';
import { Todo } from './types/Todo';
import { ErrorMessage } from './components/ErrorMesage/ErrorMesage';
import { FormTodo } from './components/FormTodo/FormTodo';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFilter } from './components/TodoFilter/TodoFilter';

const USER_ID = 6926;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [hasError, setHasError] = useState(false);
  const [errorMesage, setErrorMessage] = useState('');
  const [todoTitle, setTodoTitle] = useState('');
  const [filteredTodos, setFilteredTodos] = useState<Todo[] | null>(null);

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
    if (!title.length) {
      setErrorMessage("Title can't be empty");
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      completed: false,
      title,
    };

    return addTodo(USER_ID, newTodo)
      .then((todo: Todo[]) => {
        setTodos((prevTodos) => {
          return prevTodos?.concat(todo) || null;
        });
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo!');
      });
  };

  const removeTodo = (id: number) => {
    return deleteTodo(id)
      .then(() => {
        const newTodosList = todos && todos.filter(todo => todo.id !== id);

        setTodos(newTodosList);
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          {todos
            && (
              <button type="button" className="todoapp__toggle-all active" />
            )}

          {/* Add a todo on form submit */}
          <FormTodo
            setTodoTitle={setTodoTitle}
            todoTitle={todoTitle}
            onAdd={addNewTodo}
          />
        </header>

        <section className="todoapp__main">
          <TodoList todos={filteredTodos} onDelete={removeTodo} />
        </section>

        {/* Hide the footer if there are no todos */}
        {todos
          && (
            <footer className="todoapp__footer">
              <span className="todo-count">
                {`${todos?.length} items left`}
              </span>

              {/* Active filter should have a 'selected' class */}
              <TodoFilter todos={todos} setFilteredTodos={setFilteredTodos} />

              {/* don't show this button if there are no completed todos */}
              <button type="button" className="todoapp__clear-completed">
                Clear completed
              </button>
            </footer>
          )}
      </div>

      <ErrorMessage
        errorMessage={errorMesage}
        hasError={hasError}
        setHasError={setHasError}
      />
    </div>
  );
};
