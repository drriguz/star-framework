---
name: star-coverage
description: Enforces and verifies the test-coverage requirement (JaCoCo, default ≥80% line / ≥70% branch) in Spring Boot + PostgreSQL projects. Use when configuring the coverage gate in the build, checking a coverage report, or when the coverage gate fails.
---

# Coverage gate (JaCoCo)

The constitution defines the **policy** (thresholds, exclusions); this skill defines the **mechanics**. Default thresholds are ≥80% line and ≥70% branch — match whatever the project's `CONSTITUTION.md` states, since the constitution init may have adjusted them.

## Configure the gate (Maven)

```xml
<plugin>
  <groupId>org.jacoco</groupId>
  <artifactId>jacoco-maven-plugin</artifactId>
  <version>0.8.12</version>
  <executions>
    <execution>
      <goals><goal>prepare-agent</goal></goals>
    </execution>
    <execution>
      <id>check</id>
      <phase>verify</phase>
      <goals><goal>check</goal></goals>
      <configuration>
        <rules>
          <rule>
            <element>BUNDLE</element>
            <limits>
              <limit><counter>LINE</counter><value>COVEREDRATIO</value><minimum>0.80</minimum></limit>
              <limit><counter>BRANCH</counter><value>COVEREDRATIO</value><minimum>0.70</minimum></limit>
            </limits>
          </rule>
        </rules>
        <excludes>
          <exclude>**/model/dto/**</exclude>
          <exclude>**/config/**</exclude>
          <exclude>**/*Application.class</exclude>
        </excludes>
      </configuration>
    </execution>
  </executions>
</plugin>
```

Gate: `./mvnw verify` — the build **fails** below the thresholds. Report: `target/site/jacoco/index.html`.

## Configure the gate (Gradle)

```gradle
plugins { id 'jacoco' }

jacocoTestReport {
  reports { xml.required = true }
}

jacocoTestCoverageVerification {
  violationRules {
    rule {
      limit { counter = 'LINE'; value = 'COVEREDRATIO'; minimum = 0.80 }
      limit { counter = 'BRANCH'; value = 'COVEREDRATIO'; minimum = 0.70 }
    }
  }
}
check.dependsOn jacocoTestCoverageVerification
```

Gate: `./gradlew check` — fails below the thresholds. Report: `build/reports/jacoco/test/html/index.html`.

## Exclusions (default policy)

Exclude only:

- DTO records (`**/model/dto/**`) — no logic
- Configuration classes (`**/config/**`) — wiring, not behavior
- The `Application` main class

Never exclude services, controllers, repositories, entities, or validation logic. If something there is uncovered, that is a coverage problem to fix with tests — not a reason to widen the exclusions.

## Using the gate in the workflow

- **During `/implement`**: the suite is green after each phase; before finishing, run the gate once (`verify` / `check`). If it fails, read the HTML report, and add tests for the uncovered branches — they are almost always the error paths the spec already enumerates. Never weaken production code to pass, never add tests with no assertions, never widen exclusions.
- **During `/review`**: run the gate and cite the coverage percentage in the verdict's Evidence. Below the constitution's threshold is a FAIL finding.
- **During `star-constitution` inspect**: verify the gate is actually enforced in the build (plugin present, minimum at or above the constitution's threshold) — policy without mechanical enforcement is not a guard.

## Rules

- The gate must be mechanical: configured in the build, not an optional manual step.
- Coverage is a consequence of the AC tests from `star-task-split`, not a separate activity: if the gate fails, the ACs or their branches are incomplete.
- Integration tests count toward coverage, but slice tests usually dominate it. Prefer meaningful assertions over bulk.

## Definition of done

The gate is configured in the build, `verify`/`check` passes at or above the constitution's thresholds, and the report is inspectable.
