/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';

import * as clientHttp from './api/todos';
import { Todo } from './types/Todo';
import { FilterTypes } from './types/FilterTypes';

import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodoError } from './components/TodoError';
import { TodoItem } from './components/TodoItem';

const USER_ID = 11131;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterValue, setFilterValue] = useState(FilterTypes.ALL);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const loadTodos = () => {
    clientHttp.getTodos(USER_ID)
      .then(loadedTodos => setTodos(loadedTodos as Todo[]))
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  };

  useEffect(loadTodos, [USER_ID]);

  // eslint-disable-next-line
  const filteredTodos = useMemo(() => {
    switch (filterValue) {
      case FilterTypes.COMPLETED:
        return todos.filter((todo) => todo.completed);
      case FilterTypes.ACTIVE:
        return todos.filter((todo) => !todo.completed);
      default:
        return todos;
    }
  }, [todos, filterValue]);

  const activeTodos = todos.filter(todo => !todo.completed);

  function reset() {
    setTitle('');
    setIsDisabled(false);
    setTempTodo(null);
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title) {
      setErrorMessage("Title can't be empty");
      setTimeout(() => setErrorMessage(''), 3000);

      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      title,
      completed: false,
      userId: USER_ID,
    };

    setIsDisabled(true);

    clientHttp.addTodo(newTodo)
      .then((responsedTodo) => {
        setTodos(curTodos => [...curTodos, responsedTodo]);
        reset();
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTimeout(() => setErrorMessage(''), 3000);
        reset();
      });

    setTempTodo({
      id: 0,
      ...newTodo,
    });
  };

  const deleteTodo = (todoId: number) => {
    clientHttp.removeTodo(todoId)
      .then(() => {
        setTodos(currTodos => {
          return currTodos.filter(todo => todo.id !== todoId);
        });
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => setErrorMessage(''), 3000);
        reset();
      });
  };

  const deleteAllCompletedTodos = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          title={title}
          setTitle={setTitle}
          handleSubmit={handleSubmit}
          isDisabled={isDisabled}
        />

        {todos.length !== 0 && (
          <TodoList
            todos={filteredTodos}
            onDeleteBtn={deleteTodo}
          />
        )}
        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            onDeleteBtn={deleteTodo}
          />
        )}

        {todos.length !== 0 && (
          <TodoFooter
            activeTodos={activeTodos}
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            todos={filteredTodos}
            deleteAllCompletedTodos={deleteAllCompletedTodos}
          />
        )}
      </div>

      <TodoError
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
