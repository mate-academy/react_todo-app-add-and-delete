/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorsAlerts } from './components/ErrorsAlerts';
import { TodoAppHeader } from './components/TodoAppHeader/TodoAppHeader';
import { TodosFooter } from './components/TodosFooter';
import { TodosList } from './components/TodosList';
import { getTodos, createTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { filterTodos } from './utils/filterTodos';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [complitedFilter, setComplitedFilter] = useState(Filter.All);
  const [isAdding, setIsAdding] = useState(false);
  const [temporaryTodo, setTemporaryTodo] = useState<Todo | null>(null);
  const userId = user ? user.id : 0;

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => {
          setErrorMessage('Can\'t load data');
        });
    }
  }, []);

  const filteredTodos = useMemo(() => (
    filterTodos(todos, complitedFilter)
  ), [todos, complitedFilter]);

  const addNewTodo = useCallback((todoTitle: string) => {
    if (!todoTitle) {
      setErrorMessage('Title can\'t be empty');

      return;
    }

    setIsAdding(true);
    setErrorMessage('');

    setTemporaryTodo({
      id: 0,
      userId,
      title: todoTitle,
      completed: false,
    });

    const newTodo = {
      userId,
      title: todoTitle,
      completed: false,
    };

    createTodo(userId, newTodo)
      .then((receivedNewTodo) => {
        setTodos(currentTodos => [...currentTodos, receivedNewTodo]);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setIsAdding(false);
        setTemporaryTodo(null);
      });
  }, []);

  const removeTodo = (todoId: number) => {
    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => {
          return currentTodos.filter(todo => todo.id !== todoId);
        });
      })
      .catch(() => setErrorMessage('Unable to delete a todo'));
  };

  const clearCompleted = () => {
    todos.forEach(({ id, completed }) => {
      if (completed) {
        removeTodo(id);
      }
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoAppHeader
          addNewTodo={addNewTodo}
          isAdding={isAdding}
        />

        {todos.length > 0 && (
          <>
            <TodosList
              todos={filteredTodos}
              tempTodo={temporaryTodo}
              removeTodo={removeTodo}
            />
            <TodosFooter
              complitedFilter={complitedFilter}
              changeComplitedFilter={setComplitedFilter}
              clearCompleted={clearCompleted}
              todos={todos}
            />
          </>
        )}
      </div>

      <ErrorsAlerts
        errorMessage={errorMessage}
        closeErrors={setErrorMessage}
      />
    </div>
  );
};
