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
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => setErrorMessage('Something went wrong'));
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

  const addTodoOn = async () => {
    setIsAdding(true);

    if (user) {
      try {
        setTempTodo({
          id: 0,
          userId: user?.id,
          title: title.trim(),
          completed: false,
        });

        const newTodo = await addTodo({
          userId: user?.id,
          title: title.trim(),
          completed: false,
        });

        setTitle('');

        setTodos(current => [
          ...current,
          {
            id: newTodo.id,
            userId: newTodo.userId,
            title: newTodo.title,
            completed: newTodo.completed,
          },
        ]);
      } catch (error) {
        // eslint-disable-next-line max-len
        setErrorMessage('Something went wrong.Unable to add a todo');
      } finally {
        setIsAdding(false);
        setTempTodo(null);
      }
    }
  };

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!title.trim()) {
        setErrorMessage('Title can\'t be empty');

        return;
      }

      addTodoOn();
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
      setErrorMessage('Something went wrong.Unable to delete a todo');
    } finally {
      setTodoIdForDeleting(currentTodoIds => (
        currentTodoIds.filter(id => id !== todoId)));
    }
  }, []);

  const cleanCompletedTodos = useCallback(() => {
    todos.forEach(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
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
          submitForm={handleSubmit}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              todoIdForDeleting={todoIdForDeleting}
              deleteTodo={deleteTodo}
            />

            {tempTodo
              && (
                <TodoItem
                  todo={tempTodo}
                  isAdding={isAdding}
                  deleteTodo={removeTodo}
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
