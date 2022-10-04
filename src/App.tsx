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
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [newTitleTodo, setNewTitleTodo] = useState('');

  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoId, setTodoId] = useState(0);

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
  }, [todos]);

  const handleSubmitAdd = async (event: FormEvent) => {
    event.preventDefault();
    setHasLoadError('');
    setIsAdding(true);
    if (user && newTitleTodo !== '') {
      await createTodo(user.id, newTitleTodo)
        .then(todo => {
          setTodos([...todos, todo]);
        }).catch(() => setHasLoadError('Unable to add a todo'));
    } else {
      setHasLoadError('Title can\'t be empty');
    }

    setNewTitleTodo('');
  };

  const handleClickDelete = async (curentTodo: number) => {
    setTodoId(curentTodo);
    setIsAdding(true);
    await deleteTodos(curentTodo)
      .then()
      .catch(() => setHasLoadError('Unable to delete a todo'));
  };

  const handleClearCompleted = () => {
    const clearCompleted = () => (todos.forEach(todo => {
      const filterTodo = todos.filter(({ completed }) => completed === true);

      if (todo.completed === true) {
        deleteTodos(todo.id).then();
        setTodos(filterTodo);
      }
    })
    );

    clearCompleted();
  };

  const filterTodos = todos
    ? todos.filter(todo => {
      switch (statusFilter) {
        case 'completed':

          return todo.completed;
        case 'active':

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
        />
        <TodoFilter
          todos={todos}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          handleClearCompleted={handleClearCompleted}
        />
        <ErrorNotification
          hasLoadError={hasLoadError}
          setHasLoadError={setHasLoadError}
        />
      </div>
    </div>
  );
};
