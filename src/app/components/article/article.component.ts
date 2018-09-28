import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  article: any;
  comments: any[] = [];
  alert = {
    status: '',
    data: '',
    show: false
  };
  comment = '';

  constructor(private activatedRoute: ActivatedRoute,
              private apiService: ApiService) {}


  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      let id = params['id'];

      this.apiService.getArticle(id)
      .subscribe((data: any) => {
        if(data && data.status && data.status === 200) {
          this.article = data.data;
          this.comments = this.article.comments;
        } else {
          this.alert.status = data.status;
          this.alert.data = data.data;
          this.alert.show = true;
        }
      })
    });
  }

  closeAlert(): void {
    this.alert.show = false;
  }

  deleteComment(commentId: string, articleId: string, idx: number): void {
    let sessionToken = JSON.parse(localStorage.getItem('currentUser'));

    this.apiService.deleteComment(articleId, commentId, sessionToken.token)
    .then(data => this.comments.splice(idx, 1))
    .catch(error => alert(error));
  }

  addComment(articleId: string): void {
    this.apiService.publishComment(this.comment, articleId)
    .subscribe((data: any) => {
      if (data) {
        this.comments = data;
        this.comment = '';
      } else {
        alert('No se ha podido añadir su comentario, inténtenlo de nuevo más tarde.');
      }
    });
  }
}
