import { Component, OnInit } from '@angular/core';
import {Quiz} from '../../../model/quiz.model';
import {ClassService} from '../../class.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ShowCreateClassDialogComponent} from '../../show-create-class-dialog/show-create-class-dialog.component';
import {Problem} from '../../../model/problem.model';
import {Alternative} from '../../../model/alternative.model';

@Component({
  selector: 'app-create-quiz',
  templateUrl: './create-quiz.component.html',
  styleUrls: ['./create-quiz.component.scss']
})
export class CreateQuizComponent implements OnInit {

  quiz: Quiz = new Quiz();
  classId = 0;
  hour: string = "23:59";

  constructor(private classService: ClassService, private route: ActivatedRoute, private snackBar: MatSnackBar, private router: Router, public dialog: MatDialog) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.classId = Number(id);
  }

  validAlternatives(alternatives: Alternative[]) {
    for (const a of alternatives) {
      if (a == null || a.description === '') {
        return(0);
      }
    }
    return(1);
  }

  validProblems() {
    if (this.quiz.problems.length === 0) { return(0); }
    for (const p of this.quiz.problems) {
      if (p.description === '' || (p.kind === true && (!(Number(p.answer) > 0 && Number(p.answer) <= p.alternatives.length) || !this.validAlternatives(p.alternatives)))) {
        return(0);
      }
    }
    return(1);
  }

  addAlternative(problem) {
    problem.alternatives.push(new Alternative());
  }

  trackByFn(index: any, item: any) {
    return index;
  }

  removeAlternative(problem, j) {
    if (Number(problem.answer) > j + 1) {
      problem.answer = (Number(problem.answer) - 1).toString();
    } else if (Number(problem.answer) === j + 1) {
      problem.answer = '0';
    }
    problem.alternatives.splice(j, 1);
  }

  createProblem() {
    this.quiz.problems.push(new Problem());
  }

  removeProblem(i) {
    this.quiz.problems.splice(i, 1);
  }

  putIndexes(quiz: Quiz) {
    let i = 1;
    for (let p of quiz.problems) {
      p.problemId = i;
      if (p.kind) {
        let j = 1;
        for (let a of p.alternatives) {
          a.alternativeId = j;
          j += 1;
        }
      }
      i += 1;
    }
  }

  create() {
    this.putIndexes(this.quiz);
    console.log(this.quiz);
    this.quiz.dueDate.setHours(parseInt(this.hour.split(':')[0]));
    this.quiz.dueDate.setMinutes(parseInt(this.hour.split(':')[1]));
    if (this.quiz.dueDate <= new Date()) {
      this.snackBar.open('Please choose a valid due date', 'Dismiss', {duration: 2000});
      return;
    }
    this.classService.createQuiz(this.quiz, this.classId).subscribe((quiz) => {
      this.snackBar.open('Created quiz', 'Dismiss', {duration: 2000});
      this.router.navigate(['/classes/' + this.classId], );
    });
  }

  onKeyPress($event) {
    if ($event.keyCode === 13) {
      this.create();
    }
  }
}
