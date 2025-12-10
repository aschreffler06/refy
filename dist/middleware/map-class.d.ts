import { ClassConstructor } from 'class-transformer';
import { RequestHandler } from 'express';
export declare function mapClass(cls: ClassConstructor<object>): RequestHandler;
