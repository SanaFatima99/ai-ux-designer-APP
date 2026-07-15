export interface UserPersona {
  name: string;
  role: string;
  goals: string[];
  painPoints: string[];
  techExp: string;
  workflow: string[];
}

export interface UserJourneyStep {
  step: number;
  stage: string;
  action: string;
  experience: string;
  painPoint: string;
}

export interface UserJourney {
  steps: UserJourneyStep[];
}

export interface IASection {
  title: string;
  items: string[];
}

export interface InformationArchitecture {
  sections: IASection[];
}

export interface ScreenItem {
  name: string;
  description: string;
  keyComponents: string[];
}

export interface DashboardSuggestion {
  layoutName: string;
  elements: string[];
  asciiWireframe: string;
  description: string;
}

export interface ScreenUIConfig {
  screenName: string;
  layout: string;
  components: string[];
  emptyState: string;
  errorState: string;
  loadingState: string;
}

export interface ColorDefinition {
  name: string;
  value: string;
  use: string;
}

export interface TypographyDefinition {
  element: string;
  font: string;
  size: string;
  weight: string;
}

export interface DesignSystem {
  colors: ColorDefinition[];
  typography: TypographyDefinition[];
  spacing: string[];
  borderRadius: string[];
  shadows: string[];
  buttonStyles: string;
  formStyles: string;
  cardStyles: string;
}

export interface ComponentRecommendation {
  component: string;
  recommendation: string;
  implementationTips: string;
}

export interface AccessibilityAudit {
  contrast: string;
  keyboard: string;
  screenReader: string;
  focusState: string;
  mobileUsability: string;
}

export interface ResponsiveDesign {
  mobile: string;
  tablet: string;
  desktop: string;
}

export interface DBField {
  name: string;
  type: string;
  description: string;
}

export interface DBEntity {
  name: string;
  fields: DBField[];
}

export interface DatabaseSuggestions {
  entities: DBEntity[];
  relationships: string[];
}

export interface APIEndpoint {
  endpoint: string;
  method: string;
  description: string;
  requestBody?: string;
  response?: string;
}

export interface TechStackItem {
  category: string;
  technology: string;
  reason: string;
}

export interface RoadmapPhase {
  phase: string;
  duration: string;
  milestones: string[];
}

export interface AIPrompts {
  gemini: string;
  chatgpt: string;
  cursor: string;
  claude: string;
  bolt: string;
  lovable: string;
  v0: string;
}

export interface MockupItem {
  type: 'Dashboard' | 'Login page' | 'Mobile screens' | 'Landing page' | 'Analytics page';
  imageUrl: string;
  prompt: string;
  isGenerating?: boolean;
  error?: string;
}

export interface ProductSummary {
  overview: string;
  problemStatement: string;
  targetUsers: string[];
  valueProposition: string;
}

export interface FeatureList {
  mustHave: string[];
  niceToHave: string[];
  futureFeatures: string[];
}

export interface Blueprint {
  id: string;
  createdAt: string;
  idea: string;
  targetAudience?: string;
  platform: string;
  industry: string;
  designStyle: string;
  brandColors: {
    primary: string;
    secondary: string;
    hexCodes: string[];
  };
  aiModel: string;
  isFavorite?: boolean;

  // AI Output
  productSummary: ProductSummary;
  features: FeatureList;
  personas: UserPersona[];
  userJourney: UserJourney;
  informationArchitecture: InformationArchitecture;
  screenList: ScreenItem[];
  dashboardSuggestions: DashboardSuggestion;
  screenByScreenUI: ScreenUIConfig[];
  designSystem: DesignSystem;
  componentLibrary: ComponentRecommendation[];
  accessibilityAudit: AccessibilityAudit;
  responsiveDesign: ResponsiveDesign;
  databaseSuggestions: DatabaseSuggestions;
  apiSuggestions: APIEndpoint[];
  folderStructure: string;
  techStack: TechStackItem[];
  developmentRoadmap: RoadmapPhase[];
  aiPrompts: AIPrompts;
  mockups?: MockupItem[];
}

export interface SavedProjectMeta {
  id: string;
  idea: string;
  createdAt: string;
  industry: string;
  platform: string;
  isFavorite: boolean;
}
