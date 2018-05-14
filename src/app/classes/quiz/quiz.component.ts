import { Component, OnInit } from '@angular/core';
import {Quiz} from '../../model/quiz.model';
import {ClassService} from '../class.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Alternative} from '../../model/alternative.model';
import {QuizAnswer} from '../../model/quiz-answer.model';
import {ProblemAnswer} from '../../model/problem-answer.model';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {

  quiz: Quiz = new Quiz();
  quizAnswer: QuizAnswer = new QuizAnswer();
  classId = 0; quizId = 0;

  constructor(private classService: ClassService, private route: ActivatedRoute, private snackBar: MatSnackBar, private router: Router) {
  }

  ngOnInit() {
    this.classId = Number(this.route.snapshot.paramMap.get('classId'));
    this.quizId = Number(this.route.snapshot.paramMap.get('quizId'));
    this.classService.getQuiz(this.classId, this.quizId).subscribe((quiz: any) => {
      if (quiz['switchTeacher']) {
        this.router.navigate(['/classes/' + this.classId + '/quiz/' + this.quizId + '/answers'], { replaceUrl: true });
      }
      if (quiz['switchStudent']) {
        this.router.navigate(['/classes/' + this.classId], { replaceUrl: true });
      }
      this.quiz = quiz;
      if (this.quiz.problems)
        this.quiz.problems.sort((a, b) => {if (a.problemId < b.problemId) {return(-1);} if (a.problemId > b.problemId) {return(1);} return(0);});
      this.prepareAnswer();
    });
  }

  trackByFn(index: any, item: any) {
    return index;
  }

  validProblems() {
    for (const p of this.quizAnswer.answers) {
      if ((p.openAnswer === '' || p.openAnswer == null) && Number(p.choiceId) === 0) {
        return(0);
      }
    }
    return(1);
  }

  prepareAnswer() {
    console.log(this.quiz);
    if (!this.quiz.problems)
      return;
    for (const p of this.quiz.problems) {
      this.quizAnswer.answers.push(new ProblemAnswer());
      this.quizAnswer.answers[this.quizAnswer.answers.length - 1].problemId = this.quizAnswer.answers.length;
    }
  }

  validDate() {
    if (!this.quiz)
      return false;
    return (new Date(this.quiz.dueDate) > new Date());
  }

  changeChoiceId(answer, alternatives) {
    console.log('wut:' + alternatives[Number(answer.choice) - 1].alternativeId);
    answer.choiceId = alternatives[Number(answer.choice) - 1].alternativeId;
    console.log('choosen:' + answer.choiceId);
  }

  submit() {
    this.classService.submit(this.classId, this.quizId, this.quizAnswer).subscribe((data) => {
      this.snackBar.open('Answer submitted', 'Dismiss', {duration: 2000});
      this.router.navigate(['/classes/' + this.classId], );
    });
  }

  onKeyPress($event) {
    if ($event.keyCode === 13) {
      this.submit();
    }
  }
}
