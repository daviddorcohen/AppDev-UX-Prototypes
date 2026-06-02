import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type {
  Archetype,
  MigrationTarget,
  MtaApplication,
  MigrationIssue,
  ActionHistoryEntry,
  ActionType,
  ActionStatus,
  MigrationStatus,
} from '../types';

// ---------------------------------------------------------------------------
// Store interface
// ---------------------------------------------------------------------------

interface MtaState {
  applications: MtaApplication[];
  archetypes: Archetype[];
  migrationTargets: MigrationTarget[];
  issues: MigrationIssue[];
  actionHistory: ActionHistoryEntry[];
}

export interface ArchetypeMatch {
  archetype: Archetype;
  matchedCount: number;
  totalTags: number;
}

export interface AggregateStats {
  totalApps: number;
  inProgress: number;
  completed: number;
  totalCriticalIssues: number;
  totalStoryPoints: number;
}

interface MtaStoreValue extends MtaState {
  addApplication: (app: Omit<MtaApplication, 'id'>) => string;
  updateApplication: (
    id: string,
    updates: Partial<Omit<MtaApplication, 'id'>>,
  ) => void;
  getApplicationById: (id: string) => MtaApplication | undefined;
  getApplicationByEntityRef: (entityRef: string) => MtaApplication | undefined;

  simulateDiscovery: (repoUrl: string) => Promise<string[]>;
  matchArchetype: (tags: string[]) => ArchetypeMatch | undefined;
  getArchetypeById: (id: string) => Archetype | undefined;
  getTargetsForArchetype: (archetypeId: string) => MigrationTarget[];
  getMigrationTargetById: (id: string) => MigrationTarget | undefined;

  getIssuesForApp: (appId: string) => MigrationIssue[];
  getActionsForApp: (appId: string) => ActionHistoryEntry[];
  executeAction: (
    appId: string,
    action: ActionType,
    triggeredBy: 'architect' | 'developer',
  ) => void;

  getAggregateStats: () => AggregateStats;
  isRepoAlreadyOnboarded: (repoUrl: string) => boolean;
}

// ---------------------------------------------------------------------------
// Initial mock data
// ---------------------------------------------------------------------------

const initialArchetypes: Archetype[] = [
  {
    id: 'arch-1',
    name: 'Legacy Java Monolith',
    description:
      'Traditional Java EE application running on JBoss EAP or WebLogic',
    matchingTags: ['Java EE', 'JBoss EAP', 'Hibernate', 'JSP', 'EJB', 'WebLogic'],
    icon: 'StorageIcon',
  },
  {
    id: 'arch-2',
    name: 'Spring MVC Application',
    description:
      'Spring Framework MVC application with embedded servlet container',
    matchingTags: ['Spring MVC', 'Spring Boot', 'Tomcat', 'Maven', 'Spring Data'],
    icon: 'AccountTreeIcon',
  },
  {
    id: 'arch-3',
    name: 'Node.js Microservice',
    description: 'Node.js-based microservice with Express or Fastify',
    matchingTags: ['Node.js', 'Express', 'npm', 'TypeScript', 'REST API'],
    icon: 'CodeIcon',
  },
];

const initialMigrationTargets: MigrationTarget[] = [
  {
    id: 'target-1',
    name: 'Migrate to Quarkus on OpenShift',
    description:
      'Modernize Java EE apps to Quarkus with cloud-native optimizations',
    platform: 'OpenShift',
  },
  {
    id: 'target-2',
    name: 'Migrate to Spring Boot on OpenShift',
    description:
      'Upgrade Spring MVC to Spring Boot 3.x with containerized deployment',
    platform: 'OpenShift',
  },
  {
    id: 'target-3',
    name: 'Migrate to JBoss EAP 8 on OpenShift',
    description: 'Upgrade to latest JBoss EAP with Jakarta EE 10',
    platform: 'OpenShift',
  },
  {
    id: 'target-4',
    name: 'Containerize for Kubernetes',
    description:
      'Containerize existing application for vanilla Kubernetes deployment',
    platform: 'Kubernetes',
  },
];

const archetypeTargetMap: Record<string, string[]> = {
  'arch-1': ['target-1', 'target-3'],
  'arch-2': ['target-2', 'target-4'],
  'arch-3': ['target-4'],
};

