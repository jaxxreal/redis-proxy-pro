import convict from 'convict';
import { scheme } from './scheme';

export const config = convict(scheme);
