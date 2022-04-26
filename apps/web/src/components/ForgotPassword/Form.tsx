import { errorConfig, getError } from '@usefaz/shared';
import { Notification } from '@usefaz/components';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router';
import { useMutation } from 'relay-hooks';

import SendRecoveryEmailMutation from '~/modules/student/SendRecoveryEmailMutation';
import { SendRecoveryEmailMutation as SendRecoveryEmailMutationType } from '~/modules/student/__generated__/SendRecoveryEmailMutation.graphql';
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

  const [loginMutation, { loading }] = useMutation<SendRecoveryEmailMutationType>(SendRecoveryEmailMutation, {
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

    loginMutation({
      variables: {
        input: { RM, email },
      },
      onCompleted() {
        enqueueSnackbar('Solicitação de recuperação de senha enviada com sucesso.', { variant: 'success' });
        navigate('/solicitacao-enviada');
      },
      onError() {
        enqueueSnackbar('Falha ao enviar a solicitação de recuperação de senha.', { variant: 'error' });
      },
    });
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
