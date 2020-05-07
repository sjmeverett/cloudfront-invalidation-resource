import { CloudFrontInvalidationOptions } from './CloudFrontInvalidationOptions';
import {
  createCloudFormationCustomResource,
  CloudFormationCustomResourceProperties,
} from '@sjmeverett/cloudformation-types';
import { createLambdaFnWithRole } from '@sjmeverett/cloudformation-lambda';

export interface CreateCloudFrontInvalidationOptions
  extends CloudFrontInvalidationOptions,
    CloudFormationCustomResourceProperties {}

export function createCloudFrontInvalidation(
  name: string,
  options: CreateCloudFrontInvalidationOptions,
) {
  return createCloudFormationCustomResource(name, options);
}

export function createCloudFrontInvalidationResources(
  bucket: string,
  key: string,
) {
  return createLambdaFnWithRole('CloudFrontInvalidationResource', {
    Code: {
      S3Bucket: bucket,
      S3Key: key,
    },
    Handler: 'index.handler',
    Runtime: 'nodejs12.x',
    Timeout: 120,
    AllowLogging: true,
    Policies: [
      {
        PolicyName: 'CloudFrontInvalidationResourcePolicy',
        PolicyDocument: {
          Statement: [
            {
              Action: ['cloudfront:CreateInvalidation'],
              Effect: 'Allow',
              Sid: 'AddPerm',
              Resource: '*',
            },
          ],
        },
      },
    ],
  });
}
