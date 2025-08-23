/* eslint-disable jsx-a11y/label-has-associated-control */
// import { useQuery } from '@tanstack/react-query';
import { deleteTodo, getTodos, postTodos, USER_ID } from '../../api/todos';
import { TodoList } from '../TodoList';
import { Footer } from '../Footer';
import { Header } from '../Header';
import { useEffect, useRef, useState } from 'react';
import { Errormessage } from '../Errormessage/Errormessage';
import { Todo } from '../../types/Todo';

export enum TodosStatus {
  ALL,
  ACTIVE,
  COMPLETED,
}

export enum ErrorMessages {
  LOAD_FAILED = 'Unable to load todos',
  ADD_FAILED = 'Unable to add a todo',
  UPDATE_FAILED = 'Unable to update a todo',
  DELETE_FAILED = 'Unable to delete a todo',
  EMPTY_TITLE = 'Title should not be empty',
  UNKNOWN_ERROR = 'An unknown error occurred',
}

export const TodoApp = () => {
  // const {
  //   data: todos,
  //   isLoading,
  //   isError,
  //   error,
  //   status
  // } = useQuery({
  //   queryKey: ['todos'],
  //   queryFn: getTodos,
  // });

  const [errorMessage, setErrorMessage] = useState('');
  const [isActive, setIsActive] = useState(TodosStatus.ALL);
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorTimer, setErrorTimer] = useState<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  // console.log(query.data);

  // Mutations
  // const mutation = useMutation({
  //   mutationFn: postTodo,
  //   onSuccess: () => {
  //     // Invalidate and refetch
  //     queryClient.invalidateQueries({ queryKey: ['todos'] });
  //   },
  // onError: (mutationError) => {
  //   if (mutationError.response.status === 422) {
  //     setErrorMessage(ErrorMessages.EMPTY_TITLE);
  //   } else {
  //     setErrorMessage(ErrorMessages.ADD_FAILED);
  //   }
  // },
  // });
  const handleSetErrorMessage = (message: string) => {
    setErrorMessage(message);

    if (errorTimer) {
      clearTimeout(errorTimer);
    }

    const newTimer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    setErrorTimer(newTimer);
  };

  useEffect(() => {
    inputRef.current?.focus();
    const loadTodos = async () => {
      try {
        const todosss = await getTodos();

        setTodoList(todosss);
      } catch (err) {
        handleSetErrorMessage(ErrorMessages.LOAD_FAILED);
      } finally {
      }
    };

    loadTodos();
  }, []);

  const handleClearErrorMessage = () => {
    setErrorMessage('');
  };

  const todosToRender = tempTodo ? [...todoList, tempTodo] : todoList;
  const visibleTodos = todosToRender.filter(todo => {
    switch (isActive) {
      case TodosStatus.ACTIVE:
        return !todo.completed;
      case TodosStatus.COMPLETED:
        return todo.completed;
      default:
        return true;
    }
  });

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };

  const addTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // const form = event.currentTarget;
    // const inputValue = (
    //   form.elements.namedItem('newTodoField') as HTMLInputElement
    // ).value;

    // if (inputValue.trim() === '') {
    // if (title.trim() === '') {
    //   handleSetErrorMessage(ErrorMessages.EMPTY_TITLE);
    // }

    if (!inputRef.current || !title.trim()) {
      handleSetErrorMessage(ErrorMessages.EMPTY_TITLE);

      return;
    }

    const newTodo = {
      id: 0,
      title: title.trim(),
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTodo);

    // method 1
    try {
      const savedTodo = await postTodos(newTodo);

      setTodoList(currentTodos => [...currentTodos, savedTodo]);

      setTitle('');
    } catch (err) {
      setTodoList(currentTodos => currentTodos.filter(todo => todo.id !== 0));
      handleSetErrorMessage(ErrorMessages.ADD_FAILED);
    } finally {
      setTempTodo(null);

      if (inputRef.current) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
    }

    // method 2
    // postTodos(tempTodo)
    //   .then(savedTodo => {
    //     setTodoList(current =>
    //       current.map(todo => (todo.id === 0 ? savedTodo : todo)),
    //     );
    //     setTitle('');
    //   })
    //   .catch(() => {
    //     setTodoList(current => current.filter(todo => todo.id !== 0));
    //     handleSetErrorMessage(ErrorMessages.ADD_FAILED);
    //   })
    //   .finally(() => {
    //     setIsAdding(false);
    //     setTimeout(() => {
    //       inputRef.current?.focus();
    //     }, 0);
    //   });
  };

  const removeTodo = async (todoId: number) => {
    setDeletingIds(currentIds => [...currentIds, todoId]);

    try {
      await deleteTodo(todoId);
      setTodoList(currentTodos =>
        currentTodos.filter(todo => todo.id !== todoId),
      );
    } catch (err) {
      setErrorMessage(ErrorMessages.DELETE_FAILED);
    } finally {
      setDeletingIds(currentIds => currentIds.filter(id => id !== todoId));

      inputRef.current?.focus();
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todoList.filter(todo => todo.completed);
    const idsToDelete = completedTodos.map(todo => todo.id);

    if (idsToDelete.length === 0) {
      return;
    }

    setDeletingIds(currentIds => [...currentIds, ...idsToDelete]);

    try {
      const results = await Promise.allSettled(
        completedTodos.map(todo => deleteTodo(todo.id)),
      );

      const successfullyDeletedIds = completedTodos
        .filter((_todo, index) => results[index].status === 'fulfilled')
        .map(todo => todo.id);

      if (results.some(result => result.status === 'rejected')) {
        setErrorMessage(ErrorMessages.DELETE_FAILED);
      }

      if (successfullyDeletedIds.length > 0) {
        setTodoList(currentTodos =>
          currentTodos.filter(
            todo => !successfullyDeletedIds.includes(todo.id),
          ),
        );
      }
    } catch (err) {
      setErrorMessage(ErrorMessages.DELETE_FAILED);
    } finally {
      setDeletingIds(currentIds =>
        currentIds.filter(id => !idsToDelete.includes(id)),
      );

      if (inputRef.current) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addTodo={addTodo}
          title={title}
          setTitle={handleChangeTitle}
          isAdding={tempTodo !== null}
          ref={inputRef}
        />

        <TodoList
          todos={visibleTodos}
          removeTodo={removeTodo}
          deletingIds={deletingIds}
        />

        {/* Hide the footer if there are no todos */}
        {todoList.length > 0 && (
          <Footer
            itemsCount={
              todoList.filter(todo => todo.completed === false).length
            }
            activeStatus={isActive}
            onStatusChange={setIsActive}
            noCompletedTodos={!todoList.find(todo => todo.completed === true)}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <Errormessage
        errorMessage={errorMessage}
        onClose={handleClearErrorMessage}
        // isError={isError}
      />
    </div>
  );
};
