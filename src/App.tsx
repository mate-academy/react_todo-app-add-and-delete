/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { getTodos, addTodo, deleteTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification }
  from './components/ErrorNotification/ErrorNotifications';
import { NewTodoField } from './components/NewTodoField/NewTodoField';
import { TodoList } from './components/TodoList/TodoList';
import { TodosFilter } from './components/TodoFilter/TodoFilter';
import { Todo } from './types/Todo';
import { FilteringMethod } from './types/FilteringMethod';

import './App.scss';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>(todos);
  const [selectedIDs, setSelectedIDs] = useState<number[]>([]);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [todoStatus, setTodoStatus]
    = useState<FilteringMethod>(FilteringMethod.All);
  const [isAdding, setIsAdding] = useState(false);
  const [todoTemplate, setTodoTemplate] = useState({
    id: 0,
    userId: 0,
    title: '',
    completed: false,
  });

  const getTodosFromsServer = useCallback(async () => {
    try {
      if (user) {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      }
    } catch (err) {
      setHasError(true);

      setTimeout(() => {
        setHasError(false);
      }, 3000);
    }
  }, []);

  const addNewTodo = useCallback(async (todoTitle: string) => {
    try {
      setIsAdding(true);

      if (user) {
        setTodoTemplate(curr => ({
          ...curr,
          userId: user.id,
          title: todoTitle,
        }));

        const addedTodo = await addTodo({
          title: todoTitle,
          userId: user.id,
          completed: false,
        });

        setIsAdding(false);

        setTodos(curr => [...curr, addedTodo]);
      }
    } catch (error) {
      setHasError(true);
      setErrorMessage('Unable to add a todo');
    }
  }, []);

  const handleDeleteTodo = useCallback(async (id: number) => {
    try {
      setSelectedIDs(current => [...current, id]);
      await deleteTodo(id);
      await getTodosFromsServer();

      setSelectedIDs([]);
    } catch (error) {
      setHasError(true);
      setErrorMessage('Unable to delete a todo');
    }
  }, []);

  const removeCompleted = async () => {
    try {
      setSelectedIDs(todos
        .filter(todo => todo.completed)
        .map(todo => todo.id));

      await Promise.all(todos.map(post => {
        return post.completed ? handleDeleteTodo(post.id) : null;
      }));

      setSelectedIDs([]);
    } catch (error) {
      setHasError(true);
      setErrorMessage('Unable to delete todo');
    }
  };

  useEffect(() => {
    getTodosFromsServer();
  }, []);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [todos]);

  useEffect(() => {
    let todosCopy = [...todos];

    if (todoStatus !== FilteringMethod.All) {
      todosCopy = todosCopy.filter(todo => {
        switch (todoStatus) {
          case FilteringMethod.Active:
            return !todo.completed;

          case FilteringMethod.Completed:
            return todo.completed;

          default:
            return true;
        }
      });
    }

    setVisibleTodos(todosCopy);
  }, [todos, todoStatus]);

  const handleErrorClose = useCallback(() => setHasError(false), []);
  const handleStatusSelect = useCallback((status: FilteringMethod) => {
    setTodoStatus(status);
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodoField
          newTodoField={newTodoField}
          isAdding={isAdding}
          addNewTodo={addNewTodo}
          setErrorMessage={setErrorMessage}
          setHasError={setHasError}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              visibleTodos={visibleTodos}
              handleDeleteTodo={handleDeleteTodo}
              todoTemplate={todoTemplate}
              isAdding={isAdding}
              selectedIDs={selectedIDs}
            />

            <TodosFilter
              todos={todos}
              filteringMethod={todoStatus}
              handleStatusSelect={handleStatusSelect}
              removeCompleted={removeCompleted}
            />
          </>
        )}

      </div>

      <ErrorNotification
        hasError={hasError}
        setHasError={setHasError}
        errorMessage={errorMessage}
        handleErrorClose={handleErrorClose}
      />
    </div>
  );
};
