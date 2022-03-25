// == Define locations for build logic ==
pluginManagement {
    repositories {
        gradlePluginPortal()
        maven("https://repo.spring.io/milestone")
    }
    includeBuild("../../build-logic")

    val springBootVersion: String by settings
    val kotlinVersion: String by settings
    val springDependencyManagementPluginVersion: String by settings
    plugins {
        id("io.spring.dependency-management") version springDependencyManagementPluginVersion
        id("org.springframework.boot") version springBootVersion
        kotlin("jvm") version kotlinVersion
        kotlin("plugin.jpa") version kotlinVersion
        kotlin("plugin.spring") version kotlinVersion
    }
}

// == Define locations for components ==
dependencyResolutionManagement {
    repositories {
        mavenCentral()
        maven("https://repo.spring.io/milestone")
    }
}
includeBuild("../../platforms")
includeBuild("../user")

// == Define the inner structure of this component ==
rootProject.name = "common"
include("api")
include("auditing")
include("application")
