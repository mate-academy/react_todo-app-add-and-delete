/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { getTodos, createTodo, removeTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { FilterCondition, ErorrMessage } from './types/FilterCondition';
import { Header } from './components/Main/Header';
import { TodoList } from './components/Main/TodoList';
import { Footer } from './components/Main/Footer';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todosList, setTodosList] = useState<Todo[]>([]);
  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [filterCondition, setFilterCondition] = useState(FilterCondition.ALL);
  const [isAdding, setIsAdding] = useState(false);
  const [tempNewTask, setTempNewTask] = useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  if (isError) {
    setTimeout(() => setIsError(false), 3000);
  }

  const getSelected = (allTodos: Todo[]): Todo[] => {
    return allTodos.filter(item => {
      switch (filterCondition) {
        case FilterCondition.ALL:
          return true;

        case FilterCondition.COMPLETED:
          return item.completed === true;

        case FilterCondition.ACTIVE:
          return item.completed === false;

        default: return true;
      }
    });
  };

  const addTodo = async (todoData: Omit<Todo, 'id'>) => {
    const fullTodoData = { ...todoData, userId: user?.id };

    try {
      const temporaryTodo = {
        ...todoData,
        id: 0,
      };

      setTempNewTask(temporaryTodo);

      setIsAdding(true);
      const newTodo = await createTodo(fullTodoData);

      setTodosList(currentTodos => [...currentTodos, newTodo]);
    } catch {
      setErrorText(ErorrMessage.ON_ADD);
    } finally {
      setTempNewTask(null);
      setIsAdding(false);
    }
  };

  const deleteTodo = async (idToDelete: number) => {
    try {
      setDeletingTodoIds(curr => [...curr, idToDelete]);

      await removeTodo(idToDelete);

      setTodosList((currentTodos: Todo[]) => currentTodos
        .filter(task => task.id !== idToDelete));
    } catch {
      setIsError(true);
      setErrorText(ErorrMessage.ON_DELETE);
    } finally {
      setDeletingTodoIds(currId => currId.filter(id => id !== idToDelete));
    }
  };

  const getCompletedTodos = (allTodos: Todo[]) => {
    const completedTodos = allTodos.filter(todo => todo.completed === true);

    return completedTodos.map(todo => todo.id);
  };

  const deleteCompletedTodos = () => {
    const todoIdToDelete = getCompletedTodos(todosList);

    todoIdToDelete.forEach(itemId => deleteTodo(itemId));
  };

  const isTodoExist = todosList.length > 0
    || filterCondition !== FilterCondition.ALL;

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user?.id)
        .then(getSelected)
        .then(setTodosList)
        .catch(() => {
          setTodosList([]);
          setIsError(true);
          setErrorText('Unable to upload a todo-list');
        });
    }
  }, [filterCondition]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosList={todosList}
          onSubmit={addTodo}
          newTodoField={newTodoField}
          setIsError={setIsError}
          setErrorText={setErrorText}
          isAdding={isAdding}
        />
        <TodoList
          todosList={todosList}
          tempNewTask={tempNewTask}
          onDelete={deleteTodo}
          deletingTodoIds={deletingTodoIds}
        />

        {isTodoExist && (
          <Footer
            todosList={todosList}
            filterCondition={filterCondition}
            setFilterCondition={setFilterCondition}
            deleteCompletedTodos={deleteCompletedTodos}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification', 'is-danger', 'is-light', 'has-text-weight-normal',
          { hidden: !isError },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setIsError(false)}
        />
        {errorText}
      </div>
    </div>
  );
};
