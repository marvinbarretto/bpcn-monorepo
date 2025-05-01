import { ErrorHandler, inject, Injectable } from "@angular/core";
import { BackendHealthService } from "../data-access/backend-health.service";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  handleError(error: any): void {
    const backendHealthService = inject(BackendHealthService);

    if (error instanceof HttpErrorResponse && (error.status === 0 || error.status === 503)) {
      backendHealthService.setBackendUnavailable();
    }

    console.error('Error occurred:', error);
  }
}
