// src/app/services/title.service.ts
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class TitleService {

  private siteName = 'Nextech'; // Aqui você pode mudar o nome do seu app

  constructor(private title: Title) {}

  setTitle(pageTitle: string): void {
    this.title.setTitle(`${pageTitle} - ${this.siteName}`);
  }
}
