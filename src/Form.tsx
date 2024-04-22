import { useContext, useEffect, useState } from 'react';
import { Todo } from './types/Todo';
import { ContextTodos } from './TodoContext';
import { deleteTodo, patchTodo } from './api/todos';

type Props = {
  todo: Todo;
  editSelectedInput: React.RefObject<HTMLInputElement>;
};

export const Form = ({ todo, editSelectedInput }: Props) => {
  const {
    isEdited,
    setIsEdited,
    setIsLoading,
    todos,
    setVisibleErr,
    setErrMessage,
    resetErr,
    setTodos,
  } = useContext(ContextTodos);

  //for focus on edited todo
  useEffect(() => {
    if (editSelectedInput.current) {
      editSelectedInput.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdited]);

  const [editedTitle, setEditedTitle] = useState(todo.title);

  const handleKeyUpInputEdit = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEdited(null);
      setEditedTitle('');
    }
  };

  const updateTodo = async (updatedTodo: Todo) => {
    try {
      setIsLoading([updatedTodo.id]);
      const todoToUpdate = todos.find(tod => tod.id === updatedTodo.id);

      let newTodo: Todo = {
        id: 0,
        userId: 0,
        title: '',
        completed: false,
      };

      const trimedTitle = editedTitle.trim();

      if (trimedTitle === '' && todoToUpdate) {
        setIsLoading([updatedTodo.id]);
        setVisibleErr(true);
        setErrMessage('Title should not be empty');
        resetErr();
        await deleteTodo(todoToUpdate.id)
          .then(() => {
            setTodos(prevTodos => {
              return prevTodos.filter(t => t.id !== todoToUpdate.id);
            });
          })
          .catch(() => {
            setVisibleErr(true);
            setErrMessage('Unable to delete a todo');
            resetErr();

            return;
          });

        return;
      }

      if (trimedTitle === todo.title) {
        setIsEdited(null);
        setEditedTitle('');
      }

      if (todoToUpdate && trimedTitle === todoToUpdate.title) {
        setEditedTitle('');

        return;
      }

      if (todoToUpdate) {
        newTodo = { ...todoToUpdate, title: trimedTitle };
      }

      await patchTodo(newTodo)
        .then(response => {
          setTodos(prevState => {
            const updatedTodos = [...prevState];

            const findTodoIndex = updatedTodos.findIndex(
              t => t.id === response.id,
            );

            if (findTodoIndex !== -1) {
              updatedTodos[findTodoIndex] = response;
            } else {
              updatedTodos.push(response);
            }

            return updatedTodos;
          });

          setIsEdited(null);
        })
        .catch(() => {
          setVisibleErr(true);
          setErrMessage('Unable to update a todo');
          resetErr();
        });
    } finally {
      setIsLoading([]);
    }
  };

  const handleEditSubmit = (event: React.FormEvent, t: Todo) => {
    event.preventDefault();
    updateTodo(t);
  };

  const handleBlurSubmit = (
    event: React.FocusEvent<HTMLInputElement, Element>,
    t: Todo,
  ) => {
    event.preventDefault();
    if (editedTitle !== todo.title) {
      updateTodo(t);
    }

    if (editedTitle === todo.title) {
      setIsEdited(null);
    }
  };

  return (
    <form onSubmit={event => handleEditSubmit(event, todo)}>
      <input
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder={todo.title}
        value={editedTitle}
        onChange={event => setEditedTitle(event.target.value)}
        onKeyUp={handleKeyUpInputEdit}
        onBlur={event => handleBlurSubmit(event, todo)}
        ref={editSelectedInput}
      />
    </form>
  );
};
