package com.novatecgmbh.eventsourcing.axon.company.company.query

import com.novatecgmbh.eventsourcing.axon.company.company.api.CompanyId
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface CompanyProjectionRepository : JpaRepository<CompanyProjection, CompanyId> {

    fun findAllByIdentifierIn(identifier: Set<CompanyId>): List<CompanyProjection>
}
