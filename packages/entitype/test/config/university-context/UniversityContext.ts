import { DbCollection, DbSet, EntitypeContext } from '../../../src';
import { Course } from './Course';
import { Instructor } from './Instructor';
import { Student } from './Student';

export class UniversityContext extends EntitypeContext {

  @DbCollection(() => Student)
  students: DbSet<Student>;

  @DbCollection(() => Course)
  courses: DbSet<Course>;

  @DbCollection(() => Instructor)
  instructors: DbSet<Instructor>;
}
