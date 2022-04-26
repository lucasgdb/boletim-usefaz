import { errorConfig, getError } from '@usefaz/shared';
import { Notification } from '@usefaz/components';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router';
import { useMutation } from 'relay-hooks';

import StudentLoginMutation from '~/modules/student/StudentLoginMutation';
import { StudentLoginMutation as StudentLoginMutationType } from '~/modules/student/__generated__/StudentLoginMutation.graphql';
import RMInput from './RMinput';
import EmailInput from './EmailInput';

const OuterForm = styled.div`
  margin-top: 24px;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LoginButton = styled(Button)`
  && {
    color: #fafafa;
    border-radius: 4px;
    height: 56px;
    padding: 0;

    margin-top: 24px;
  }
`;

export default function Form() {
  const { enqueueSnackbar } = Notification.useSnackbar();

  const navigate = useNavigate();

  const [loginMutation, { loading }] = useMutation<StudentLoginMutationType>(StudentLoginMutation, {
    onError(errors) {
      const { notFound } = errorConfig.student;

      const studentNotFoundError = getError(errors, notFound.code);
      if (studentNotFoundError) {
        enqueueSnackbar('Aluno não encontrado. Por favor, tente novamente.', { variant: 'error' });
      }
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const RM = formData.get('RM').toString();
    if (!RM) {
      enqueueSnackbar('RM obrigatório.', { variant: 'error' });
      return;
    }

    const email = formData.get('email').toString();
    if (!email) {
      enqueueSnackbar('E-mail obrigatório.', { variant: 'error' });
      return;
    }

    navigate('/solicitacao-enviada');

    // loginMutation({
    //   variables: {
    //     input: { RM, email },
    //   },
    //   onCompleted: ({}) => {},
    // });
  };

  return (
    <OuterForm>
      <form onSubmit={handleSubmit}>
        <InputWrapper>
          <RMInput />
          <EmailInput />
        </InputWrapper>

        <LoginButton variant="contained" color="primary" type="submit" disabled={loading} fullWidth>
          Enviar
        </LoginButton>
      </form>
    </OuterForm>
  );
}
