/* eslint-disable jsx-a11y/control-has-associated-label */
import React,
{
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorMessages } from './components/ErrorMessages';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/Filter';
import { TodoItem } from './components/Todo';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('All');
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingDataIds, setDeletingDataIds] = useState<number[]>([]);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => {
          setError('Can\'t load todos');
        });
    }
  }, []);

  const remainingTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);
  const filteredTodos = todos.filter(todo => {
    switch (filterStatus) {
      case 'Completed':
        return todo.completed;

      case 'Active':
        return !todo.completed;

      default:
        return true;
    }
  });

  const handleSubmitButton = (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (!title) {
      setError('Title can\'t be empty');

      return;
    }

    if (user) {
      setTempTodo({
        id: 0,
        userId: user.id,
        title,
        completed: false,
      });

      setIsAdding(true);

      addTodo(user.id, title)
        .then(addedTodo => {
          setTodos(prev => [...prev, {
            id: addedTodo.id,
            userId: addedTodo.userId,
            title: addedTodo.title,
            completed: addedTodo.completed,
          }]);
        })
        .catch(() => setError('Unable to add a todo'))
        .finally(() => {
          setTitle('');
          setIsAdding(false);
          setTempTodo(null);
        });
    }
  };

  const handleDeleteButton = (todoId: number) => {
    setDeletingDataIds(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(deletedTodo => {
          return deletedTodo.filter(todo => todo.id !== todoId);
        });
      })
      .catch(() => setError('Unable to delete a todo'))
      .finally(() => {
        setDeletingDataIds([]);
      });
  };

  const handleClearButton = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDeleteButton(todo.id);
      }
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          title={title}
          onChange={setTitle}
          onSubmit={handleSubmitButton}
          isAdding={isAdding}
        />

        <TodoList
          todos={filteredTodos}
          onDelete={handleDeleteButton}
          deletingDataIds={deletingDataIds}
        />

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            isAdding={isAdding}
            onDelete={handleDeleteButton}
          />
        )}

        {todos.length > 0
          && (
            <Footer
              remainingTodos={remainingTodos}
              completedTodos={completedTodos}
              setFilterStatus={setFilterStatus}
              filterStatus={filterStatus}
              onClear={handleClearButton}
            />
          )}
      </div>

      <ErrorMessages error={error} setError={setError} />
    </div>
  );
};
