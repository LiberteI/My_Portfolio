const DEFAULT_PROJECT_SCENE_LIGHT_COLOR = "#e4d5c4"

const ownershipMeta = {
    solo: {
        roleLabel: "Independent Builder"
    },
    team: {
        roleLabel: "Team Collaborator"
    }
}

const tierMeta = {
    featured: "FEATURED PROJECT",
    archive: "ARCHIVE PROJECT"
}

const formatIndexLabel = (index) => String(index + 1).padStart(2, "0")

const formatStackLabel = (skills) => skills.join(" · ")

export const mapProjectToDisplayModel = (project, index) => {
    const projectOwnershipMeta = ownershipMeta[project.ownership] ?? ownershipMeta.solo
    const badgeLabel = tierMeta[project.projectTier] ?? tierMeta.archive
    const primarySkill = project.skills[0] ?? project.topic
    const durationLabel = project.duration ?? "Duration TBD"

    return {
        slug: project.slug,
        title: project.title,
        description: project.description,
        thumbnailImage: project.thumbnailImage,
        projectionImage: project.projectionImage,
        githubLink: project.githubLink,
        scene: {
            lightColor: DEFAULT_PROJECT_SCENE_LIGHT_COLOR
        },
        meta: {
            indexLabel: formatIndexLabel(index),
            badgeLabel,
            roleLabel: projectOwnershipMeta.roleLabel,
            durationLabel,
            stackLabel: formatStackLabel(project.skills),
            categoryLabel: project.topic,
            subtitle: `${project.topic} · ${primarySkill}`
        }
    }
}

export const mapProjectsToDisplayModels = (projects) => projects.map(mapProjectToDisplayModel)
