import { InjectionToken } from '@angular/core';
import { LANG_EN_NAME, LANG_EN_TRANS } from './lang-en';
import { LANG_VI_NAME, LANG_VI_TRANS } from './lang-vi';
import { LANG_ZH_NAME, LANG_ZH_TRANS } from './lang-zh';

// translation token
export const TRANSLATIONS = new InjectionToken('translations');

// all traslations
const dictionary = {
	[LANG_EN_NAME]: LANG_EN_TRANS,
	[LANG_VI_NAME]: LANG_VI_TRANS,
	[LANG_ZH_NAME]: LANG_ZH_TRANS,
};

// providers
export const TRANSLATION_PROVIDERS = [
	{ provide: TRANSLATIONS, useValue: dictionary }
];
