import { browser, element, by } from 'protractor';

export class SecretSantaPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('ss-root h1')).getText();
  }
}
