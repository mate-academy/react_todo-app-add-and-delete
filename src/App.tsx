/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { addTodo, getTodos, removeTodo } from './api/todos';
import { Todo } from './types/Todo';
import { Types } from './types/Types';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { NewTodo } from './components/NewTodo/NewTodo';
import { ErrorNote } from './components/ErrorNote/ErrorNote';

const FILTERS: Types = {
  all: 'all',
  completed: 'completed',
  active: 'active',
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(FILTERS.all);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorStatus, setErrorStatus] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(0);
  const [tempTodo, setTempTodo] = useState<Todo>({
    id: 0,
    title: '',
    userId: 0,
    completed: false,
  });

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const changeErrorStatus = () => setErrorStatus(false);

  async function loadTodos() {
    if (user) {
      const todosFromServer = await getTodos(user.id);

      setTodos(todosFromServer);
    }
  }

  const addTodoOnServer = async (todoTitle: string) => {
    if (user) {
      try {
        setIsAdding(true);
        setTempTodo({
          id: 0,
          title: todoTitle,
          userId: user.id,
          completed: false,
        });

        const newTodo = await addTodo({
          title: todoTitle,
          userId: user.id,
          completed: false,
        });

        setTodos(currTodos => [...currTodos, newTodo]);
        setIsAdding(false);
      } catch {
        setErrorMessage('Unable to add a todo');
        setErrorStatus(true);
        setIsAdding(false);
        setTempTodo({
          id: 0,
          title: '',
          userId: 0,
          completed: false,
        });
      }
    }
  };

  const removeTodoFromServer = async (todoId: number) => {
    try {
      setIsRemoving(todoId);
      await removeTodo(todoId);

      setTodos(currTodos => currTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage('Unable to delete a todo');
      setErrorStatus(true);
    }
  };

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    loadTodos();
  }, []);

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case FILTERS.active:
        return !todo.completed;

      case FILTERS.completed:
        return todo.completed;

      default:
        return todo;
    }
  });

  const activeTodosLength = todos.filter(todo => !todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
          />

          <NewTodo
            newTodoField={newTodoField}
            setErrorMessage={setErrorMessage}
            setErrorStatus={setErrorStatus}
            addTodoOnServer={addTodoOnServer}
            isAdding={isAdding}
          />
        </header>

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              isAdding={isAdding}
              isRemoving={isRemoving}
              tempTodo={tempTodo}
              removeTodoFromServer={removeTodoFromServer}
            />
            <TodoFilter
              setFilter={setFilter}
              filters={FILTERS}
              filter={filter}
              activeTodosLength={activeTodosLength}
              haveCompleted={filteredTodos.some(todo => todo.completed)}
            />
          </>
        )}
      </div>

      {errorStatus && (
        <ErrorNote
          errorMessage={errorMessage}
          setErrorStatus={changeErrorStatus}
        />
      )}
    </div>
  );
};
