import { Component } from '@angular/core';
import { CoursesService } from './courses.service';
import { Observable } from 'rxjs';
import { Course } from './models';
import { MatDialog } from '@angular/material/dialog';
import { CoursesDialogComponent } from './components/courses-dialog/courses-dialog.component';
import Swal from 'sweetalert2';
import { generarRandomId } from 'src/app/shared/helpers';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent {
  courses$: Observable<Course[]>;

  constructor(private coursesService: CoursesService, private matDialog: MatDialog) {

    this.courses$ = this.coursesService.getCourses$()
  }

  addCourse(): void {
    this.matDialog.open(CoursesDialogComponent).afterClosed().subscribe({
      next: (result) => {
        if (result) {
          // const randomId = parseInt(generarStringRandom, 10); // Adjust the length as needed

          this.courses$ = this.coursesService.createCourse$({
            id: generarRandomId(),
            name: result.name,
            startDate: result.startDate,
            endDate: result.endDate,
            description: result.description,
          });
        }
      },
    });
  }

  onEditCourse(courseId: number): void {
    this.matDialog.open(CoursesDialogComponent, {
      data: courseId,
    }).afterClosed().subscribe({
      next: (v) => {
        if (!!v) {
          this.courses$ = this.coursesService.editCourse$(courseId, v);
        }
      }
    });
  }

  onDeleteCourse(courseId: number): void {
    Swal.fire({
      text: '¿Está seguro de que desea eliminar este curso?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.courses$ = this.coursesService.deleteCourse$(courseId);
        Swal.fire('', 'El curso ha sido eliminado', 'success');
      }
    });
  }
}
