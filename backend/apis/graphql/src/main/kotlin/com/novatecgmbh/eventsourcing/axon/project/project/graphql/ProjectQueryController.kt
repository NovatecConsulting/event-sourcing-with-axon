package com.novatecgmbh.eventsourcing.axon.project.project.graphql

import com.novatecgmbh.eventsourcing.axon.application.security.RegisteredUserPrincipal
import com.novatecgmbh.eventsourcing.axon.project.project.api.*
import java.util.concurrent.CompletableFuture
import org.axonframework.extensions.kotlin.query
import org.axonframework.extensions.kotlin.queryMany
import org.axonframework.extensions.kotlin.queryOptional
import org.axonframework.messaging.responsetypes.ResponseTypes
import org.axonframework.queryhandling.QueryGateway
import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.QueryMapping
import org.springframework.graphql.data.method.annotation.SchemaMapping
import org.springframework.graphql.data.method.annotation.SubscriptionMapping
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.stereotype.Controller
import reactor.core.publisher.Flux

@Controller
class ProjectQueryController(val queryGateway: QueryGateway) {

    @QueryMapping
    fun project(@Argument identifier: ProjectId): CompletableFuture<ProjectQueryResult?> =
        queryGateway
            .queryOptional<ProjectQueryResult, ProjectQuery>(ProjectQuery(identifier))
            .thenApply { optional -> optional.orElse(null) }

    @QueryMapping
    fun projects(
        @AuthenticationPrincipal user: UsernamePasswordAuthenticationToken
    ): CompletableFuture<List<ProjectQueryResult>> =
        queryGateway.queryMany(
            MyProjectsQuery((user.principal as RegisteredUserPrincipal).identifier)
        )

    @SubscriptionMapping("project")
    fun projectUpdates(
        @AuthenticationPrincipal user: UsernamePasswordAuthenticationToken
    ): Flux<ProjectQueryResult> {
        val query =
            queryGateway.subscriptionQuery(
                MyProjectsQuery((user.principal as RegisteredUserPrincipal).identifier),
                ResponseTypes.multipleInstancesOf(ProjectQueryResult::class.java),
                ResponseTypes.instanceOf(ProjectQueryResult::class.java)
            )

        return query.updates().doFinally { query.cancel() }

        // Alternative if this function should also return the current projects before the updates
        // return queryl
        //      .initialResult()
        //      .flatMapMany { Flux.fromIterable(it) }
        //      .concatWith(query.updates())
        //      .doFinally { query.cancel() }
    }

    @SchemaMapping(typeName = "Project")
    fun statistics(project: ProjectQueryResult): CompletableFuture<ProjectStatistics> =
        queryGateway
            .query<ProjectDetailsQueryResult, ProjectDetailsQuery>(
                ProjectDetailsQuery(project.identifier)
            )
            .thenApply { result ->
                ProjectStatistics(
                    tasks =
                        TaskStatistics(
                            all = result.allTasksCount.toInt(),
                            planned = result.plannedTasksCount.toInt(),
                            started = result.startedTasksCount.toInt(),
                            completed = result.completedTasksCount.toInt()
                        )
                )
            }
}

data class ProjectStatistics(val tasks: TaskStatistics)

data class TaskStatistics(val all: Int, val planned: Int, val started: Int, val completed: Int)
