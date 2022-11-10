/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Error } from './components/Error';
import { FieldForSorting, Todo } from './types/Todo';
import { AddTodoForm } from './components/AddTodoForm';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isError, setIsError] = useState(false);
  const [fieldForSorting, setFieldForSorting]
    = useState<FieldForSorting>(FieldForSorting.All);
  const [titleNewTodo, setTitleNewTodo] = useState('');
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  // const [deletingTodosId, setDeletingTodosId] = useState<number[]>([]);

  const tempTodo: Todo = {
    id: 0,
    userId: user?.id || 0,
    title: titleNewTodo,
    completed: false,
  };

  const getTodosFromAPI = useCallback(async () => {
    setIsError(false);
    if (user) {
      try {
        const todosFromAPI = await getTodos(user.id);

        setTodos(todosFromAPI);
      } catch {
        setIsError(true);
        setError('No ToDo loaded');

        setTimeout(() => {
          setIsError(false);
        }, 3000);
      }
    }
  }, []);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getTodosFromAPI();
  }, []);

  const closeError = useCallback(() => {
    setIsError(false);
  }, []);

  const selectFieldForSorting = useCallback((fieldForSort: FieldForSorting) => {
    setFieldForSorting(fieldForSort);
  }, [fieldForSorting]);

  const counterActiveTodos = useMemo(() => {
    const completedTodos = todos.filter(todo => todo.completed);

    return todos.length - completedTodos.length;
  }, [todos]);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (fieldForSorting) {
        case FieldForSorting.Active:
          return !todo.completed;

        case FieldForSorting.Completed:
          return todo.completed;

        case FieldForSorting.All:
        default:
          return true;
      }
    });
  }, [todos, fieldForSorting]);

  const hasTodos = todos.length > 0;

  const handleAddTodo = useCallback(async () => {
    if (user) {
      try {
        const newTitle = titleNewTodo.trim();

        if (newTitle) {
          setIsAdding(true);
          await addTodo(user.id, newTitle);
          await getTodosFromAPI();
          setTitleNewTodo('');
          setIsAdding(false);
        } else {
          setIsError(true);
          setTitleNewTodo('');
          setError('Title can`t be empty');
        }
      } catch {
        setIsError(true);
        setError('Unable to add a todo');
      } finally {
        setIsAdding(false);
        setTimeout(() => {
          setIsError(false);
        }, 3000);
      }
    }
  }, [titleNewTodo]);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleNewTodo(event.target.value);
    // console.log(111)
  };

  let deletingTodosId: number[] = [];

  const deleteOneTodo = async (todoId: number) => {
    try {
      deletingTodosId.push(todoId);
      // console.log(deletingTodosId)
      await deleteTodo(todoId);
    } catch {
      setIsError(true);
      setError('Unable to delete a todo');
    } finally {
      setTimeout(() => {
        setIsError(false);
      }, 3000);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    await deleteOneTodo(todoId);
    await getTodosFromAPI();
  };

  const completedTodosId = useMemo(() => {
    return todos
      .filter(todo => todo.completed)
      .map(todo => (todo.completed ? todo.id : 0));
  }, [todos]);

  const deleteCompletedTodos = async () => {
    if (completedTodosId.length > 0) {
      try {
        completedTodosId.forEach(async id => {
          await deleteOneTodo(id);
          deletingTodosId.push(id);
        });
        await getTodosFromAPI();
      } catch {
        setIsError(true);
        setError('Unable to delete all completed todo');
      } finally {
        setTimeout(() => {
          setIsError(false);
        }, 3000);
      }
    }
  };

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

          <AddTodoForm
            handleAddTodo={handleAddTodo}
            handleInput={handleInput}
            newTodoField={newTodoField}
            titleNewTodo={titleNewTodo}
            isAdding={isAdding}
          />
        </header>

        <TodoList
          todos={filteredTodos}
          handleDeleteTodo={handleDeleteTodo}
          isAdding={isAdding}
          tempTodo={tempTodo}
          deletingTodosId={deletingTodosId}
        />

        {hasTodos && (
          <Footer
            fieldForSorting={fieldForSorting}
            selectFieldForSorting={selectFieldForSorting}
            counterActiveTodos={counterActiveTodos}
            deleteCompletedTodos={deleteCompletedTodos}
            length={completedTodosId.length}
          />
        )}
      </div>

      <Error
        isError={isError}
        closeError={closeError}
        error={error}
      />
    </div>
  );
};
