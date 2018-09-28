import { Component, OnInit } from '@angular/core';

import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  articles: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getArticles()
    .then((data) => {
      this.articles = data;
    })
    .catch((error) => {
      console.error('Error', error);
    });
  }
}
