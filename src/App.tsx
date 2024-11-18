/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Error } from './components/Error';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitleTodo, setNewTitleTodo] = useState('');
  const [filter, setFilter] = useState('All');
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState<number[]>([]);

  const hideErrorMessage = () => {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, []);

  const addTodo = (newTodo: Omit<Todo, 'id'>) => {
    setLoading(currentIds => [...currentIds, newTodo.userId]);
    todoService
      .postTodo(newTodo)
      .then(addedTodo => {
        setTodos(currentTodos => [...currentTodos, addedTodo]);
        setNewTitleTodo('');
        setLoading(currentIds =>
          currentIds.filter(id => id !== newTodo.userId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setLoading(currentIds =>
          currentIds.filter(id => id !== newTodo.userId),
        );
        hideErrorMessage();
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const deleteTodo = (userId: number) => {
    setLoading(currentId => [...currentId, userId]);
    todoService
      .deleteTodo(userId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== userId),
        );
        setLoading(currentId => currentId.filter(id => id !== userId));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setLoading(currentId => currentId.filter(id => id !== userId));
        hideErrorMessage();
      });
  };

  const handleEmptyLineError = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = newTitleTodo.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');
      setTimeout(() => setErrorMessage(''), 3000);

      return;
    }

    setTempTodo({
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: todoService.USER_ID,
    });

    addTodo({
      userId: todoService.USER_ID,
      title: trimmedTitle,
      completed: false,
    });
  };

  const handleChangeNewTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitleTodo(event.target.value);
  };

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filter === 'active') {
        return !todo.completed;
      }

      if (filter === 'completed') {
        return todo.completed;
      }

      return true;
    });
  }, [todos, filter]);

  const handleDeleteAllCompleted = (todosId: number[]) => {
    todosId.forEach(id => {
      deleteTodo(id);
    });
  };

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          newTitleTodo={newTitleTodo}
          handleChangeNewTitle={handleChangeNewTitle}
          handleEmptyLineError={handleEmptyLineError}
          errorMessage={errorMessage}
          tempTodo={tempTodo}
        />
        {!!todos && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            deleteTodo={deleteTodo}
            loading={loading}
          />
        )}
        {!!todos.length && (
          <Footer
            todos={todos}
            onFilter={setFilter}
            filter={filter}
            handleDeleteAllCompleted={handleDeleteAllCompleted}
          />
        )}
      </div>

      <Error errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
    </div>
  );
};
