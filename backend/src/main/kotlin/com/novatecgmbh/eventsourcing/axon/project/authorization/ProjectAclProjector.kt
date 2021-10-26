package com.novatecgmbh.eventsourcing.axon.project.authorization

import com.novatecgmbh.eventsourcing.axon.company.company.api.CompanyId
import com.novatecgmbh.eventsourcing.axon.company.employee.api.*
import com.novatecgmbh.eventsourcing.axon.project.authorization.AuthorizableAggregateTypesEnum.COMPANY
import com.novatecgmbh.eventsourcing.axon.project.authorization.PermissionEnum.CREATE_PROJECT
import com.novatecgmbh.eventsourcing.axon.user.api.UserId
import org.axonframework.config.ProcessingGroup
import org.axonframework.eventhandling.EventHandler
import org.axonframework.extensions.kotlin.query
import org.axonframework.queryhandling.QueryGateway
import org.springframework.stereotype.Component

@Component
@ProcessingGroup("project-acl-projector")
class ProjectAclProjector(
    val queryGateway: QueryGateway,
    val projectAclRepository: ProjectAclRepository
) {

  @EventHandler
  fun on(event: ProjectManagerPermissionGrantedForEmployeeEvent) =
      findEmployee(event.aggregateIdentifier).run {
        grantCreateProjectPermission(companyId, userId)
      }

  fun grantCreateProjectPermission(companyId: CompanyId, userId: UserId) =
      ProjectAcl(ProjectAclKey(COMPANY, companyId.toString(), userId, CREATE_PROJECT))
          .run(projectAclRepository::save)

  @EventHandler
  fun on(event: ProjectManagerPermissionRemovedFromEmployeeEvent) =
      findEmployee(event.aggregateIdentifier).run {
        revokeCreateProjectPermission(companyId, userId)
      }

  fun revokeCreateProjectPermission(companyId: CompanyId, userId: UserId) =
      ProjectAclKey(COMPANY, companyId.toString(), userId, CREATE_PROJECT)
          .run(projectAclRepository::deleteById)

  fun findEmployee(employeeId: EmployeeId): EmployeeQueryResult =
      queryGateway.query<EmployeeQueryResult, EmployeeQuery>(EmployeeQuery(employeeId)).get()


}
