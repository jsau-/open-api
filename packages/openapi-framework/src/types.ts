import { IOpenAPIDefaultSetter } from 'openapi-default-setter';
import { IOpenAPIRequestCoercer } from 'openapi-request-coercer';
import { IOpenAPIRequestValidator } from 'openapi-request-validator';
import { IOpenAPIResponseValidator } from 'openapi-response-validator';
import {
  IOpenAPISecurityHandler,
  SecurityHandlers,
} from 'openapi-security-handler';
import { IJsonSchema, OpenAPI, OpenAPIV2, OpenAPIV3 } from 'openapi-types';
import { Logger } from 'ts-log';
import BasePath from './BasePath';
import * as Ajv from 'ajv';
export {
  OpenAPIFrameworkArgs,
  OpenAPIFrameworkConstructorArgs,
  OpenAPIErrorTransformer,
};

export class ConsoleDebugAdapterLogger implements Logger {
  /**
   * `console.debug` is just an alias for `.log()`, and we want debug logging to be optional.
   * This class delegates to `console` and overrides `.debug()` to be a no-op.
   */
  public debug(message?: any, ...optionalParams: any[]): void {
    // no-op
  }

  public error(message?: any, ...optionalParams: any[]): void {
    console.error(message, ...optionalParams);
  }

  public info(message?: any, ...optionalParams: any[]): void {
    console.info(message, ...optionalParams);
  }

  public trace(message?: any, ...optionalParams: any[]): void {
    console.trace(message, ...optionalParams);
  }

  public warn(message?: any, ...optionalParams: any[]): void {
    console.warn(message, ...optionalParams);
  }
}

// TODO move this to openapi-request-validator
type OpenAPIErrorTransformer = ({}, {}) => object;

type PathSecurityTuple = [RegExp, SecurityRequirement[]];

interface SecurityRequirement {
  [name: string]: SecurityScope[];
}

type SecurityScope = string;

type SecurityHandlerCallback = (
  error: SecurityHandlerError,
  result: boolean
) => void;

interface SecurityHandlerError {
  status?: number;
  challenge?: string;
  message?: any;
}

export interface OpenAPIFrameworkPathObject {
  path?: string;
  module?: any;
}

export interface IOpenAPIFramework {
  featureType: string;
  loggingPrefix: string;
  name: string;
}

interface OpenAPIFrameworkConstructorArgs extends OpenAPIFrameworkArgs {
  featureType: string;
  name: string;
}

interface OpenAPIFrameworkArgs {
  apiDoc: OpenAPIV2.Document | OpenAPIV3.Document | string;
  customFormats?: { [format: string]: (arg: any) => boolean };
  customKeywords?: { [keywordName: string]: Ajv.KeywordDefinition };
  dependencies?: { [service: string]: any };
  enableObjectCoercion?: boolean;
  errorTransformer?: OpenAPIErrorTransformer;
  externalSchemas?: { [index: string]: IJsonSchema };
  pathSecurity?: PathSecurityTuple[];
  operations?: {
    [operationId: string]:
      | ((...arg: any[]) => any)
      | ((...arg: any[]) => any)[];
  };
  paths?: string | OpenAPIFrameworkPathObject[];
  pathsIgnore?: RegExp;
  routesGlob?: string;
  routesIndexFileRegExp?: RegExp;
  securityHandlers?: SecurityHandlers; // TODO define the handlers more here
  validateApiDoc?: boolean;
  logger?: Logger;
}

export interface OpenAPIFrameworkAPIContext {
  basePaths: BasePath[];
  // TODO fill this out
  getApiDoc(): any;
}

export interface OpenAPIFrameworkPathContext {
  basePaths: BasePath[];
  // TODO fill this out
  getApiDoc(): any;
  getPathDoc(): any;
}

export interface OpenAPIFrameworkOperationContext {
  additionalFeatures: any[];
  allowsFeatures: boolean;
  apiDoc: any;
  basePaths: BasePath[];
  consumes: string[];
  features: {
    coercer?: IOpenAPIRequestCoercer;
    defaultSetter?: IOpenAPIDefaultSetter;
    requestValidator?: IOpenAPIRequestValidator;
    responseValidator?: IOpenAPIResponseValidator;
    securityHandler?: IOpenAPISecurityHandler;
  };
  methodName: string;
  methodParameters: any[];
  operationDoc: any;
  operationHandler: any;
  path: string;
}

export interface OpenAPIFrameworkVisitor {
  visitApi?(context: OpenAPIFrameworkAPIContext): void;
  visitPath?(context: OpenAPIFrameworkPathContext): void;
  visitOperation?(context: OpenAPIFrameworkOperationContext): void;
}
