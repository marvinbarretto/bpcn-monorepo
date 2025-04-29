import { ErrorHandler, Injectable } from "@angular/core";
import { BackendHealthService } from "../data-access/backend-health.service";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private backendHealthService: BackendHealthService
  ) {}

  handleError(error: any): void {
    if ( error instanceof HttpErrorResponse && (error.status === 0 || error.status === 503) ) {
      this.backendHealthService.setBackendUnavailable();
    }

    console.error('Error occurred:', error);
  }
 }
