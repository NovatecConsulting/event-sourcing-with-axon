import type { Participant } from '@/projects/api/project-api'
import gql from 'graphql-tag'

export type ProjectWithTasks = {
  identifier: string
  version: number
  tasks: Task[]
}

export type Task = {
  identifier: string
  version: number
  name: string
  description: string
  startDate: string
  endDate: string
  status: string
  assignee: Participant
}

export const GET_PROJECT_WITH_TASKS = gql`
  query getProjecWithTaskst($projectIdentifier: ID!) {
    project(identifier: $projectIdentifier) {
      identifier
      version
      tasks {
        identifier
        name
        description
        startDate
        endDate
        status
        assignee {
          user {
            identifier
            firstname
            lastname
            email
          }
          company {
            identifier
            name
          }
        }
      }
    }
  }
`

export type ProjectWithTasksQueryResult = {
  project: ProjectWithTasks
}

export const GET_PROJECT_WITH_PARTICIPANTS = gql`
  query getProjecWithParticipants($projectIdentifier: ID!) {
    project(identifier: $projectIdentifier) {
      participants {
        identifier
        user {
          identifier
          firstname
          lastname
          email
        }
        company {
          identifier
          name
        }
      }
    }
  }
`

export type ProjectWithParticipantsQueryResult = {
  project: ProjectWithParticipants
}

export type ProjectWithParticipants = {
  identifier: string
  participants: Participant[]
}