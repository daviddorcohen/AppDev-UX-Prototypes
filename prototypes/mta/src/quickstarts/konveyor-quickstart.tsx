import React from 'react'
import RocketIcon from '@patternfly/react-icons/dist/esm/icons/rocket-icon'

export const konveyorQuickStart = {
  metadata: {
    name: 'getting-started-konveyor',
  },
  spec: {
    displayName: 'Getting start with Konveyor',
    durationMinutes: 10,
    icon: <RocketIcon />,
    description: 'Learn how to import applications, create archetypes, and assess them for migration using Konveyor Tackle.',
    introduction: 'In this quickstart you will learn how to import applications into Konveyor Tackle, create archetypes for classification, and assess applications for migration readiness.',
    prerequisites: ['Access to the Konveyor Tackle application'],
    tasks: [
      {
        title: 'Importing applications',
        description: `In this section, we'll walk you through the process of importing your applications into Konveyor. By following these steps, you'll be able to efficiently bring your application data into the platform, setting the stage for further assessment and migration activities.

**Follow these steps to create an import applications**

[Download demo application data (csv)]{{highlight Download demo application data}}

1. From the **Migration** view, click Application inventory.
2. Click the kebab menu (\`:\`) next to analyze, and select **Import**.
3. Upload the demo applications.
4. Select **Enable automatic creation of missing entities.**
5. Click **Import**.`,
        review: {
          instructions: 'To verify you have imported applications:\n\nDo you have a list of applications in the table?',
          failedTaskHelp: 'Try importing the CSV file again from the Application inventory page.',
        },
      },
      {
        title: 'Creating an archetype',
        description: `Archetypes is an upgraded classification system for organizing applications by type that improves the application assessments through automatic tagging. By using archetypes, you can address issues such as manual copying and challenges in large-scale projects by simplifying the evaluation process.

**Follow these steps to create an Archetype**

1. From the **Migrator** view , click **Archetypes**.
2. Click **Create new archetype**.
3. Fill in the following information:
    - Name: Demo Data
    - Criteria Tags: Language/Java
    - Archetype Tags: Language/Java
4. Click **Create**.`,
        review: {
          instructions: "To verify the archetype was create do you see 'Demo Data' entry in the table?",
          failedTaskHelp: 'Navigate to Archetypes and check if the Demo Data entry appears.',
        },
      },
      {
        title: 'Assess archetype',
        description: `Assessment refers to evaluating an application to determine its readiness for migration. This involves analyzing factors such as dependencies, compatibility, and performance to make informed migration decisions.

**Follow these steps to create an import applications**

1. From the **Migrator** perspective, in the **navigation** menu, click **Archetype**.
2. Click the kebab menu (:) at the end of the 'Demo Data' row.
3. **Select** "Assess"
4. Click **Take** next to 'Legacy Pathfinder"
5. **Complete** the required questions in the Assessment.
6. Select **'Save and Review'**

Once complete you will automatically redirect to **Review**

1. Proposed Action: Retain
2. Effort estimate: Medium
3. Business criticality: 5
4. Work Priority: 3
5. **Click** 'Submit review'.`,
        review: {
          instructions: 'To verify you have assessed applications:\n\nDid you Review the applications?',
          failedTaskHelp: 'Go back to Archetypes, click the kebab menu on Demo Data, and select Assess.',
        },
      },
    ],
    conclusion: 'Congratulations! You have successfully imported applications, created an archetype, and assessed it for migration using Konveyor Tackle.',
  },
}
