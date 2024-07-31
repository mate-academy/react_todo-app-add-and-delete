/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, deleteTodo, addNewTodo } from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Todo } from './types/Todo';
import { TodoStatus } from './types/SortTypes';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState(TodoStatus.All);
  const [idTodo, setIdTodo] = useState(0);
  const [title, setTitle] = useState('');

  useEffect(() => {
    getTodos()
      .then(todosFromServer => setTodos(todosFromServer))
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => {
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, []);

  const filteredTodos = useMemo(() => {
    switch (status) {
      case TodoStatus.Active:
        return todos.filter(todo => !todo.completed);
      case TodoStatus.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, status]);

  const onDeleteTodo = (todoId: number) => {
    setIdTodo(todoId);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setTodos(todos);
        setErrorMessage('Unable to delete a todo');
      });
  };

  const onCreateTodo = () => {
    const newTodo = {
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTodos(currentTodos => [...currentTodos, { ...newTodo, id: 0 }]);
    setIdTodo(0);

    return addNewTodo(newTodo)
      .then(todo => {
        setTodos(todos);
        setTodos(currentTodos => [...currentTodos, todo]);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTodos(todos);
      });
  };

  const handleChangeTitle = (value: string) => {
    setTitle(value);
  };

  const reset = () => {
    setTitle('');
  };

  const leftItemsCount = todos.filter(
    todo => !todo.completed && todo.id !== 0,
  ).length;
  const completedItems = todos.filter(todo => todo.completed);

  async function clearCompletedTodo() {
    completedItems.map(async todo => {
      await deleteTodo(todo.id)
        .then(() => {
          setTodos(currentTodos =>
            currentTodos.filter(item => item.id !== todo.id),
          );
        })
        .catch(() => {
          setErrorMessage('Unable to delete a todo');
        });
    });
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          title={title}
          onSubmit={onCreateTodo}
          onChange={handleChangeTitle}
          onReset={reset}
          onError={setErrorMessage}
        />
        <TodoList
          list={filteredTodos}
          onDelete={onDeleteTodo}
          idTodo={idTodo}
        />
        {todos.length > 0 && (
          <Footer
            onClick={setStatus}
            status={status}
            leftItems={leftItemsCount}
            completedItems={completedItems}
            onDelete={clearCompletedTodo}
          />
        )}
      </div>
      <ErrorNotification
        errorMessage={errorMessage}
        onClose={setErrorMessage}
      />
    </div>
  );
};
