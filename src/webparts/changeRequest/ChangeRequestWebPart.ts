import * as React from 'react';
import * as ReactDom from 'react-dom';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import ChangeRequest from './components/ChangeRequest';
import { initializeSP } from './components/services/spConfig';

export default class ChangeRequestWebPart extends BaseClientSideWebPart<any> {
  
  protected async onInit(): Promise<void> {
    await super.onInit();
    console.log("WebPart onInit - Initializing SP with context");
    initializeSP(this.context);
  }

  public render(): void {
    const element = React.createElement(ChangeRequest, {});
    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }
}