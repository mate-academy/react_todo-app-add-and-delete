/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import * as todosService from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { Main } from './components/Main';
import { Footer } from './components/Footer';

const USER_ID = 11678;

enum StatusFilter {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [titl, setTitl] = useState('');
  const count = () => todos.filter((t) => t.completed === false).length;

  const [
    selectTodoFilteredList,
    setSelectTodoFilteredList,
  ] = useState(StatusFilter.ALL);

  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  useEffect(() => {
    if (USER_ID) {
      todosService.getTodos(USER_ID).then(tod => {
        setTodos(tod);
      }).catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
    }
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  // eslint-disable-next-line
  const filterTodos = useMemo(() => {
    return todos.filter((todo) => {
      const { completed } = todo;

      switch (selectTodoFilteredList) {
        case StatusFilter.ALL: return true;
        case StatusFilter.ACTIVE: return !completed;
        case StatusFilter.COMPLETED: return completed;
        default: return true;
      }
    });
  }, [todos, selectTodoFilteredList]);

  const addTodo = ({ userId, title, completed }: Todo) => {
    setErrorMessage('');

    return todosService.addNewTodo({ userId, title, completed })
      .then((newTodo) => {
        setTodos(currentTodos => {
          return [...currentTodos, newTodo];
        });
      })
      .catch((error: Error) => {
        setErrorMessage('Unable to add a todo');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
        throw error;
      });
  };

  const deleteTodo = (todoId: number) => {
    setTodos(currentTodos => currentTodos.filter((cT) => cT.id !== todoId));

    return todosService.deleteTodo(todoId)
      .catch((error) => {
        setTodos(todos);
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
        throw error;
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          todo={selectedTodo}
          title={titl}
          userId={USER_ID}
          onSetTitle={setTitl}
          onTitleError={setErrorMessage}
          onAddTodo={addTodo}
          onSelectTodo={setSelectedTodo}
        />

        {
          todos.length > 0 && (
            <Main
              todos={filterTodos}
              onDeleteTodo={deleteTodo}
              selTodo={selectedTodo}
            />
          )
        }

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            countTodos={count()}
            selectTodoFilteredList={selectTodoFilteredList}
            setSelectTodoFilteredList={setSelectTodoFilteredList}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal
          ${!errorMessage && 'hidden'}`}
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
