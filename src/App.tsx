import React, {
  FormEvent,
  useContext, useEffect, useRef, useState,
} from 'react';
import { createTodo, deleteTodos, getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components_Todo/ErrorNotification';
import { NewTodo } from './components_Todo/NewTodo';
import { TodoFilter } from './components_Todo/TodoFilter';

import { TodoList } from './components_Todo/TodoList';
import { FilterStatus } from './types/FilterStatus';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [newTitleTodo, setNewTitleTodo] = useState('');

  const [todos, setTodos] = useState<Todo[]>([]);
  const [, setTodoId] = useState(0);

  const [statusPatch, setStatusPatch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [hasLoadError, setHasLoadError] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user.id)
        .then(response => {
          setTodos(response);
        }).catch(() => (
          setHasLoadError('Unable to load a todo')
        ));
    }

    setIsAdding(false);
  }, []);

  const handleSubmitAdd = async (event: FormEvent) => {
    event.preventDefault();
    setHasLoadError('');
    setIsAdding(true);
    if (user && newTitleTodo !== '') {
      await createTodo(user.id, newTitleTodo)
        .then(todo => {
          setTodos([...todos, todo]);
        }).catch(() => setHasLoadError('Unable to add a todo'))
        .finally(() => setIsAdding(false));
    } else {
      setHasLoadError('Title can\'t be empty');
    }

    setNewTitleTodo('');
  };

  const handleClickDelete = async (curentTodoId: number) => {
    setTodoId(curentTodoId);
    setIsAdding(true);

    await deleteTodos(curentTodoId)
      .then()
      .catch(() => setHasLoadError('Unable to delete a todo'))
      .finally(() => setIsAdding(false));

    const curentDelete = todos.filter(todo => todo.id !== curentTodoId);

    setTodos(curentDelete);
  };

  const handleClearCompleted = () => {
    const clearCompleted = () => (todos.forEach(todo => {
      const filterTodo = todos.filter(({ completed }) => completed !== true);

      if (todo.completed) {
        deleteTodos(todo.id);
        setTodos(filterTodo);
      }
    })
    );

    clearCompleted();
  };

  const filterTodos = todos
    ? todos.filter(todo => {
      switch (statusFilter) {
        case FilterStatus.Completed:

          return todo.completed;
        case FilterStatus.Active:

          return !todo.completed;

        default:
          return todo;
      }
    })
    : null;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          newTodoField={newTodoField}
          newTitleTodo={newTitleTodo}
          handleTitleTodo={setNewTitleTodo}
          handleSubmitAdd={handleSubmitAdd}
          isAdding={isAdding}
        />
        <TodoList
          todos={filterTodos}
          handleClickDelete={handleClickDelete}
          statusPatch={statusPatch}
          setStatusPatch={setStatusPatch}
          isAdding={isAdding}
        />
        {todos.length !== 0 && (
          <TodoFilter
            todos={todos}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            handleClearCompleted={handleClearCompleted}
          />
        )}

        {hasLoadError && (
          <ErrorNotification
            hasLoadError={hasLoadError}
            setHasLoadError={setHasLoadError}
          />
        )}

      </div>
    </div>
  );
};
