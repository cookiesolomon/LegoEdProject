import { Component, Input, OnInit } from '@angular/core';
import { StudentsViewService } from '../../../students-view.service';
import Student from '../../../../models/student-model';
import { MatTableDataSource } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import PointItem from '../../../../models/point-model';

@Component({
  selector: 'app-present-students',
  templateUrl: './present-students.component.html',
  styleUrls: ['./present-students.component.css']
})

export class PresentStudentsComponent implements OnInit {
  transactionForm: FormGroup;
  allPoints: PointItem[];
  pointsAfterChangeEvent: any[] = [];

  displayedColumns = ['firstName', 'lastName', 'form'];
  allStudents: Student[];
  dataSource: MatTableDataSource<Student>;
  title: String;

  constructor(
    private service: StudentsViewService,
    private fb: FormBuilder
  ) { this.createForm(); }

  createForm() {
    this.transactionForm = this.fb.group({
      selectedCatId: [null, Validators.required],
      selectedPointId: [null, Validators.required],
      comment: ''
    });
  }

  // Rebuild the point list every time the category changes.
  typeChanged() {
    const selCatId = this.transactionForm.get('selectedCatId').value;
    this.pointsAfterChangeEvent = this.allPoints.filter(p => p.catId == selCatId);
  }

  submitForm(stId) {
    let newTrans = {
      studentId: Number(stId),
      pointId: Number(this.transactionForm.value.selectedPointId),
      comment: this.transactionForm.value.comment
    };
    this.service.saveTransaction(newTrans).subscribe(data => 
      console.log('transaction saved', data));
  }

  ngOnInit() {
    this.title = 'Present Students';
    // get list of present students
    this.service.presentStudentsData$.subscribe(
      data => { this.dataSource = new MatTableDataSource(data); },
      error => { console.error(error); });
    this.service.getPresentStudents();
    // get list of all points for display
    this.service.displayPointsData$.subscribe(
      data => this.allPoints = data
    );
    this.service.getDisplayedPoints();
  }

}
