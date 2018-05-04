import { Component, OnInit } from '@angular/core';
import {Post} from '../model/post.model';
import {PostService} from "./post.service";
import {MatDialog, PageEvent} from '@angular/material';
import {User} from "../model/user.model";
import {UserService} from "../user/user.service";
import {Like} from "../model/like.model";
import {ImageUploadComponent} from '../image-upload/image-upload.component';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  length = 0;
  pageSize = 5;
  pageSizeOptions = [5, 10, 25, 100];
  pageIndex = 0;
  pageEvent: PageEvent = new PageEvent;

  authenticatedUser: User = new User();
  postObj: Post = new Post();
  posts: Post[] = [];

  constructor(private postService: PostService, private userService: UserService, private dialog: MatDialog, private route: ActivatedRoute, private router: Router) {
    let param = route.snapshot.queryParams['page'];
    if (!param) {
      param = 0;
      this.navigate(param);
    }
    this.pageIndex = param;
    this.postObj.description = route.snapshot.queryParams['content'] || "";
    this.postObj.image = route.snapshot.queryParams['imageUrl'] || "";
    this.userService.getAuthenticatedUser().subscribe((user: User) => {
      this.authenticatedUser = user;
    });
    this.postService.getPostCount().subscribe(postCount => {
      this.length = postCount['postCount'];
    });
    this.postService.getPosts(this.pageSize, this.pageIndex * this.pageSize).subscribe((posts: Post[]) => {
      this.posts = posts;
    });
  }

  post() {
    this.postService.setPost(this.postObj).subscribe((newPost: Post) => {
      this.posts.unshift(newPost);
      this.length ++;
    });
  }

  ngOnInit() {
  }

  alterPage() {
    this.navigate(this.pageEvent.pageIndex);
    this.postService.getPosts(this.pageEvent.pageSize, this.pageEvent.pageIndex * this.pageEvent.pageSize).subscribe((posts: Post[]) => {
      this.posts = posts;
    });
  }

  navigate(pagen: number) {
    this.router.navigate([], {queryParams: {page: pagen}, relativeTo: this.route},);
  }

  openDialog(toEdit): void {
    let dialogRef = this.dialog.open(ImageUploadComponent, {width: 'auto', data: {toEdit: toEdit}});
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.postObj.image = result;
    });
  }

  toggleLike(post: Post, idx: number) {
    let like = new Like();
    like.post = post;
    this.postService.setLike(like).subscribe((newPost: Post) => {
      this.posts[idx] = newPost;
    });
  }

  onKeyPress($event) {
    if ($event.keyCode === 13) {
      this.post();
    }
  }
}
