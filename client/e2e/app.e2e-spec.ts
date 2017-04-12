import { SecretSantaPage } from './app.po';

describe('secret-santa App', () => {
  let page: SecretSantaPage;

  beforeEach(() => {
    page = new SecretSantaPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('ss works!');
  });
});
