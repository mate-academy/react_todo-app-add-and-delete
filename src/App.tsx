/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { Filter } from './types/Filter';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { UserWarning } from './UserWarning';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filteredField, setFilteredField] = useState<Filter>(Filter.All);
  const [isLoading, setIsLoading] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [changindIds, setChangingIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const showErrorMes = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    todoService
      .getTodos()
      .then(res => {
        if (res.length === 0) {
          showErrorMes('Unable to load todos');
        } else {
          setTodos(res);
        }
      })
      .catch(() => showErrorMes('Unable to load todos'))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading, todos]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    if (newTodoTitle.trim().length === 0) {
      showErrorMes('Title should not be empty');
    } else {
      const newTodo = {
        title: newTodoTitle.trim(),
        completed: false,
        userId: todoService.USER_ID,
      };

      setIsLoading(true);
      const tempId = Math.random();

      setTempTodo({
        ...newTodo,
        id: tempId,
      });

      setChangingIds(prev => [...prev, tempId]);

      todoService
        .postTodo(newTodo)
        .then(response => {
          setTempTodo(null);
          setTodos(prev => [...prev, response]);
          setNewTodoTitle('');
        })
        .catch(() => {
          showErrorMes('Unable to add a todo');
          setTempTodo(null);
        })
        .finally(() => setIsLoading(false));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(e.target.value);
  };

  const handleDeleteItem = (todoId: number) => {
    setChangingIds(prev => [...prev, todoId]);

    todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        showErrorMes('Unable to delete a todo');
      })
      .finally(() => setChangingIds(prev => prev.filter(id => id !== todoId)));
  };

  const handleClearComleted = () => {
    const deletingId: number[] = [];

    todos.forEach(todo => (todo.completed ? deletingId.push(todo.id) : null));

    deletingId.forEach(id => handleDeleteItem(id));
  };

  const filteredTodos = todos.filter(todo => {
    if (filteredField === Filter.Completed) {
      return todo.completed;
    }

    if (filteredField === Filter.Active) {
      return !todo.completed;
    }

    if (filteredField === Filter.All) {
      return todo;
    }

    return true;
  });

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          newTodoTitle={newTodoTitle}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          inputRef={inputRef}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              changindIds={changindIds}
              onDeleteItem={handleDeleteItem}
              tempTodo={tempTodo}
              onUpdate={() => {}}
            />
            <Footer
              todos={todos}
              filteredField={filteredField}
              setFilteredField={setFilteredField}
              onClearCompleted={handleClearComleted}
            />
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage.length },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
