import { EvaluateFn } from 'puppeteer';

export interface Page {
  goto(url: string, options: OptionsPage): Promise<void>;
  evaluate(pageFunction: EvaluateFn);
}

export interface OptionsPage {
  waitUntil: string;
}
