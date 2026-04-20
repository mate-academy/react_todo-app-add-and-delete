import React, { useContext } from 'react';
import { TodoContext } from '../context/TodoContext';
import { ERROR_TYPE } from '../consts/constants';

export const ErrorNotification: React.FC = () => {
  // Pegamos o estado do erro e a função de fechar do Contexto
  const { error, handleCloseError } = useContext(TodoContext);

  // Mapeamento das mensagens para cada tipo de erro
  const errorMessages = {
    [ERROR_TYPE.LOAD]: 'Unable to load todos',
    [ERROR_TYPE.TITLE]: 'Title should not be empty',
    [ERROR_TYPE.ADD]: 'Unable to add a todo',
    [ERROR_TYPE.DELETE]: 'Unable to delete a todo',
    [ERROR_TYPE.UPDATE]: 'Unable to update a todo',
    [ERROR_TYPE.NONE]: '',
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger ${
        error === ERROR_TYPE.NONE ? 'hidden' : ''
      } is-light has-text-weight-normal`}
    >
      {/* ESTE É O BOTÃO DE FECHAR:
        Ele precisa do onClick={handleCloseError}
      */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleCloseError}
      />

      {/* Exibe a mensagem baseada no estado atual do erro */}
      {errorMessages[error]}
    </div>
  );
};
