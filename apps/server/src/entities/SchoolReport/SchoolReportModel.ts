import { RequiredExceptFor } from '@usefaz/shared';
import type { Knex } from 'knex';

import type { DBConnector } from '~/database/dbConnector';
import { IBimester, ISchoolReport, ISchoolReportDiscipline } from '~/interfaces';
import callTrxOrKnexConnection from '~/utils/callTrxOrKnexConnection';

type SchoolReportBimester = {
  discipline_id: number;
  discipline_name: string;
  identifier: string;
  grade: number;
  rec_grade: number | null;
  absences: number | null;
};

export type SchoolReportRow = {
  discipline_id?: number;
  disciplineName: string;
  firstBimesterGrade?: number;
  firstBimesterRecGrade?: number | null;
  firstBimesterAbsences?: number | null;
  secondBimesterGrade?: number;
  secondBimesterRecGrade?: number | null;
  secondBimesterAbsences?: number | null;
  thirdBimesterGrade?: number;
  thirdBimesterRecGrade?: number | null;
  thirdBimesterAbsences?: number | null;
  fourthBimesterGrade?: number;
  fourthBimesterRecGrade?: number | null;
  fourthBimesterAbsences?: number | null;
};

const SchoolReportModel = (dbConnector: DBConnector) => {
  const filterSchoolReportBimesters = (schoolReportBimesters: SchoolReportBimester[]) => {
    const disciplineNames: string[] = schoolReportBimesters.reduce(
      (previousValue: string[], currentValue: SchoolReportBimester) => {
        if (!previousValue.includes(currentValue.discipline_name)) {
          previousValue.push(currentValue.discipline_name);
        }

        return previousValue;
      },
      []
    );

    const schoolReportRows = disciplineNames.reduce((newSchoolReportRows: SchoolReportRow[], currentValue) => {
      const schoolReportBimestersByDisciplineName = schoolReportBimesters.filter(
        (schoolReportBimester) => schoolReportBimester.discipline_name === currentValue
      );

      const newSchoolReportRow = schoolReportBimestersByDisciplineName.reduce<SchoolReportRow>(
        (newSchoolReportRow, schoolReportBimester) => {
          newSchoolReportRow.discipline_id = schoolReportBimester.discipline_id;

          if (schoolReportBimester.identifier === '1') {
            newSchoolReportRow.firstBimesterGrade = schoolReportBimester.grade;
            newSchoolReportRow.firstBimesterRecGrade = schoolReportBimester.rec_grade;
            newSchoolReportRow.firstBimesterAbsences = schoolReportBimester.absences;
          }

          if (schoolReportBimester.identifier === '2') {
            newSchoolReportRow.secondBimesterGrade = schoolReportBimester.grade;
            newSchoolReportRow.secondBimesterRecGrade = schoolReportBimester.rec_grade;
            newSchoolReportRow.secondBimesterAbsences = schoolReportBimester.absences;
          }

          if (schoolReportBimester.identifier === '3') {
            newSchoolReportRow.thirdBimesterGrade = schoolReportBimester.grade;
            newSchoolReportRow.thirdBimesterRecGrade = schoolReportBimester.rec_grade;
            newSchoolReportRow.thirdBimesterAbsences = schoolReportBimester.absences;
          }

          if (schoolReportBimester.identifier === '4') {
            newSchoolReportRow.fourthBimesterGrade = schoolReportBimester.grade;
            newSchoolReportRow.fourthBimesterRecGrade = schoolReportBimester.rec_grade;
            newSchoolReportRow.fourthBimesterAbsences = schoolReportBimester.absences;
          }

          return newSchoolReportRow;
        },
        { disciplineName: currentValue }
      );

      newSchoolReportRows.push(newSchoolReportRow);
      return newSchoolReportRows;
    }, []);

    return schoolReportRows;
  };

  return {
    async insert(
      schoolReport: RequiredExceptFor<ISchoolReport, 'id' | 'created_at' | 'updated_at'>,
      trx?: Knex.Transaction
    ) {
      const newSchoolReport = await callTrxOrKnexConnection('school_report', dbConnector, trx)
        .insert(schoolReport)
        .returning('*');

      return newSchoolReport;
    },

    getOneByStudentId(studentId: string) {
      return dbConnector
        .knexConnection<ISchoolReport>('school_report')
        .where('student_id', studentId)
        .orderBy('year', 'DESC')
        .first();
    },

    async getSchoolReportsById(id: string) {
      const schoolReportBimesters: SchoolReportBimester[] = await dbConnector
        .knexConnection<SchoolReportBimester>('school_report')
        .select([
          'discipline.id AS discipline_id',
          'discipline.name AS discipline_name',
          'bimester.identifier',
          'bimester.grade',
          'bimester.rec_grade',
          'bimester.absences',
        ])
        .innerJoin('school_report_discipline', 'school_report_discipline.school_report_id', 'school_report.id')
        .innerJoin('discipline', 'discipline.id', 'school_report_discipline.discipline_id')
        .innerJoin('bimester', 'bimester.school_report_discipline_id', 'school_report_discipline.id')
        .where('school_report.id', id);

      return filterSchoolReportBimesters(schoolReportBimesters);
    },

    async getOrInsertSchoolReport({ year, studentId }: { year: number; studentId: string }, trx?: Knex.Transaction) {
      const oldSchoolReport = await callTrxOrKnexConnection<ISchoolReport>('school_report', dbConnector, trx)
        .where('year', year)
        .where('student_id', studentId)
        .first();

      if (oldSchoolReport) {
        return oldSchoolReport;
      }

      const [newSchoolReport] = await callTrxOrKnexConnection<ISchoolReport>('school_report', dbConnector, trx)
        .insert({ year, student_id: studentId })
        .returning('*');

      return newSchoolReport;
    },

    async upsertStudentSchoolReportDiscipline(
      schoolReportDiscipline: RequiredExceptFor<ISchoolReportDiscipline, 'id' | 'created_at' | 'updated_at'>,
      trx?: Knex.Transaction
    ) {
      const [newSchoolReportDiscipline] = await callTrxOrKnexConnection<ISchoolReportDiscipline>(
        'school_report_discipline',
        dbConnector,
        trx
      )
        .insert(schoolReportDiscipline)
        .onConflict(['school_report_id', 'discipline_id'])
        .merge()
        .returning('*');

      return newSchoolReportDiscipline;
    },

    upsertStudentSchoolReportDisciplineBimester(
      schoolReportDisciplineBimesters: RequiredExceptFor<IBimester, 'id' | 'created_at' | 'updated_at'>[],
      trx?: Knex.Transaction
    ) {
      return callTrxOrKnexConnection<ISchoolReportDiscipline>('bimester', dbConnector, trx)
        .insert(schoolReportDisciplineBimesters)
        .onConflict(['school_report_discipline_id', 'identifier'])
        .merge()
        .returning('*');
    },
  };
};

export default SchoolReportModel;
