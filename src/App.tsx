/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';

import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorMessage } from './components/ErrorMessage/Error';
import { FilterType } from './types/Filter';
import { Errors } from './types/Errors';
import { Todo } from './types/Todo';
import { TodoItem } from './components/TodoItem/TodoItem';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterType, setFilterType] = useState<FilterType>('All');
  const [errorMessage, setErrorMessage] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [todoIdForDeleting, setTodoIdForDeleting] = useState<number[]>([]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => setErrorMessage(Errors.ErrorUser));
    }
  }, []);

  const activeTodosAmount = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  const isTodoCompleted = useMemo(() => (
    todos.some(todo => todo.completed)
  ), [todos]);

  const filteredTodos = todos.filter(todo => {
    switch (filterType) {
      case 'Completed':
        return todo.completed;

      case 'Active':
        return !todo.completed;

      default:
        return true;
    }
  });

  const handleSubmitForm = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!title.trim()) {
        setErrorMessage(Errors.ErorTitle);

        return;
      }

      const addNewTodo = async () => {
        setIsAdding(true);

        if (user) {
          try {
            setTempTodo({
              id: 0,
              userId: user.id,
              title,
              completed: false,
            });

            const newTodo = await addTodo({
              userId: user.id,
              title,
              completed: false,
            });

            setTitle('');

            setTodos(currentTodos => [...currentTodos, newTodo]);
          } catch (error) {
            setErrorMessage(Errors.UnableToAdd);
          } finally {
            setIsAdding(false);
            setTempTodo(null);
          }
        }
      };

      addNewTodo();
    }, [title],
  );

  const removeTodo = useCallback(async (todoId: number) => {
    try {
      setTodoIdForDeleting(currentTodoIds => (
        [...currentTodoIds, todoId]
      ));

      await deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage(Errors.UnableToDelete);
    } finally {
      setTodoIdForDeleting(currentTodoIds => (
        currentTodoIds.filter(id => id !== todoId)));
    }
  }, []);

  const cleanCompletedTodos = useCallback(() => {
    todos.forEach(todo => {
      if (todo.completed) {
        removeTodo(todo.id);
      }
    });
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          title={title}
          isAdding={isAdding}
          onChange={setTitle}
          submitForm={handleSubmitForm}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              todoIdForDeleting={todoIdForDeleting}
              removeTodo={removeTodo}
            />

            {tempTodo
              && (
                <TodoItem
                  todo={tempTodo}
                  isAdding={isAdding}
                  removeTodo={removeTodo}
                />
              )}

            <Footer
              filterType={filterType}
              isTodoCompleted={isTodoCompleted}
              activeTodosAmount={activeTodosAmount}
              cleanCompletedTodos={cleanCompletedTodos}
              changeFilterType={setFilterType}
            />
          </>
        )}
      </div>

      <ErrorMessage
        error={errorMessage}
        onCloseError={setErrorMessage}
      />
    </div>
  );
};
