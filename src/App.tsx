/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, deleteTodo, createTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodoStatus } from './types/TodoStatus';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import classNames from 'classnames';

// const USER_ID = 857;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoStatus, setTodoStatus] = useState<TodoStatus>(TodoStatus.all);
  const [errorMessage, setErrorMessage] = useState('');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDisabledInput, setIsDisabledInput] = useState(false);
  const [isLoadingTodo, setIsLoadingTodo] = useState<number[]>([]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, []);

  const preparedTodos = useMemo(() => {
    if (todoStatus === TodoStatus.active) {
      return todos.filter(todo => !todo.completed);
    }

    if (todoStatus === TodoStatus.completed) {
      return todos.filter(todo => todo.completed);
    }

    return todos;
  }, [todos, todoStatus]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  function addTodo() {
    const correctTitle = newTodoTitle.trim();

    const newTempTodo = {
      id: 0,
      title: correctTitle,
      userId: USER_ID,
      completed: false,
    };

    setIsDisabledInput(true);
    setTempTodo(newTempTodo);
    setIsLoadingTodo(ids => [...ids, 0]);

    createTodo({ title: correctTitle, userId: USER_ID, completed: false })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setNewTodoTitle('');
        setIsDisabledInput(false);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setIsDisabledInput(false);
        setTempTodo(null);
        setIsLoadingTodo(ids => ids.filter(todoId => todoId !== 0));
      });
  }

  function deleteTodoId(todoId: number) {
    setIsLoadingTodo(ids => [...ids, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setIsLoadingTodo([]);
      });
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoTitle={newTodoTitle}
          setNewTodo={setNewTodoTitle}
          addTodo={addTodo}
          onError={setErrorMessage}
          onDisabled={isDisabledInput}
        />

        <TodoList
          todos={preparedTodos}
          onDelete={deleteTodoId}
          tempTodo={tempTodo}
          isLoadingTodo={isLoadingTodo}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            todoStatus={todoStatus}
            setTodoStatus={setTodoStatus}
            onDelete={deleteTodoId}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {/* show only one message at a time */}
        {/* Unable to load todos
        <br />
        Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
        {errorMessage}
      </div>
    </div>
    // <section className="section container">
    //   <p className="title is-4">
    //     Copy all you need from the prev task:
    //     <br />
    //     <a href="https://github.com/mate-academy/react_todo-app-loading-todos#react-todo-app-load-todos">
    //       React Todo App - Load Todos
    //     </a>
    //   </p>
    //   <p className="subtitle">Styles are already copied</p>
    // </section>
  );
};
