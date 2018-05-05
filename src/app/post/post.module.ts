import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PostService} from "./post.service";
import {MaterialModule} from "../shared/material.module";
import {RouterModule} from "@angular/router";
import {UserService} from "../user/user.service";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule
  ],
  declarations: [],
  providers: [PostService, UserService]
})
export class PostModule { }
