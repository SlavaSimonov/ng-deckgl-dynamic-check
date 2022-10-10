import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-expandable-card',
  templateUrl: './expandable-card.component.html',
  styleUrls: ['./expandable-card.component.scss']
})
export class ExpandableCardComponent implements OnInit, OnChanges {
  @Input() minWidth: string = '0';
  @Input() defaultIsExpanded: boolean = true;
  @Input() titleText: string = '';
  @Input() titleTextExpanded: string = '';
  isExpanded: boolean = true;
  constructor() { }

  ngOnInit(): void {
    this.isExpanded = this.defaultIsExpanded;
  }

  ngOnChanges(changes:SimpleChanges):void {
    if(!this.titleTextExpanded) {
      this.titleTextExpanded = this.titleText;
    }
  }
}
