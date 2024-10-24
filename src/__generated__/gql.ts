/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query GetMe {\n    me {\n      id\n      email\n      name\n      username\n    }\n  }\n": types.GetMeDocument,
    "\nquery GetDeployments {\n  projects {\n    edges {\n      node {\n        id\n        name\n        services {\n          edges {\n            node {\n              id\n              name\n              serviceInstances {\n                edges {\n                  node {\n                    environmentId\n                    source {\n                      image\n                    }\n                    latestDeployment {\n                      id\n                      status\n                    }\n                    domains {\n                      serviceDomains {\n                        domain\n                        id\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n": types.GetDeploymentsDocument,
    "\n  query getLogs($deploymentId: String!) {\n    deploymentLogs(deploymentId: $deploymentId) {\n      message\n      severity\n      timestamp\n    }\n\n    buildLogs(deploymentId: $deploymentId) {\n      message\n      severity\n      timestamp\n    }\n  }\n": types.GetLogsDocument,
    "\n  mutation createProject {\n    projectCreate(\n      input: {\n      }\n    ) {\n      id\n    }\n  }\n": types.CreateProjectDocument,
    "\n  mutation createService($projectId: String!, $image: String!, $name: String) {\n    serviceCreate(\n      input: {\n        projectId: $projectId,\n        name: $name,\n        source: { image: $image}\n      }\n    ) {\n      id\n      name\n    }\n  }\n": types.CreateServiceDocument,
    "\n  mutation deleteProject($projectId: String!) {\n    projectDelete(id: $projectId)\n  }\n": types.DeleteProjectDocument,
    "\n  mutation createServiceDomain($serviceId: String!, $environmentId: String!, $targetPort: Int!) {\n    serviceDomainCreate(\n      input: {\n        serviceId: $serviceId,\n        environmentId: $environmentId,\n        targetPort: $targetPort\n      }\n    ) {\n      id\n      domain\n    }\n  }\n": types.CreateServiceDomainDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetMe {\n    me {\n      id\n      email\n      name\n      username\n    }\n  }\n"): (typeof documents)["\n  query GetMe {\n    me {\n      id\n      email\n      name\n      username\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery GetDeployments {\n  projects {\n    edges {\n      node {\n        id\n        name\n        services {\n          edges {\n            node {\n              id\n              name\n              serviceInstances {\n                edges {\n                  node {\n                    environmentId\n                    source {\n                      image\n                    }\n                    latestDeployment {\n                      id\n                      status\n                    }\n                    domains {\n                      serviceDomains {\n                        domain\n                        id\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"): (typeof documents)["\nquery GetDeployments {\n  projects {\n    edges {\n      node {\n        id\n        name\n        services {\n          edges {\n            node {\n              id\n              name\n              serviceInstances {\n                edges {\n                  node {\n                    environmentId\n                    source {\n                      image\n                    }\n                    latestDeployment {\n                      id\n                      status\n                    }\n                    domains {\n                      serviceDomains {\n                        domain\n                        id\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getLogs($deploymentId: String!) {\n    deploymentLogs(deploymentId: $deploymentId) {\n      message\n      severity\n      timestamp\n    }\n\n    buildLogs(deploymentId: $deploymentId) {\n      message\n      severity\n      timestamp\n    }\n  }\n"): (typeof documents)["\n  query getLogs($deploymentId: String!) {\n    deploymentLogs(deploymentId: $deploymentId) {\n      message\n      severity\n      timestamp\n    }\n\n    buildLogs(deploymentId: $deploymentId) {\n      message\n      severity\n      timestamp\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation createProject {\n    projectCreate(\n      input: {\n      }\n    ) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation createProject {\n    projectCreate(\n      input: {\n      }\n    ) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation createService($projectId: String!, $image: String!, $name: String) {\n    serviceCreate(\n      input: {\n        projectId: $projectId,\n        name: $name,\n        source: { image: $image}\n      }\n    ) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation createService($projectId: String!, $image: String!, $name: String) {\n    serviceCreate(\n      input: {\n        projectId: $projectId,\n        name: $name,\n        source: { image: $image}\n      }\n    ) {\n      id\n      name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation deleteProject($projectId: String!) {\n    projectDelete(id: $projectId)\n  }\n"): (typeof documents)["\n  mutation deleteProject($projectId: String!) {\n    projectDelete(id: $projectId)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation createServiceDomain($serviceId: String!, $environmentId: String!, $targetPort: Int!) {\n    serviceDomainCreate(\n      input: {\n        serviceId: $serviceId,\n        environmentId: $environmentId,\n        targetPort: $targetPort\n      }\n    ) {\n      id\n      domain\n    }\n  }\n"): (typeof documents)["\n  mutation createServiceDomain($serviceId: String!, $environmentId: String!, $targetPort: Int!) {\n    serviceDomainCreate(\n      input: {\n        serviceId: $serviceId,\n        environmentId: $environmentId,\n        targetPort: $targetPort\n      }\n    ) {\n      id\n      domain\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;