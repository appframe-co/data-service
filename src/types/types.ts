import { Application } from "express";

export type RoutesInput = {
  app: Application,
}

export type TErrorResponse = {
  error: string|null;
  description?: string;
  property?: string;
}

export type TDoc = {[key: string]: any}

export type TDataModel = {
  id: string;
  projectId: string;
  structureId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  doc: TDoc;
}

export type TData = {
  id: string;
  projectId: string;
  structureId: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy: string;
  updatedBy: string;
  doc: TDoc;
}

export type TDataInput = {
	id?: string, 
	createdBy: string; 
	projectId: string;
	structureId?: string;
	updatedBy?: string;
	doc?: TDoc
}

export type TStorage = {
  id: string;
  subjectField: string;
  filename: string;
  uuidName: string;
  width: number;
  height: number;
  size: number;
  mimeType: string;
  mediaContentType: string;
  src: string;
}

export type TStructure = {
  id: string;
  name: string;
  code: string;
  bricks: TBrick[];
}

export type TBrick = {
  type: string;
  name: string;
  code: string;
  validation: TValidationBrick[];
}

type TValidationBrick = {
  code: string;
  value: any;
}