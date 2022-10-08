import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { AuthContext } from './components/Auth/AuthContext';
import { FilterBy, TodoFilter } from './components/TodoFilter';
import { TodoField } from './components/TodoField';
import { TodoList } from './components/TodoList';
import { ErrorMessage, ErrorTypes } from './components/LoadingErrorMessage';

import { getTodos, deleteTodo, postTodo } from './api/todos';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoName, setNewTodoName] = useState('');
  const [filter, setFilter] = useState(FilterBy.All);
  const [errorType, setErrorType] = useState<ErrorTypes>(ErrorTypes.None);
  const [closingError, setClosingError] = useState(false);
  const [isAdding, setIsLoading] = useState(false);
  const [completedTodos, setCompletedTodos] = useState<number[]>([]);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  async function createPost(title: string) {
    if (user) {
      return postTodo(user.id, {
        userId: user.id,
        title,
        completed: false,
      });
    }

    return 0;
  }

  async function deletePost(id: number) {
    try {
      const deleted = await deleteTodo(id);

      return deleted;
    } catch (error) {
      setErrorType(ErrorTypes.DeletingOneError);
    }

    return 0;
  }

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const loadedTodos = await getTodos(user?.id || 0);

        setTodos(loadedTodos);
        setCompletedTodos(loadedTodos.filter(({ completed }) => completed)
          .map(({ id }) => id));
      } catch (error) {
        setErrorType(ErrorTypes.LoadingAllError);
      }
    };

    loadTodos();
  }, [completedTodos]);

  const handleAdd = async (newTodoName: string) => {
    setIsLoading(true);

    try {
      const newTodo = await createPost(newTodoName);

      setTodos((prevTodos: any) => {
        return [
          ...prevTodos,
          newTodo,
        ];
      });

      setNewTodoName('');
    } catch (error) {
      setErrorType(ErrorTypes.AddingTodoError);
      setClosingError(false);
    }

    setIsLoading(false);
  };

  const handleDelete = async (id: number) => {
    try {
      const deleted = await deletePost(id);

      return deleted;
    } catch (error) {
      setErrorType(ErrorTypes.DeletingOneError);
    }

    return 0;
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <TodoField
            newTodoField={newTodoField}
            todos={todos}
            todoName={todoName}
            setNewTodoName={setNewTodoName}
            onAdd={handleAdd}
            isAdding={isAdding}
            setErrorType={setErrorType}
            setErrorClosing={setClosingError}
          />
        </header>

        {(todos.length > 0 || isAdding) && (
          <>
            <TodoList
              todos={todos}
              filterType={filter}
              isAdding={isAdding}
              todoName={todoName}
              onDelete={handleDelete}
              setClosingError={setClosingError}
            />
            <footer
              className="todoapp__footer"
              data-cy="Footer"
            >
              <TodoFilter
                todos={todos}
                filterType={filter}
                setFilterType={setFilter}
                completed={completedTodos}
                setCompleted={setCompletedTodos}
                onDelete={handleDelete}
              />
            </footer>
          </>
        )}
      </div>

      {errorType !== ErrorTypes.None && (
        <ErrorMessage
          setErrorType={setErrorType}
          error={closingError}
          closeError={setClosingError}
          errorType={errorType}
        />
      )}
    </div>
  );
};
