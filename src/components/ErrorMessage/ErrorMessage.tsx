import { ErrorSpec } from '../../types/ErrorSpec';

type Props = {
  error: ErrorSpec | null;
};

export const ErrorMessage: React.FC<Props> = ({ error }) => {
  const renderErrorMessage = () => {
    switch (error) {
      case ErrorSpec.NOT_LOADED:
        return (
          <span>
            Unable to load todos
            <br />
          </span>
        );

      case ErrorSpec.EMPTY_TITLE:
        return (
          <span>
            Title should not be empty
            <br />
          </span>
        );

      case ErrorSpec.NOT_ADDED:
        return (
          <span>
            Unable to add a todo
            <br />
          </span>
        );

      case ErrorSpec.NOT_DELETED:
        return (
          <span>
            Unable to delete a todo
            <br />
          </span>
        );

      case ErrorSpec.NOT_UPDATED:
        return (
          <span>
            Unable to update a todo
            <br />
          </span>
        );

      default:
        return <></>;
    }
  };

  return renderErrorMessage();
};
