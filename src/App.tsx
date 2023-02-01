/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  useMemo,
} from 'react';

import { AuthContext } from './components/Auth/AuthContext';

import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoElement } from './components/TodoElement';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { filterTodos, Filter } from './helpers/filterTodos';

import { Todo } from './types/Todo';
import { getTodos, createTodo, deleteTodo } from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterOption, setFilterOption] = useState<Filter>(Filter.all);
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const handleError = () => {
    setTimeout(() => setErrorMessage(''), 3000);
  };

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => {
          setErrorMessage('Unable to load a todos');
          handleError();
        });
    }
  }, []);

  const activeTodos = useMemo(
    () => todos.filter(todo => !todo.completed),
    [todos],
  );

  const completeTodosCount = useMemo(
    () => todos.filter(todo => todo.completed).length,
    [todos],
  );

  const filteredTodos = useMemo(() => {
    return filterTodos(todos, filterOption);
  }, [todos, filterOption]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title) {
      setErrorMessage('Title can\'t be empty');

      return;
    }

    if (user) {
      setTempTodo({
        id: 0,
        title,
        completed: false,
        userId: user.id,
      });

      setIsAdding(true);

      createTodo(title, user.id)
        .then(newTodo => {
          setTodos(prev => [...prev, {
            id: newTodo.id,
            userId: newTodo.userId,
            title: newTodo.title,
            completed: newTodo.completed,
          }]);
        })
        .catch(() => setErrorMessage('Unable to add a todo'))
        .finally(() => {
          setTempTodo(null);
          setTitle('');
          setIsAdding(false);
        });
    }
  };

  const handleDeleteClick = (id: number) => {
    deleteTodo(id)
      .then(() => (
        setTodos(currentTodos => currentTodos
          .filter(todo => todo.id !== id))
      ))
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      });
  };

  const handleClearCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDeleteClick(todo.id);
      }
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <TodoHeader
          newTodoField={newTodoField}
          title={title}
          onSetTitle={setTitle}
          onSubmit={handleFormSubmit}
          isAdding={isAdding}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              handleDeleteClick={handleDeleteClick}
              isActive={isAdding}
            />

            {tempTodo && (
              <TodoElement
                todo={tempTodo}
                isActive={isAdding}
                handleDeleteClick={handleDeleteClick}
              />
            )}

            <TodoFooter
              activeTodos={activeTodos}
              completeTodosCount={completeTodosCount}
              filterOption={filterOption}
              setFilterOption={setFilterOption}
              handleClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      {errorMessage && (
        <ErrorNotification
          error={errorMessage}
          onChangeError={setErrorMessage}
        />
      )}
    </div>
  );
};