const initialApplications: MtaApplication[] = [
  {
    id: 'app-1',
    name: 'inventory-service',
    repoUrl: 'https://github.com/konveyor-ecosystem/inventory-service',
    discoveredTags: ['Java EE', 'Hibernate', 'JBoss EAP', 'JSP', 'EJB'],
    archetypeId: 'arch-1',
    migrationTargetId: 'target-1',
    status: 'In Progress',
    issuesCount: 42,
    criticalIssues: 8,
    storyPoints: 18,
    filesAffected: 127,
    entityRef: 'component:default/inventory-service',
  },
  {
    id: 'app-2',
    name: 'order-management',
    repoUrl: 'https://github.com/konveyor-ecosystem/order-management',
    discoveredTags: ['Spring MVC', 'Hibernate', 'Maven', 'Tomcat', 'Spring Data'],
    archetypeId: 'arch-2',
    migrationTargetId: 'target-2',
    status: 'Analysis',
    issuesCount: 23,
    criticalIssues: 3,
    storyPoints: 11,
    filesAffected: 64,
    entityRef: 'component:default/order-management',
  },
  {
    id: 'app-3',
    name: 'customer-portal',
    repoUrl: 'https://github.com/konveyor-ecosystem/customer-portal',
    discoveredTags: ['Java EE', 'JSP', 'JBoss EAP', 'EJB', 'JMS'],
    archetypeId: 'arch-1',
    migrationTargetId: 'target-3',
    status: 'Remediation',
    issuesCount: 56,
    criticalIssues: 12,
    storyPoints: 24,
    filesAffected: 189,
    entityRef: 'component:default/customer-portal',
  },
  {
    id: 'app-4',
    name: 'notification-hub',
    repoUrl: 'https://github.com/konveyor-ecosystem/notification-hub',
    discoveredTags: ['Node.js', 'Express', 'npm', 'TypeScript', 'REST API'],
    archetypeId: 'arch-3',
    migrationTargetId: 'target-4',
    status: 'Completed',
    issuesCount: 7,
    criticalIssues: 0,
    storyPoints: 3,
    filesAffected: 22,
    entityRef: 'component:default/notification-hub',
  },
  {
    id: 'app-5',
    name: 'data-pipeline',
    repoUrl: 'https://github.com/konveyor-ecosystem/data-pipeline',
    discoveredTags: ['Java EE', 'Hibernate', 'Spring MVC', 'JBoss EAP', 'Batch'],
    archetypeId: 'arch-1',
    migrationTargetId: 'target-1',
    status: 'Not Started',
    issuesCount: 0,
    criticalIssues: 0,
    storyPoints: 0,
    filesAffected: 0,
    entityRef: 'component:default/data-pipeline',
  },
];

