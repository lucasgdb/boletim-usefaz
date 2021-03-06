type Status = 'PENDING' | 'REFUSED' | 'CHANGED';

interface IStudentPasswordRecoveryRequest {
  id: string;
  RM: string;
  email: string;
  status: Status;
  created_at: string;
  updated_at: string;
}

export default IStudentPasswordRecoveryRequest;
