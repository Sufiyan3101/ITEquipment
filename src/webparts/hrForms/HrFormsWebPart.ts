import * as React from 'react';
import * as ReactDom from 'react-dom';

import {
  BaseClientSideWebPart
} from '@microsoft/sp-webpart-base';

import HrForms from './components/HrForms';

import { initializeSP } from './components/services/spConfig';

export interface IHrFormsWebPartProps {
  description: string;
}

export default class HrFormsWebPart
  extends BaseClientSideWebPart<IHrFormsWebPartProps> {

  protected async onInit(): Promise<void> {

    await super.onInit();

    initializeSP(this.context);
  }

  public render(): void {

    const element = React.createElement(
      HrForms,
      {}
    );

    ReactDom.render(
      element,
      this.domElement
    );
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }
}