import { gql} from './__generated__/gql';

export const GET_ME = gql(`
  query GetMe {
    me {
      id
      email
      name
      username
    }
  }
`);

export const GET_DEPLOYMENTS = gql(`
query GetDeployments {
  projects {
    edges {
      node {
        id
        name
        services {
          edges {
            node {
              id
              name
              serviceInstances {
                edges {
                  node {
                    environmentId
                    source {
                      image
                    }
                    latestDeployment {
                      id
                      status
                    }
                    domains {
                      serviceDomains {
                        domain
                        id
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`);

export const GET_DEPLOYMENT_LOGS = gql(`
  query getLogs($deploymentId: String!) {
    deploymentLogs(deploymentId: $deploymentId) {
      message
      severity
      timestamp
    }

    buildLogs(deploymentId: $deploymentId) {
      message
      severity
      timestamp
    }
  }
`);

export const CREATE_PROJECT = gql(`
  mutation createProject {
    projectCreate(
      input: {
      }
    ) {
      id
    }
  }
`);

export const CREATE_SERVICE = gql(`
  mutation createService($projectId: String!, $image: String!, $name: String) {
    serviceCreate(
      input: {
        projectId: $projectId,
        name: $name,
        source: { image: $image}
      }
    ) {
      id
      name
    }
  }
`);

export const DELETE_PROJECT = gql(`
  mutation deleteProject($projectId: String!) {
    projectDelete(id: $projectId)
  }
`);

export const CREATE_SERVICE_DOMAIN = gql(`
  mutation createServiceDomain($serviceId: String!, $environmentId: String!, $targetPort: Int!) {
    serviceDomainCreate(
      input: {
        serviceId: $serviceId,
        environmentId: $environmentId,
        targetPort: $targetPort
      }
    ) {
      id
      domain
    }
  }
`);