const initialIssues: MigrationIssue[] = [
  // inventory-service (app-1)
  { id: 'issue-1', appId: 'app-1', severity: 'critical', category: 'api-change', description: 'javax.ejb.SessionBean replaced by jakarta.ejb.SessionBean in Jakarta EE', file: 'src/main/java/com/app/service/OrderBean.java', line: 42, aiFixAvailable: true },
  { id: 'issue-2', appId: 'app-1', severity: 'critical', category: 'api-change', description: 'javax.persistence.Entity replaced by jakarta.persistence.Entity', file: 'src/main/java/com/app/model/Inventory.java', line: 8, aiFixAvailable: true },
  { id: 'issue-3', appId: 'app-1', severity: 'critical', category: 'dependency', description: 'hibernate-core 5.x not supported on Quarkus, upgrade to 6.x', file: 'pom.xml', line: 67, aiFixAvailable: false },
  { id: 'issue-4', appId: 'app-1', severity: 'major', category: 'configuration', description: 'persistence.xml uses deprecated Hibernate dialect org.hibernate.dialect.MySQL5Dialect', file: 'src/main/resources/META-INF/persistence.xml', line: 12, aiFixAvailable: true },
  { id: 'issue-5', appId: 'app-1', severity: 'major', category: 'code-pattern', description: 'EJB @Stateless annotation requires migration to CDI @ApplicationScoped', file: 'src/main/java/com/app/service/InventoryService.java', line: 15, aiFixAvailable: true },
  { id: 'issue-6', appId: 'app-1', severity: 'minor', category: 'configuration', description: 'web.xml servlet mappings should be converted to JAX-RS annotations', file: 'src/main/webapp/WEB-INF/web.xml', line: 23, aiFixAvailable: true },
  { id: 'issue-7', appId: 'app-1', severity: 'minor', category: 'deployment', description: 'jboss-deployment-structure.xml is not applicable to Quarkus', file: 'src/main/webapp/WEB-INF/jboss-deployment-structure.xml', line: 1, aiFixAvailable: false },
  { id: 'issue-8', appId: 'app-1', severity: 'info', category: 'code-pattern', description: 'Consider replacing JSP views with Qute templates for Quarkus', file: 'src/main/webapp/views/inventory.jsp', line: 1, aiFixAvailable: false },
  // order-management (app-2)
  { id: 'issue-9', appId: 'app-2', severity: 'critical', category: 'dependency', description: 'Spring MVC 4.x EOL — upgrade to Spring Boot 3.x with Spring MVC 6', file: 'pom.xml', line: 34, aiFixAvailable: false },
  { id: 'issue-10', appId: 'app-2', severity: 'major', category: 'api-change', description: 'javax.servlet.* imports must migrate to jakarta.servlet.*', file: 'src/main/java/com/app/controller/OrderController.java', line: 5, aiFixAvailable: true },
  { id: 'issue-11', appId: 'app-2', severity: 'major', category: 'configuration', description: 'application.properties datasource config needs Spring Boot 3.x format', file: 'src/main/resources/application.properties', line: 18, aiFixAvailable: true },
  { id: 'issue-12', appId: 'app-2', severity: 'minor', category: 'code-pattern', description: 'WebMvcConfigurerAdapter deprecated — extend WebMvcConfigurer directly', file: 'src/main/java/com/app/config/WebConfig.java', line: 10, aiFixAvailable: true },
  // customer-portal (app-3)
  { id: 'issue-13', appId: 'app-3', severity: 'critical', category: 'api-change', description: 'javax.jms.ConnectionFactory replaced by jakarta.jms.ConnectionFactory', file: 'src/main/java/com/app/messaging/NotificationSender.java', line: 22, aiFixAvailable: true },
  { id: 'issue-14', appId: 'app-3', severity: 'critical', category: 'dependency', description: 'JBoss EAP 7.x modules not compatible with EAP 8 — review module dependencies', file: 'src/main/webapp/WEB-INF/jboss-deployment-structure.xml', line: 5, aiFixAvailable: false },
  { id: 'issue-15', appId: 'app-3', severity: 'major', category: 'code-pattern', description: 'EJB @MessageDriven requires migration to Jakarta Messaging 3.1 annotations', file: 'src/main/java/com/app/messaging/OrderListener.java', line: 8, aiFixAvailable: true },
  { id: 'issue-16', appId: 'app-3', severity: 'minor', category: 'configuration', description: 'standalone-full.xml JMS subsystem config needs EAP 8 schema update', file: 'configuration/standalone-full.xml', line: 142, aiFixAvailable: false },
];

const now = Date.now();
const day = 86400000;

const initialActionHistory: ActionHistoryEntry[] = [
  { id: 'action-1', appId: 'app-1', action: 'run-analysis', timestamp: new Date(now - 7 * day).toISOString(), status: 'completed', triggeredBy: 'architect' },
  { id: 'action-2', appId: 'app-1', action: 'trigger-ai-remediator', timestamp: new Date(now - 5 * day).toISOString(), status: 'completed', triggeredBy: 'architect' },
  { id: 'action-3', appId: 'app-1', action: 'generate-deployment-assets', timestamp: new Date(now - 3 * day).toISOString(), status: 'completed', triggeredBy: 'architect' },
  { id: 'action-4', appId: 'app-2', action: 'run-analysis', timestamp: new Date(now - 6 * day).toISOString(), status: 'completed', triggeredBy: 'architect' },
  { id: 'action-5', appId: 'app-3', action: 'run-analysis', timestamp: new Date(now - 4 * day).toISOString(), status: 'completed', triggeredBy: 'architect' },
  { id: 'action-6', appId: 'app-3', action: 'trigger-ai-remediator', timestamp: new Date(now - 2 * day).toISOString(), status: 'completed', triggeredBy: 'architect' },
  { id: 'action-7', appId: 'app-4', action: 'run-analysis', timestamp: new Date(now - 8 * day).toISOString(), status: 'completed', triggeredBy: 'architect' },
  { id: 'action-8', appId: 'app-4', action: 'apply-quick-fixes', timestamp: new Date(now - 6 * day).toISOString(), status: 'completed', triggeredBy: 'developer' },
];

