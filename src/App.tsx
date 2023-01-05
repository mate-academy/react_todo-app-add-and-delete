/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { addTodos, deleteTodos, getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Filter } from './components/Filter';
import { NewTodo } from './components/NewTodo';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const userId = user ? user.id : 0;
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [noError, setNoError] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [errorText, setErrorText] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState([0]);
  const [
    temporaryTodo,
    setTemporaryTodo,
  ] = useState<Todo | null>(null);

  const showError = (errorTextToShow: string) => {
    setNoError(false);
    setErrorText(errorTextToShow);

    setTimeout(() => {
      setNoError(true);
      setErrorText('');
    }, 3000);
  };

  useEffect(() => {
    getTodos(userId)
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        showError('Unable to update a todo');
      });

    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const onSubmit = (title: string) => {
    if (title.length === 0) {
      showError('Title can\'t be empty');

      return;
    }

    setTemporaryTodo({
      id: 0,
      userId,
      title,
      completed: false,
    });

    setIsAdding(true);

    const newTodo = {
      userId,
      title,
      completed: false,
    };

    addTodos(userId, newTodo)
      .then((newTodoFromServer) => {
        setTodos([...todos, newTodoFromServer]);
      })
      .catch(() => {
        showError('Unable to add a todo');
      })
      .finally(() => {
        setTemporaryTodo(null);
        setIsAdding(false);
      });
  };

  const onDelete = (id: number) => {
    setIsDeleting((currentArrIsDelete) => [...currentArrIsDelete, id]);

    deleteTodos(id)
      .then(() => {
        setTodos((currentTodos) => {
          return currentTodos.filter(todo => todo.id !== id);
        });

        setIsDeleting((currentArrIsDelete) => {
          return currentArrIsDelete
            .filter(idOfDeletingItem => idOfDeletingItem !== id);
        });
      })
      .catch(() => showError('Unable to delete a todo'));
  };

  const handleClearCompleted = () => {
    todos.forEach(({ id, completed }) => {
      if (completed) {
        onDelete(id);
      }
    });
  };

  const isClearCompletedHidden = todos.some(({ completed }) => completed);

  const visibleTodos = todos.filter(({ completed }) => {
    switch (filterStatus) {
      case 'Active':
        return !completed;
      case 'Completed':
        return completed;
      default:
        return true;
    }
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          newTodoField={newTodoField}
          isAdding={isAdding}
          onFocus={setNoError}
          onFormSubmit={onSubmit}
        />

        <TodoList
          visibleTodos={visibleTodos}
          tempTodo={temporaryTodo}
          isDeleting={isDeleting}
          onDelete={onDelete}
        />

        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="todosCounter">
            {`${visibleTodos.length} items left`}
          </span>

          <Filter filterStatus={filterStatus} onFilter={setFilterStatus} />

          <button
            data-cy="ClearCompletedButton"
            type="button"
            className="todoapp__clear-completed"
            onClick={handleClearCompleted}
            style={{
              visibility: !isClearCompletedHidden ? 'hidden' : 'visible',
            }}
          >
            Clear completed
          </button>
        </footer>
      </div>

      <div
        data-cy="ErrorNotification"
        className="notification is-danger is-light has-text-weight-normal"
        hidden={noError}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setNoError(true)}
        />
        {errorText}
      </div>
    </div>
  );
};
