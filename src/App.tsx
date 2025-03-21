/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodos, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoHeader } from './component/TodoHeader/TodoHeader';
import { TodoFooter } from './component/TodoFooter/TodoFooter';
import { Status } from './types/Status';
import { TodoList } from './component/TodoList/TodoList';
import { TodoErrorNotification } from './component/TodoErrorNotification/TodoErrorNotification';

export const App: React.FC = () => {

  enum Errors {
    'titleError' = 'Title should not be empty',
    'addTodoError' = 'Unable to add a todo',
    'updateTodoError' = 'Unable to update a todo',
    'loadTodoError' = 'Unable to load todos',
    'deleteTodoError' = 'Unable to delete a todo'
  }


  const [hasTitleError, setHasTitleError] = useState(false);
  const [loadTodoError, setLoadTodoError] = useState(false);
  const[addTodoError , setAddTodoError] = useState(false);
  const[deleteTodoError , setDeleteTodoError] = useState(false);


  function handleError(type: string , boolean : boolean) {
    switch (type) {
      case 'hasTitleError':
        setHasTitleError(boolean);
        break;
      case 'loadTodoError':
        setLoadTodoError(boolean);
        break;
      case 'addTodoError':
        setAddTodoError(boolean);
        break;
      case 'deleteTodoError':
        setDeleteTodoError(boolean);
        break;
      default:
        console.error('Unknown error type');
    }
  }

  function handleResetError(){
    handleError('hasTitleError' , false);
    handleError('loadTodoError',false);
    handleError('addTodoError',false)
    handleError('deleteTodoError',false)
  }


  const [status, setStatus] = useState('all');
  const errorTimerRef = useRef<number | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo| null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [inputRefTarget, setInputRefTarget] = useState<HTMLInputElement | null>(null);


  if (!USER_ID) {
    return <UserWarning />;
  }

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        handleError('loadTodoError' , true);
        resetError();
      });
  }, []);

  const resetError = () => {
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
    }
    errorTimerRef.current = window.setTimeout(() => {
      handleResetError()
      errorTimerRef.current = null;
    }, 3000);
  };


  const hideErrors = () => {
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
      errorTimerRef.current = null;
    }
    handleResetError()
  };

  const getErrorMessage = () => {
    if (hasTitleError) return Errors.titleError;
    if (loadTodoError) return Errors.loadTodoError;
    if (addTodoError) return  Errors.addTodoError
    if (deleteTodoError)  return  Errors.deleteTodoError
    return '';
  };
  const isErrorHidden = () => !hasTitleError && !loadTodoError && !addTodoError && !deleteTodoError;



  const filteredTodos = todos.filter(todo => {
    if (status === Status.active) {
      return !todo.completed;
    }
    if (status === Status.completed) {
      return todo.completed;
    }
    return true;
  });


  function deleteTodo(todoId: number) {
    setLoadingTodoIds((prevState)=> [...prevState, todoId])

    return deleteTodos(todoId)
      .then(() => {
        setTodos(currentPosts => currentPosts.filter(todo => todo.id !== todoId));
        inputRefTarget?.focus();
      })
      .catch(() => {
        handleError('deleteTodoError' ,true)
        resetError()
        inputRefTarget?.focus();
        return

      })
      .finally(() => {
        setIsLoading(false);
        setLoadingTodoIds((prevState)=> prevState.filter((todo)=> todo !== todoId ))
      });
  }

  function deleteCompletedTodo(){
    const filteredTodos = todos.filter(todo => todo.completed)
    Promise.all(filteredTodos.map(todo => deleteTodo(todo.id)))
      .catch(() => {
        handleError('deleteTodoError' ,true)
      });
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <TodoHeader handleError={handleError}
                    setTodos={setTodos}
                    resetError={resetError}
                    setTempTodo={setTempTodo}
                    setIsLoading={setIsLoading}
                    isLoading={isLoading}
                    hasTitleError={hasTitleError}
                    loadTodoError={loadTodoError}
                    addTodoError={addTodoError}
                    deleteTodoError={deleteTodoError}
                    hideErrors={hideErrors}
                    setInputRefTarget={setInputRefTarget}
                    inputRefTarget={inputRefTarget}
        />
        {(tempTodo || todos.length  > 0 ) &&    (
          <>
            <TodoList filteredTodos={filteredTodos}  tempTodo={tempTodo}  isLoading={isLoading}  deleteTodo={deleteTodo} loadingTodoIds={loadingTodoIds} />
            <TodoFooter todos={todos} status={status} setStatus={setStatus} deleteCompletedTodo={deleteCompletedTodo} />
          </>
        )}
        {/* Hide the footer if there are no todos */}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <TodoErrorNotification getErrorMessage={getErrorMessage} isErrorHidden={isErrorHidden} hideErrors={hideErrors} />

    </div>
  );
};