// ---------------------------------------------------------------------------
// Discovery tag sets
// ---------------------------------------------------------------------------

const javaEeTags = ['Java EE', 'Hibernate', 'JBoss EAP', 'JSP', 'EJB'];
const springTags = ['Spring MVC', 'Maven', 'Tomcat', 'Spring Data', 'Hibernate'];
const nodeTags = ['Node.js', 'Express', 'npm', 'TypeScript', 'REST API'];

function tagsForUrl(repoUrl: string): string[] {
  const repoName = repoUrl.toLowerCase().replace(/\/+$/, '').split('/').pop() || '';
  if (repoName.includes('notification') || repoName.includes('hub')) return nodeTags;
  if (repoName.includes('spring')) return springTags;
  if (repoName.includes('order') || repoName.includes('management')) return springTags;
  return javaEeTags;
}

// ---------------------------------------------------------------------------
// Context + Provider
// ---------------------------------------------------------------------------

const MtaContext = createContext<MtaStoreValue | null>(null);

let idCounter = 100;
function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

export function MtaStoreProvider(props: { children: React.ReactNode }) {
  const [applications, setApplications] =
    useState<MtaApplication[]>(initialApplications);
  const [issues, setIssues] = useState<MigrationIssue[]>(initialIssues);
  const [actionHistory, setActionHistory] =
    useState<ActionHistoryEntry[]>(initialActionHistory);

  const archetypes = initialArchetypes;
  const migrationTargets = initialMigrationTargets;

  // -- Application CRUD -----------------------------------------------------

  const addApplication = useCallback(
    (app: Omit<MtaApplication, 'id'>): string => {
      const id = nextId('app');
      setApplications(prev => [...prev, { ...app, id }]);
      return id;
    },
    [],
  );

  const updateApplication = useCallback(
    (id: string, updates: Partial<Omit<MtaApplication, 'id'>>) => {
      setApplications(prev =>
        prev.map(a => (a.id === id ? { ...a, ...updates } : a)),
      );
    },
    [],
  );

  const getApplicationById = useCallback(
    (id: string) => applications.find(a => a.id === id),
    [applications],
  );

  const getApplicationByEntityRef = useCallback(
    (entityRef: string) => applications.find(a => a.entityRef === entityRef),
    [applications],
  );

  // -- Discovery ------------------------------------------------------------

  const simulateDiscovery = useCallback(
    (repoUrl: string): Promise<string[]> =>
      new Promise(resolve => {
        setTimeout(() => resolve(tagsForUrl(repoUrl)), 3000);
      }),
    [],
  );

  // -- Archetype matching ---------------------------------------------------

  const matchArchetype = useCallback(
    (tags: string[]): ArchetypeMatch | undefined => {
      if (tags.length === 0) return undefined;

      let best: ArchetypeMatch | undefined;
      for (const arch of archetypes) {
        const matched = arch.matchingTags.filter(t => tags.includes(t)).length;
        if (matched > 0 && (!best || matched > best.matchedCount)) {
          best = {
            archetype: arch,
            matchedCount: matched,
            totalTags: arch.matchingTags.length,
          };
        }
      }
      return best;
    },
    [archetypes],
  );

  const getArchetypeById = useCallback(
    (id: string) => archetypes.find(a => a.id === id),
    [archetypes],
  );

  // -- Targets --------------------------------------------------------------

  const getTargetsForArchetype = useCallback(
    (archetypeId: string): MigrationTarget[] => {
      const targetIds = archetypeTargetMap[archetypeId] ?? [];
      return migrationTargets.filter(t => targetIds.includes(t.id));
    },
    [migrationTargets],
  );

  const getMigrationTargetById = useCallback(
    (id: string) => migrationTargets.find(t => t.id === id),
    [migrationTargets],
  );

  // -- Issues ---------------------------------------------------------------

  const getIssuesForApp = useCallback(
    (appId: string) => issues.filter(i => i.appId === appId),
    [issues],
  );

  // -- Actions --------------------------------------------------------------

  const getActionsForApp = useCallback(
    (appId: string) =>
      actionHistory
        .filter(a => a.appId === appId)
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        ),
    [actionHistory],
  );

  const executeAction = useCallback(
    (
      appId: string,
      action: ActionType,
      triggeredBy: 'architect' | 'developer',
    ) => {
      const entryId = nextId('action');
      const entry: ActionHistoryEntry = {
        id: entryId,
        appId,
        action,
        timestamp: new Date().toISOString(),
        status: 'running',
        triggeredBy,
      };
      setActionHistory(prev => [entry, ...prev]);

      // Side-effects on application status
      const statusMap: Partial<Record<ActionType, MigrationStatus>> = {
        'run-analysis': 'Analysis',
        'trigger-ai-remediator': 'Remediation',
      };
      if (statusMap[action]) {
        setApplications(prev =>
          prev.map(a =>
            a.id === appId ? { ...a, status: statusMap[action]! } : a,
          ),
        );
      }

      setTimeout(() => {
        setActionHistory(prev =>
          prev.map(a =>
            a.id === entryId ? { ...a, status: 'completed' as ActionStatus } : a,
          ),
        );

        if (action === 'trigger-ai-remediator') {
          setApplications(prev =>
            prev.map(a =>
              a.id === appId
                ? { ...a, criticalIssues: Math.max(0, a.criticalIssues - 2) }
                : a,
            ),
          );
        }
        if (action === 'apply-quick-fixes') {
          setApplications(prev =>
            prev.map(a =>
              a.id === appId
                ? {
                    ...a,
                    issuesCount: Math.max(0, a.issuesCount - 3),
                    criticalIssues: Math.max(0, a.criticalIssues - 1),
                  }
                : a,
            ),
          );
        }
      }, 4000);
    },
    [],
  );

  // -- Aggregates -----------------------------------------------------------

  const getAggregateStats = useCallback((): AggregateStats => {
    const active: MigrationStatus[] = [
      'Discovery',
      'Analysis',
      'In Progress',
      'Remediation',
    ];
    return {
      totalApps: applications.length,
      inProgress: applications.filter(a => active.includes(a.status)).length,
      completed: applications.filter(a => a.status === 'Completed').length,
      totalCriticalIssues: applications.reduce(
        (sum, a) => sum + a.criticalIssues,
        0,
      ),
      totalStoryPoints: applications.reduce(
        (sum, a) => sum + a.storyPoints,
        0,
      ),
    };
  }, [applications]);

  // -- Duplicate detection --------------------------------------------------

  const isRepoAlreadyOnboarded = useCallback(
    (repoUrl: string) =>
      applications.some(
        a => a.repoUrl.toLowerCase() === repoUrl.toLowerCase(),
      ),
    [applications],
  );

  // -- Context value --------------------------------------------------------

  const value = useMemo<MtaStoreValue>(
    () => ({
      applications,
      archetypes,
      migrationTargets,
      issues,
      actionHistory,

      addApplication,
      updateApplication,
      getApplicationById,
      getApplicationByEntityRef,

      simulateDiscovery,
      matchArchetype,
      getArchetypeById,
      getTargetsForArchetype,
      getMigrationTargetById,

      getIssuesForApp,
      getActionsForApp,
      executeAction,

      getAggregateStats,
      isRepoAlreadyOnboarded,
    }),
    [
      applications,
      archetypes,
      migrationTargets,
      issues,
      actionHistory,
      addApplication,
      updateApplication,
      getApplicationById,
      getApplicationByEntityRef,
      simulateDiscovery,
      matchArchetype,
      getArchetypeById,
      getTargetsForArchetype,
      getMigrationTargetById,
      getIssuesForApp,
      getActionsForApp,
      executeAction,
      getAggregateStats,
      isRepoAlreadyOnboarded,
    ],
  );

  return <MtaContext.Provider value={value}>{props.children}</MtaContext.Provider>;
}

export function useMtaStore(): MtaStoreValue {
  const ctx = useContext(MtaContext);
  if (!ctx) {
    throw new Error('useMtaStore must be used within MtaStoreProvider');
  }
  return ctx;
}
