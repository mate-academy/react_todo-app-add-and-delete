import React, { useEffect, useState, useMemo } from 'react';
import { Todo } from './types/Todo';
import * as todoService from './api/todos';
import classNames from 'classnames';
import { USER_ID } from './api/todos';
import { SelectOption } from './types/Todo';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>('');
  const [filter, setFilter] = useState(SelectOption.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [todoDelete, setTodoDelete] = useState<number[]>([]);

  const close = () => {
    setErrorMessage('');
  };

  function loadTodos() {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }

  useEffect(() => {
    if (errorMessage) {
      setTimeout(close, 3000);
    }
  }, [errorMessage]);

  useEffect(loadTodos, []);

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case SelectOption.Active:
        return !todo.completed;
      case SelectOption.Completed:
        return todo.completed;
      case SelectOption.All:
      default:
        return true;
    }
  });

  const handleCreateTodo = async (title: string) => {
    setErrorMessage('');
    setTempTodo({
      title: inputValue.trim(),
      id: 0,
      completed: false,
      userId: USER_ID,
    });
    try {
      const data = await todoService.createTodo(title);

      setTodos(prevTodos => [...prevTodos, data]);
    } catch (err) {
      setErrorMessage('Unable to add a todo');
      throw err;
    } finally {
      setTempTodo(null);
    }
  };

  const deleteTodo = async (todoId: number) => {
    setTodoDelete(prevTodos => [...prevTodos, todoId]);

    return todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodo => currentTodo.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setTodoDelete(prevTodos =>
          prevTodos.filter(prevTodo => prevTodo !== todoId),
        );
      });
  };

  const handleDeleteCompledTodo = async () => {
    const completedTodo = todos.filter(todo => todo.completed);

    if (completedTodo.length === 0) {
      return;
    }

    await Promise.allSettled(completedTodo.map(todo => deleteTodo(todo.id)));
  };

  const nonActiveTodos = useMemo(
    () => todos.filter(todo => todo.completed),
    [todos],
  );

  const activeTodos = useMemo(
    () => todos.length - nonActiveTodos.length,
    [nonActiveTodos, todos],
  );

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleCreateTodo={handleCreateTodo}
          setErrorMessage={setErrorMessage}
          todoDelete={todoDelete}
        />
        <TodoList
          filteredTodo={filteredTodos}
          tempTodo={tempTodo}
          deleteTodo={deleteTodo}
          todoDelete={todoDelete}
        />
        {todos.length !== 0 && (
          <Footer
            byFilter={filter}
            activeTodos={activeTodos}
            nonActiveTodos={nonActiveTodos.length}
            setFilter={setFilter}
            todos={todos}
            onClearCompleted={handleDeleteCompledTodo}
          />
        )}
      </div>
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
          onClick={close}
        />
        {errorMessage}
      </div>
    </div>
  );
};
