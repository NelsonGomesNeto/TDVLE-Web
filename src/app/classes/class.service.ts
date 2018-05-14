import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Class} from '../model/class.model';
import {Constants} from '../shared/constants';
import {Quiz} from '../model/quiz.model';
import {Activity} from "../model/activity.model";

@Injectable()
export class ClassService {

  constructor(private http: HttpClient) {

  }

  enterClass(classAccessCode: string) {
    return this.http.post(Constants.url + '/class/enter', {classAccessCode});
  }

  createClass(clazz: Class) {
    return this.http.post(Constants.url + '/class/create', clazz);
  }

  getClasses(max, offset) {
    return this.http.get(Constants.url + '/class?max=' + max + '&offset=' + offset);
  }

  getClassesCount() {
    return this.http.get(Constants.url + '/class/count');
  }

  getClass(id) {
    return this.http.get(Constants.url + '/class/' + id);
  }

  createQuiz(quiz: Quiz, classId) {
    return this.http.post(Constants.url + '/class/' + classId + '/quiz/create', quiz);
  }

  createActivity(activity: Activity, classId) {
    return this.http.post(Constants.url + '/class/' + classId + '/activity/create', activity);
  }

  getActivity(id) {
    return this.http.get(Constants.url + '/activity/' + id);
  }

  getSubmissions(id) {
    return this.http.get(Constants.url + '/activity/' + id + '/submissions');
  }

  sendSubmission(id, submissions) {
    return this.http.post(Constants.url + '/activity/' + id + '/submissions', submissions);
  }
}
