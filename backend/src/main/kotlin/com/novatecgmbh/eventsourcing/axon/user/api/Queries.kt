package com.novatecgmbh.eventsourcing.axon.user.api

data class FindUserByExternalUserIdQuery(val externalUserId: String)

data class UserQuery(val userId: UserId)

data class UserQueryResult(
    val identifier: UserId,
    val externalUserId: String,
    val firstname: String,
    val lastname: String,
)
