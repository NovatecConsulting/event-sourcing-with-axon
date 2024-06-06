import gql from 'graphql-tag'
import { fi } from 'vuetify/locale'

export type Project = {
  identifier: string
  version: number
  name: string
  status: string
  startDate: string
  actualEndDate: string
  deadline: string
  statistics?: ProjectStatistics
  participants?: Participant[]
}

export type ProjectStatistics = {
  tasks: TaskStatistics
}

export type TaskStatistics = {
  all: number
  planned: number
  started: number
  completed: number
}

export type Participant = {
  identifier: string
  user: User
  company: Company
}

export class User {
  identifier: string
  firstname: string
  lastname: string
  email: string

  constructor(identifier: string, firstname: string, lastname: string, email: string) {
    this.identifier = identifier
    this.firstname = firstname
    this.lastname = lastname
    this.email = email
  }
}

export class Company {
  identifier: string
  name: string

  constructor(identifier: string, name: string) {
    this.identifier = identifier
    this.name = name
  }
}

export const GET_PROJECTS = gql`
  query getProjects {
    projects {
      identifier
      version
      name
      status
      startDate
      actualEndDate
      deadline
      statistics {
        tasks {
          all
          planned
          started
          completed
        }
      }
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

export type ProjectsQueryResults = {
  projects: Project[]
}

export const GET_PROJECT_UPDATES = gql`
  subscription getProjectUpdates {
    project {
      identifier
      version
      name
      status
      startDate
      actualEndDate
      deadline
      statistics {
        tasks {
          all
          planned
          started
          completed
        }
      }
    }
  }
`

export type ProjectUpdateResult = {
  project: Project
}

export const CREATE_PARTICIPANT = gql`
  mutation createParticipant(
    $projectIdentifier: ID!
    $companyIdentifier: ID!
    $userIdentifier: ID!
  ) {
    createParticipant(
      projectIdentifier: $projectIdentifier
      companyIdentifier: $companyIdentifier
      userIdentifier: $userIdentifier
    )
  }
`

export const COMPANIES_WITH_EMPLOYEES = gql`
  query companiesWithEmployee {
    companies {
      identifier
      name
      employees {
        user {
          identifier
          firstname
          lastname
          email
        }
        isAdmin
        isProjectManager
      }
    }
  }
`

export type CompaniesWithEmployeesQueryResult = {
  companies: CompanyWithEmployees[]
}

export type CompanyWithEmployees = {
  identifier: string
  name: string
  employees: Employee[]
}

export class Employee {
  user: User
  isAdmin: boolean
  isProjectManager: boolean

  constructor(user: User, isAdmin: boolean, isProjectManager: boolean) {
    this.user = user
    this.isAdmin = isAdmin
    this.isProjectManager = isProjectManager
  }
}
