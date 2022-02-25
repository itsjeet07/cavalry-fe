import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AnalyticsService } from '@app/@core/utils';
import { SeoService } from '@app/@core/utils';
import { TableService } from './shared/services/table.service';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  title = 'cavalry';

  data;
  constructor(private analytics: AnalyticsService, private seoService: SeoService,
    private tableService: TableService, @Inject(DOCUMENT) private _document: HTMLDocument,
    private titleService: Title) {
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();
    this.seoService.trackCanonicalChanges();
    this.tableService.getSystemConfig().subscribe((configs) => {
      this.titleService.setTitle(configs['Company Name']);
      if (configs['Favicon URL'] && configs['Favicon URL'] !== 'TBD') {
        this._document.getElementById('appFavicon').setAttribute('href', configs['Favicon URL']);
      }
      if (configs['Login Redirect']) {
        this.data = configs['Login Redirect'];
        this.tableService.getLoginVariable(this.data);
      }
      if (configs["Company Name"]) {
        this.data = configs["Company Name"];
        this.tableService.getTitleVariable(this.data);
      }
      if (configs['Dashboard Redirect']) {
        this.data = configs['Dashboard Redirect'];
        this.tableService.getRedirectVariable(this.data);
      }
      if (configs['Welcome Modal']) {
        this.data = configs['Welcome Modal'];
        this.tableService.getWelcomeVariable(this.data);
      }
      if (configs["App Logo URL"]) {
        this.data = configs["App Logo URL"];
        this.tableService.getLogoVariable(this.data);
      }
      if (configs['Login Logo URL']) {
        this.data = configs['Login Logo URL'];
        this.tableService.getLoginLogoVariable(this.data);
      }
      if (configs['App Name']) {
        this.data = configs['App Name'];
        this.tableService.getAppNameVariable(this.data);
      }



    });

  }

}