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
import { AddingBlancError } from './components/AddingBlancError';
import { AddingTodoError } from './components/AddingTodoError';
import { DeletingTodoError } from './components/DeletingTodoError';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(FilterBy.All);
  const [loadingError, setLoadingError] = useState(false);
  const [addingBlancError, setAddingBlancError] = useState(false);
  const [errorClose, setErrorClosing] = useState(false);
  const [todoName, setNewTodoName] = useState('');
  const [isAdding, setIsAddingFromServer] = useState(false);
  const [addTodoError, setAddTodoError] = useState(false);
  const [deleteTodoError, setDeleteTodoError] = useState(false);
  const [completed, setCompleted] = useState<number[]>([]);

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

  async function deletePost(id: number | number[]) {
    const deleted = await deleteTodo(id);

    return deleted;
  }

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const loadedTodos = await getTodos(user?.id || 0);

        setTodos(loadedTodos);
        setCompleted(loadedTodos.filter((todo) => todo.completed === true)
          .map((todo) => todo.id));
      } catch (error) {
        setLoadingError(true);
      }
    };

    loadTodos();
  }, [completed]);

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
      setAddTodoError(true);
    }

    setIsAddingFromServer(false);
  };

  const handleDelete = async (id: number | number[]) => {
    try {
      deletePost(id);
    } catch (error) {
      setDeleteTodoError(true);
    }
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
            setAddingBlancError={setAddingBlancError}
            loadingError={loadingError}
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
            />
            <footer
              className="todoapp__footer"
              data-cy="Footer"
            >
              <TodoFilter
                completed={completed}
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

      {loadingError && (
        <LoadingError
          setLoadingError={setLoadingError}
          error={errorClose}
          closeError={setErrorClosing}
        />
      )}

      {addingBlancError && (
        <AddingBlancError
          error={errorClose}
          closeError={setErrorClosing}
          setAddingBlancError={setAddingBlancError}
        />
      )}

      {addTodoError && (
        <AddingTodoError
          error={errorClose}
          closeError={setErrorClosing}
          setAddTodoError={setAddTodoError}
        />
      )}

      {deleteTodoError && (
        <DeletingTodoError
          error={errorClose}
          closeError={setErrorClosing}
          setDeleteTodoError={setDeleteTodoError}
        />
      )}
    </div>
  );
};
