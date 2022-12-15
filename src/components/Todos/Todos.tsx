import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import classNames from 'classnames';
import { AuthContext } from '../Auth/AuthContext';
import { Todo } from '../../types/Todo';
import { deleteTodo, getTodos, postTodo } from '../../api/todos';
import { Notification } from '../Notification';
import { TodoAddForm } from '../TodoAddForm';
import { TodoList } from '../TodoList';
import { BottomBar } from '../BottomBar';
import { FilterType } from '../../types/FilterType';
import { ErrorType } from '../../types/ErrorType';

export const Todos: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorType>(ErrorType.None);
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [modifyingTodosId, setModifyingTodosId] = useState<number[]>([11111]);

  const user = useContext(AuthContext);

  const loadTodos = useCallback(async () => {
    if (user) {
      try {
        setTodos(await getTodos(user.id));
      } catch {
        setErrorMessage(ErrorType.Load);
      }
    }
  }, []);

  useEffect(() => {
    loadTodos().then();
  }, [user]);

  const visibleTodos = useMemo(() => (
    todos.filter(todo => {
      switch (filter) {
        case FilterType.All:
          return true;

        case FilterType.Active:
          return !todo.completed;

        case FilterType.Completed:
          return todo.completed;

        default:
          return true;
      }
    })
  ), [filter, todos]);

  const activeTodos = useMemo(() => (
    todos.filter(todo => !todo.completed)
  ), [todos]);

  const completedTodos = useMemo(() => (
    todos.filter(todo => todo.completed)
  ), [todos]);

  const onTodoAdd = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (user && newTodoTitle.trim()) {
      const newTodo: Omit<Todo, 'id'> = {
        userId: user.id,
        title: newTodoTitle,
        completed: false,
      };

      try {
        setIsAdding(true);
        await postTodo(newTodo);
        await loadTodos();
      } catch {
        setErrorMessage(ErrorType.Add);
      } finally {
        setNewTodoTitle('');
        setIsAdding(false);
      }
    } else {
      setErrorMessage(ErrorType.EmptyTitle);
    }
  };

  const onTodoDelete = async (todosId: number[]) => {
    try {
      setModifyingTodosId(current => [...current, ...todosId]);
      await Promise.all(todosId.map(todoId => (
        deleteTodo(todoId)
      )));
      await loadTodos();
    } catch {
      setErrorMessage(ErrorType.Delete);
    } finally {
      setModifyingTodosId([]);
    }
  };

  return (
    <>
      <div className="todoapp__content">
        <header className="todoapp__header">
          {!todos.length || (
            // eslint-disable-next-line jsx-a11y/control-has-associated-label
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={classNames(
                'todoapp__toggle-all',
                {
                  active: !activeTodos.length,
                },
              )}
            />
          )}
          <TodoAddForm
            newTodoTitle={newTodoTitle}
            onTodoTitleChange={setNewTodoTitle}
            onTodoAdd={onTodoAdd}
            isAdding={isAdding}
          />
        </header>

        {(todos.length || isAdding) && (
          <>
            <TodoList
              todos={visibleTodos}
              isAdding={isAdding}
              modifyingTodosId={modifyingTodosId}
              newTodoTitle={newTodoTitle}
              onTodoDelete={onTodoDelete}
            />
            <BottomBar
              filter={filter}
              onSetFilter={setFilter}
              activeTodosCount={activeTodos.length}
              completedTodos={completedTodos}
              onTodoDelete={onTodoDelete}
            />
          </>
        )}
      </div>

      <Notification
        errorMessage={errorMessage}
        onHideErrMessage={setErrorMessage}
      />
    </>
  );
};
