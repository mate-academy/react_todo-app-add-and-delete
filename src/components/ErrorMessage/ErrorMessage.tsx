import { ErrorText } from '../../helpers/ErrorText';
import { ErrorSpec } from '../../types/ErrorSpec';

type Props = {
  error: ErrorSpec | null;
};

export const ErrorMessage: React.FC<Props> = ({ error }) => {
  return (
    <span>
      {ErrorText(error)}
      <br />
    </span>
  );
};
