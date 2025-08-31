import { useEffect, useState } from 'react';
import { TodoHeader } from '../TodoHeader/TodoHeader';
import { Todo } from '../../types/Todo';
import { deleteTodo, getTodos, postTodo } from '../../api/todos';
import { TodoList } from '../TodoList/TodoList';
import { ErrorNotification } from '../ErrorNotification/ErrorNotification';
import { TodoFooter } from '../TodoFooter/TodoFooter';
import { FilterOptions } from '../../types/FilterOptions';
import { Errors } from '../../types/Errors';
import { USER_ID } from '../../utils/preferences';

export const Todos: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.NoError);
  const [isErrorState, setIsErrorState] = useState(false);
  const [filterOption, setFilterOption] = useState<FilterOptions>(
    FilterOptions.All,
  );
  const [processingId, setProcessingId] = useState<number>(0);
  const [isTodoDeleting, setIsTodoDeleting] = useState(false);
  const [isInputProcessing, setIsInputProcessing] = useState(false);

  const isAllCompleted: boolean = todos.every(todo => todo.completed);
  const todosCompleted: Todo[] = todos.filter(todo => todo.completed);
  const todosAmount: number = todos.length;
  const todosLeft: number = todosAmount - todosCompleted.length;
  const isVisibleTodoList: boolean = !isLoading && todos.length > 0;
  const isThereCoplited: boolean = todosAmount === todosLeft;

  const handleFilterOption = (option: FilterOptions) => {
    setFilterOption(option);
  };

  const handleHideError = () => {
    setErrorMessage(Errors.NoError);
  };

  const handleDeleteTodo = async (id: number) => {
    const afterDeletingTodo = todos.filter(todo => todo.id !== id);

    setProcessingId(id);

    try {
      setIsTodoDeleting(true);
      await deleteTodo(id);
      setTodos(afterDeletingTodo);
    } catch (error) {
      setErrorMessage(Errors.UnableDeleteTodo);
    } finally {
      setIsTodoDeleting(false);
      setProcessingId(0);
    }
  };

  const handleDeleteCopmleted = async () => {
    setIsTodoDeleting(true);

    try {
      await Promise.all(
        todosCompleted.map(async deletingTodo => {
          await deleteTodo(deletingTodo.id);
          setTodos(prev => prev.filter(todo => todo.id !== deletingTodo.id));
        }),
      );
    } catch (error) {
      setErrorMessage(Errors.UnableDeleteTodo);
    } finally {
      setIsTodoDeleting(false);
    }
  };

  const handleSubmit = async (inputedTitle: string): Promise<boolean> => {
    if (inputedTitle === '') {
      setErrorMessage(Errors.NoTitle);

      return false;
    }

    const prevTodo = [...todos];
    const newTodo: Todo = {
      id: todosAmount + 1,
      userId: USER_ID,
      title: inputedTitle,
      completed: false,
    };

    setProcessingId(newTodo.id);
    const { id, ...normilizedTodo }: Todo = newTodo;

    const afterAddingTodo = [...todos, newTodo];

    try {
      setIsInputProcessing(true);
      setTodos(afterAddingTodo);
      const afterPostitngTodo: Todo = await postTodo(normilizedTodo);
      const newStateTodo: Todo[] = [...prevTodo, afterPostitngTodo];

      setTodos(newStateTodo);

      return true;
    } catch (error) {
      setErrorMessage(Errors.UnableAddTodo);
      setIsErrorState(true);
      setTodos(prevTodo);

      return false;
    } finally {
      setIsInputProcessing(false);
      setProcessingId(0);
    }
  };

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const fetchedTodos = await getTodos();

      setTodos(fetchedTodos);
    } catch (error) {
      setErrorMessage(Errors.ServerError);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    let autoHideError: number;

    if (errorMessage) {
      autoHideError = window.setTimeout(() => {
        setErrorMessage(Errors.NoError);
      }, 3000);
    }

    return () => {
      window.clearTimeout(autoHideError);
    };
  }, [errorMessage]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          isAllCompleted={isAllCompleted}
          todosAmount={todosAmount}
          isInputProcessing={isInputProcessing}
          handleSubmit={handleSubmit}
          isErrorState={isErrorState}
        />
        {isVisibleTodoList && (
          <TodoList
            todos={todos}
            filterOption={filterOption}
            handleDeleteTodo={handleDeleteTodo}
            isTodoDeleting={isTodoDeleting}
            isInputProcessing={isInputProcessing}
            processingId={processingId}
          />
        )}
        {!!todos.length && (
          <TodoFooter
            todosLeft={todosLeft}
            isThereCoplited={isThereCoplited}
            isInputProcessing={isInputProcessing}
            handleFilterOption={handleFilterOption}
            handleDeleteCopmleted={handleDeleteCopmleted}
            filterOption={filterOption}
          />
        )}
      </div>
      <ErrorNotification
        errorMessage={errorMessage}
        handleHideError={handleHideError}
      />
    </div>
  );
};
