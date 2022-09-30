import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { deleteTodo, getTodos, postTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { FilterBy, TodoFilter } from './components/TodoFilter';
import { TodoField } from './components/TodoField';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { LoadingError } from './components/LoadingError';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(FilterBy.All);
  const [loadingError, setLoadingError] = useState(false);
  const [addingError, setAddingError] = useState(false);
  const [errorClose, setErrorClosing] = useState(false);
  const [todoName, setNewTodoName] = useState('');
  const [isAdding, setIsAddingFromServer] = useState(false);

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
    return deleteTodo(id);
  }

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    const loadTodos = async () => {
      try {
        const loadedTodos = await getTodos(user?.id || 0);

        setTodos(loadedTodos);
      } catch (error) {
        setLoadingError(true);
      }
    };

    loadTodos();
  }, []);

  const handleDelete = async (id: number) => {
    setTimeout(() => {
      deletePost(id);
      setTodos(todos.filter((todo) => todo.id !== id));
    }, 500);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <TodoField
            ref={newTodoField}
            todos={todos}
            todoName={todoName}
            setNewTodoName={setNewTodoName}
            onAdd={async (newTodoName: string) => {
              setIsAddingFromServer(true);
              const newTodo = await createPost(newTodoName);

              setTimeout(() => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setTodos((prevTodos: any) => {
                  return [
                    ...prevTodos,
                    newTodo,
                  ];
                });
              }, 500);

              setTimeout(() => setIsAddingFromServer(false), 500);
            }}
            isAdding={isAdding}
            addingError={setAddingError}
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
            />
            <footer
              className="todoapp__footer"
              data-cy="Footer"
            >
              <TodoFilter
                todos={todos}
                filterType={filter}
                setFilterType={setFilter}
                onDelete={handleDelete}
              />
            </footer>
          </>

        )}

      </div>

      {loadingError && (
        <LoadingError
          addingError={setAddingError}
          error={errorClose}
          closeError={setErrorClosing}
          errorType={addingError}
        />
      )}

      {addingError && (
        <LoadingError
          error={errorClose}
          closeError={setErrorClosing}
          addingError={setAddingError}
          errorType={addingError}
        />
      )}
    </div>
  );
};
