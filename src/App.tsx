/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import { getTodos, createTodo, deleteTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoErrorNotification } from './components/TodoErrorNotification';
import { TodoFooter } from './components/TodoFooter';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { SortType } from './types/SortType';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const user = useContext(AuthContext);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [isError, setIsError] = useState<string | null>(null);
  const [sortType, setSortType] = useState(SortType.ALL);
  const [isAdding, setIsAdding] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [title, setTitle] = useState('');
  const [isRemoving, setIsRemoving] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);

  const completedTodosIds = [...todos].filter(todo => todo.completed)
    .map(todo => todo.id);

  const getFilteredTodos = () => {
    let filteredTodos = [...todos];

    switch (sortType) {
      case SortType.ACTIVE:
        filteredTodos = filteredTodos.filter(todo => !todo.completed);
        break;
      case SortType.COMPLETED:
        filteredTodos = filteredTodos.filter(todo => todo.completed);
        break;

      default:
    }

    return filteredTodos;
  };

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newTodoTitle) {
      setIsError('Title can\'t be empty');
    } else {
      setIsAdding(true);
      setTitle(newTodoTitle);
      createTodo(newTodoTitle, user.id, false)
        .then(() => (setIsAdding(false)))
        .catch(error => {
          setIsError(`${error}: Unable to add a todo`);
          setIsAdding(false);
        });
      setNewTodoTitle('');
    }
  };

  const handleTodoDeleteButton = (id: number) => {
    setIsRemoving(true);
    setSelectedTodoId(id);
    deleteTodo(id)
      .then(() => setIsRemoving(false))
      .catch(error => {
        setIsError(`${error}: Unable to delete a todo`);
        setIsRemoving(false);
      });
  };

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(todoFromServer => setTodos(todoFromServer))
        .catch(error => setIsError(`${error}: Unable to loading a todos`));
    }
  }, [todos, isAdding]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          isAdding={isAdding}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          handleSubmitForm={handleSubmitForm}
        />

        {todos.length > 0 && (
          <TodoList
            todos={getFilteredTodos()}
            isAdding={isAdding}
            userId={user?.id || 0}
            title={title}
            isRemoving={isRemoving}
            selectedTodoId={selectedTodoId}
            completedTodosIds={completedTodosIds}
            handleTodoDeleteButton={handleTodoDeleteButton}
          />
        )}

        {todos.length > 0 && (
          <TodoFooter
            setSortType={setSortType}
            todos={getFilteredTodos()}
            setIsRemoving={setIsRemoving}
            completedTodosIds={completedTodosIds}
            setIsError={setIsError}
          />
        )}
      </div>

      <TodoErrorNotification
        isError={isError}
        setIsError={setIsError}
      />
    </div>
  );
};
