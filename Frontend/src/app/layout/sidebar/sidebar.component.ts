import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { QuoteService } from 'src/app/service/BehaviorSubjects.service';
import * as feather from 'feather-icons';
import { NavigationEnd, Router } from '@angular/router';
export interface MenuItem {
  SubParentid: any;
  Menukey: number | string;
  Menuname: string;
  Pagename: string;
  Menuicon: string;
  Parentmenuid?: number | string | null;
  children?: MenuItem[];
  isOpen?: boolean;
}
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  isMenuVisible: any;
  role_id: any;
  currentQuote: string = '';
  sidebarMenus: any;
  constructor(private quoteService: QuoteService, private router: Router) {
     this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
       this.buildSidebarMenus();
      }
    });
  }
  @Output() toggle = new EventEmitter<void>();
  @Input() isClosed: boolean | undefined;
  @Input() isMobile: boolean = false;

  dropdowns: { [key: string]: boolean } = {
    vendorMenu: false,
  };
  isVendorsMenuOpen = false;
  isReportsMenuOpen = false;
  isclientMenuOpen = false;
  isInvoicesMenuOpen = false;
  isExportMenuOpen: boolean = false;
  isImportMenuOpen: boolean = false;
  isDocumentMenuOpen = false;
 isadminMenuOpen = false;

 toggleAdminMenu() {
    this.isadminMenuOpen = !this.isadminMenuOpen;
  }
  toggleVendorsMenu() {
    this.isVendorsMenuOpen = !this.isVendorsMenuOpen;
  }
  toggleReportMenu() {
    this.isReportsMenuOpen = !this.isReportsMenuOpen;
    if (!this.isReportsMenuOpen) {
      this.isExportMenuOpen = false;
      this.isImportMenuOpen = false;
    }
  }
  toggleExportMenu() {
    this.isExportMenuOpen = !this.isExportMenuOpen;
  }

  toggleImportMenu() {
    this.isImportMenuOpen = !this.isImportMenuOpen;
  }

  toggleclientMenu() {
    this.isclientMenuOpen = !this.isclientMenuOpen;
  }
  issettingMenuOpen = false;

  togglesettingsMenu() {
    this.issettingMenuOpen = !this.issettingMenuOpen;
  }
  toggleInvoicesMenu() {
    this.isInvoicesMenuOpen = !this.isInvoicesMenuOpen;
  }

  isApInvoicesMenuOpen = false;
  toggleApInvoicesMenu() {
    this.isApInvoicesMenuOpen = !this.isApInvoicesMenuOpen;
  }
   toggleSubMenu(menu: MenuItem): void {
    menu.isOpen = !menu.isOpen;
  }

 private buildSidebarMenus() {
    const withoutparentRaw = sessionStorage.getItem('withoutparentmenu');
    const withparentRaw = sessionStorage.getItem('withparentmenu');
    const withchildRaw = sessionStorage.getItem('withchildmenu');

    let withoutParent: MenuItem[] = [];
    let withParent: MenuItem[] = [];
    let withChild: MenuItem[] = [];

    try {
      withoutParent = withoutparentRaw ? JSON.parse(withoutparentRaw) : [];
      withParent = withparentRaw ? JSON.parse(withparentRaw) : [];
      withChild = withchildRaw ? JSON.parse(withchildRaw) : [];
    } catch (e) {
      console.error('JSON parse error:', e);
      return;
    }

    const normalize = (arr: any[]): MenuItem[] =>
      arr.map((item) => ({
        ...item,
        Menukey: +item.Menukey,
        Parentmenuid: item.Parentmenuid === '0' || item.Parentmenuid === 0 ? null : +(item.Parentmenuid ?? 0),
        SubParentid: item.SubParentid ? +item.SubParentid : null,
        isOpen: false,
      }));

    withoutParent = normalize(withoutParent);
    withParent = normalize(withParent);
    withChild = normalize(withChild);

    // Build menu hierarchy
    this.sidebarMenus = withoutParent.map((parent) => {
      const subMenus = withParent
        .filter((sub) => sub.Parentmenuid === parent.Menukey)
        .map((sub) => {
          const childMenus = withChild.filter((child) => child.SubParentid === sub.Menukey);
          return { ...sub, children: childMenus.length ? childMenus : undefined };
        });
      return { ...parent, children: subMenus.length ? subMenus : undefined };
    });

    this.loadFeatherIcons();
  }
 


  ngOnInit(): void {
    this.quoteService.currentQuote.subscribe(() => {
      this.rolesdatas();
     
    });
  }
  rolesdatas() {
    this.role_id = sessionStorage.getItem('User_Roleid');
    this.loadFeatherIcons();
    this.isMobile = this.detectMobile();
  }
  detectMobile(): boolean {

    this.loadFeatherIcons();
    return window.innerWidth <= 768;
  }
  togglemobile() {
    this.toggle.emit();
    this.loadFeatherIcons();
  }
  loadFeatherIcons() {
    
    feather.replace();
  }
  toggleDocumentationMenu() {
    this.isDocumentMenuOpen = !this.isDocumentMenuOpen;
  }
  toggleMenu(menu: any) {
  menu.expanded = !menu.expanded;
}

}