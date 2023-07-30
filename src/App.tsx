import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import debounce from 'lodash.debounce';

import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import * as postService from './api/todos';
import { FilterOption } from './types/FilterOption';

const USER_ID = 11083;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentTodos, setCurrentTodos] = useState<Todo[]>(todos);
  const [filterOption, setFilterOption] = useState<FilterOption>(
    FilterOption.ALL,
  );
  const [error, setError] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletedId, setDeletedId] = useState<number[] | null>(null);

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const clearError = useCallback(
    debounce(setError, 3000),
    [],
  );

  useEffect(() => {
    postService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setError('Unable to get todos');
        clearError('');
      });
  }, []);

  useMemo(() => {
    switch (filterOption) {
      case FilterOption.ACTIVE:
        setCurrentTodos(todos.filter(todo => !todo.completed));
        break;
      case FilterOption.COMPLETED:
        setCurrentTodos(todos.filter(todo => todo.completed));
        break;
      default:
        setCurrentTodos(todos);
        break;
    }
  }, [filterOption, todos]);

  const deleteTodo = async (todoId: number) => {
    try {
      await postService.deleteTodo(todoId);

      setTodos(curTodos => curTodos.filter(todo => todo.id !== todoId));
    } catch (e) {
      setError('Unable to delete a todo');
      clearError('');
    }
  };

  const deleteCompletedTodos = () => {
    setDeletedId(completedTodos.map(todo => todo.id));
  };

  const addTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
    const maxId = Math.max(0, ...todos.map(post => post.id));
    const id = maxId !== 0
      ? maxId + 1
      : 250000;

    setTempTodo({
      id: 0,
      userId,
      title,
      completed,
    });

    return postService.createTodo({
      id,
      userId,
      title,
      completed,
    })
      .then(newTodo => setTodos(curTodos => [...curTodos, newTodo]))
      .catch((e) => {
        setError('Unable to add a todo');
        clearError('');
        throw e;
      })
      .finally(() => setTempTodo(null));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const isClearBtn = activeTodos.length !== todos.length
    && !!completedTodos.length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isTodos={!!todos.length}
          activeTodos={activeTodos}
          addTodo={addTodo}
          userId={USER_ID}
          setError={setError}
          clearError={clearError}
        />
        {!!todos.length && (
          <>
            <TodoList
              todos={currentTodos}
              deleteTodo={deleteTodo}
              todoItem={tempTodo}
              deletedId={deletedId}
            />
            <Footer
              activeTodos={activeTodos}
              filterOption={filterOption}
              setFilterOption={setFilterOption}
              isClearBtn={isClearBtn}
              deleteCompletedTodos={deleteCompletedTodos}
            />
          </>
        )}
      </div>

      <ErrorMessage
        setError={setError}
        error={error}
      />
    </div>
  );
};
