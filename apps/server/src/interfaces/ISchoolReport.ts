interface ISchoolReport {
  id: string;
  year: number;
  student_id: string;
  created_at: string;
  updated_at: string;
}

export interface IDiscipline {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface ISchoolReportDiscipline {
  id: string;
  school_report_id: ISchoolReport['id'];
  discipline_id: IDiscipline['id'];
  created_at: string;
  updated_at: string;
}

export interface IBimester {
  id: string;
  school_report_discipline_id: ISchoolReportDiscipline['id'];
  identifier: number;
  grade: number;
  rec_grade?: number | null;
  absences: number;
  created_at: string;
  updated_at: string;
}

export default ISchoolReport;
