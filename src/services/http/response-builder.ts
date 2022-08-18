import { ApiCallback, ApiResponse, ErrorResponseBody } from './api.interfaces';
import { ErrorCode } from './error-codes';
import { BadGatewayResult, BadRequestResult, ConfigurationErrorResult, ErrorResult, ForbiddenResult, InternalServerErrorResult, NotFoundResult, UnauthorizedResult, BusinessValidationErrorResult } from './errors';
import { HttpStatusCode } from './http-status-codes';

export class ResponseBuilder {
  public static badRequest(code: string, description: string, callback: ApiCallback): void {
    const errorResult: BadRequestResult = new BadRequestResult(code, description);
    ResponseBuilder._returnAs<BadRequestResult>(errorResult, HttpStatusCode.BadRequest, callback);
  }

  public static configurationError(code: string, description: string, callback: ApiCallback): void {
    const errorResult: ConfigurationErrorResult = new ConfigurationErrorResult(code, description);
    ResponseBuilder._returnAs<ConfigurationErrorResult>(errorResult, HttpStatusCode.ConfigurationError, callback);
  }

  public static forbidden(code: string, description: string, callback: ApiCallback): void {
    const errorResult: ForbiddenResult = new ForbiddenResult(code, description);
    ResponseBuilder._returnAs<ForbiddenResult>(errorResult, HttpStatusCode.Forbidden, callback);
  }

  public static badGateway(code: string, description: string, callback: ApiCallback): void {
    const errorResult: BadGatewayResult = new BadGatewayResult(code, description);
    ResponseBuilder._returnAs<BadGatewayResult>(errorResult, HttpStatusCode.BadGateway, callback);
  }

  public static internalServerError(error: Error, callback: ApiCallback): void {
    const errorResult: InternalServerErrorResult = new InternalServerErrorResult(ErrorCode.GeneralError, JSON.stringify(error) || 'Sorry...');
    ResponseBuilder._returnAs<InternalServerErrorResult>(errorResult, HttpStatusCode.InternalServerError, callback);
  }

  public static notFound(code: string, description: string, callback: ApiCallback): void {
    const errorResult: NotFoundResult = new NotFoundResult(code, description);
    ResponseBuilder._returnAs<NotFoundResult>(errorResult, HttpStatusCode.NotFound, callback);
  }

  public static unauthorized(code: string, description: string, callback: ApiCallback): void {
    const errorResult: UnauthorizedResult = new UnauthorizedResult(code, description);
    ResponseBuilder._returnAs<UnauthorizedResult>(errorResult, HttpStatusCode.Unauthorized, callback);
  }

  public static businessError(code: string, description: string, callback: ApiCallback): void {
    const errorResult: BusinessValidationErrorResult = new BusinessValidationErrorResult(code, description);
    ResponseBuilder._returnAs<BusinessValidationErrorResult>(errorResult, HttpStatusCode.PreconditionFailed, callback);
  }

  public static ok<T>(result: T, callback: ApiCallback): void {
    ResponseBuilder._returnAs<T>(result, HttpStatusCode.Ok, callback);
  }

  public static created(callback: ApiCallback): void {
    ResponseBuilder._returnAs({}, HttpStatusCode.Created, callback);
  }

  public static noContent(callback: ApiCallback): void {
    ResponseBuilder._returnAs({}, HttpStatusCode.NoContent, callback);
  }

  private static _returnAs<T>(result: T, statusCode: number, callback: ApiCallback): void {

    const bodyObject: ErrorResponseBody | T = result instanceof ErrorResult
      ? { error: result }
	  : result;
	  
    const response: ApiResponse = {
      body: JSON.stringify(bodyObject),
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      statusCode
    };

    callback(undefined, response);
  }
}
