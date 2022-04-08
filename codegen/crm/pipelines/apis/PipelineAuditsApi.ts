// TODO: better import syntax?
import { BaseAPIRequestFactory, RequiredError } from './baseapi';
import {Configuration} from '../configuration';
import { RequestContext, HttpMethod, ResponseContext, HttpFile} from '../http/http';
import * as FormData from "form-data";
import { URLSearchParams } from 'url';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';


import { CollectionResponsePublicAuditInfoNoPaging } from '../models/CollectionResponsePublicAuditInfoNoPaging';

/**
 * no description
 */
export class PipelineAuditsApiRequestFactory extends BaseAPIRequestFactory {

    /**
     * Return a reverse chronological list of all mutations that have occurred on the pipeline identified by `{pipelineId}`.
     * Return an audit of all changes to the pipeline
     * @param objectType 
     * @param pipelineId 
     */
    public async getAudit(objectType: string, pipelineId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'objectType' is not null or undefined
        if (objectType === null || objectType === undefined) {
            throw new RequiredError("PipelineAuditsApi", "getAudit", "objectType");
        }


        // verify required parameter 'pipelineId' is not null or undefined
        if (pipelineId === null || pipelineId === undefined) {
            throw new RequiredError("PipelineAuditsApi", "getAudit", "pipelineId");
        }


        // Path Params
        const localVarPath = '/crm/v3/pipelines/{objectType}/{pipelineId}/audit'
            .replace('{' + 'objectType' + '}', encodeURIComponent(String(objectType)))
            .replace('{' + 'pipelineId' + '}', encodeURIComponent(String(pipelineId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        let authMethod = null;
        // Apply auth methods
        authMethod = _config.authMethods["hapikey"]
        if (authMethod) {
            await authMethod.applySecurityAuthentication(requestContext);
        }
        // Apply auth methods
        authMethod = _config.authMethods["oauth2"]
        if (authMethod) {
            await authMethod.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

}

export class PipelineAuditsApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getAudit
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getAudit(response: ResponseContext): Promise<CollectionResponsePublicAuditInfoNoPaging > {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: CollectionResponsePublicAuditInfoNoPaging = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "CollectionResponsePublicAuditInfoNoPaging", ""
            ) as CollectionResponsePublicAuditInfoNoPaging;
            return body;
        }
        if (isCodeInRange("0", response.httpStatusCode)) {
            const body: Error = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Error", ""
            ) as Error;
            throw new ApiException<Error>(0, "An error occurred.", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: CollectionResponsePublicAuditInfoNoPaging = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "CollectionResponsePublicAuditInfoNoPaging", ""
            ) as CollectionResponsePublicAuditInfoNoPaging;
            return body;
        }

        throw new ApiException<string | Buffer | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

}
