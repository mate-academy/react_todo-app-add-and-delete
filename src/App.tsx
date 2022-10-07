import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { deleteTodo, getTodos, postTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { FilterBy, TodoFilter } from './components/TodoFilter';
import { TodoField } from './components/TodoField';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { ErrorMessage, ErrorTypes } from './components/ErrorMessage';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(FilterBy.All);
  const [errorType, setErrorType] = useState<ErrorTypes>(ErrorTypes.None);
  const [errorClose, setErrorClosing] = useState(false);
  const [todoName, setNewTodoName] = useState('');
  const [isAdding, setIsAddingFromServer] = useState(false);
  const [completedTodos, setCompleted] = useState<number[]>([]);

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
        setCompleted(loadedTodos.filter(({ completed }) => completed)
          .map(({ id }) => id));
      } catch (error) {
        setErrorType(ErrorTypes.LoadingAllError);
      }
    };

    loadTodos();
  }, [completedTodos]);

  const handleAdd = async (newTodoName: string) => {
    setIsAddingFromServer(true);

    try {
      const newTodo = await createPost(newTodoName);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setTodos((prevTodos: any) => {
        return [
          ...prevTodos,
          newTodo,
        ];
      });

      setNewTodoName('');
    } catch (error) {
      setErrorType(ErrorTypes.AddingTodoError);
      setErrorClosing(false);
    }

    setIsAddingFromServer(false);
  };

  const handleDelete = async (id: number) => {
    deletePost(id);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <TodoField
            newToField={newTodoField}
            todos={todos}
            todoName={todoName}
            setNewTodoName={setNewTodoName}
            onAdd={handleAdd}
            isAdding={isAdding}
            setErrorType={setErrorType}
            setErrorClosing={setErrorClosing}
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
              setErrorClosing={setErrorClosing}

            />
            <footer
              className="todoapp__footer"
              data-cy="Footer"
            >
              <TodoFilter
                completed={completedTodos}
                setCompleted={setCompleted}
                todos={todos}
                filterType={filter}
                setFilterType={setFilter}
                onDelete={handleDelete}
              />
            </footer>
          </>

        )}

      </div>

      {errorType !== ErrorTypes.None && (
        <ErrorMessage
          setErrorType={setErrorType}
          error={errorClose}
          closeError={setErrorClosing}
          errorType={errorType}
        />
      )}
    </div>
  );
};
