/**
 * Service for accessing and using the Strategic Plan data
 */

import strategicPlanData from '@/data/ai/strategic_plan.json';

export interface StrategicPlan {
  title: string;
  vision: string;
  mission: string;
  values: string[];
  strategic_objectives: {
    objective: string;
    activities: string[];
  }[];
  projects: {
    name: string;
    description: string;
    timeline: string;
    responsible: string;
    budget: string;
    status: string;
  }[];
  implementation_framework: {
    description: string;
  };
  monitoring_evaluation: {
    description: string;
  };
  raw_content: string;
}

class StrategicPlanService {
  private strategicPlan: StrategicPlan;

  constructor() {
    this.strategicPlan = strategicPlanData as StrategicPlan;
  }

  /**
   * Get the full strategic plan
   */
  getStrategicPlan(): StrategicPlan {
    return this.strategicPlan;
  }

  /**
   * Get the vision statement
   */
  getVision(): string {
    return this.strategicPlan.vision;
  }

  /**
   * Get the mission statement
   */
  getMission(): string {
    return this.strategicPlan.mission;
  }

  /**
   * Get the core values
   */
  getValues(): string[] {
    return this.strategicPlan.values;
  }

  /**
   * Get all strategic objectives
   */
  getStrategicObjectives(): { objective: string; activities: string[] }[] {
    return this.strategicPlan.strategic_objectives;
  }

  /**
   * Get all projects
   */
  getProjects(): { 
    name: string; 
    description: string; 
    timeline: string; 
    responsible: string; 
    budget: string; 
    status: string; 
  }[] {
    return this.strategicPlan.projects;
  }

  /**
   * Get a project by name
   */
  getProjectByName(name: string): { 
    name: string; 
    description: string; 
    timeline: string; 
    responsible: string; 
    budget: string; 
    status: string; 
  } | undefined {
    return this.strategicPlan.projects.find(
      project => project.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  /**
   * Get implementation framework
   */
  getImplementationFramework(): { description: string } {
    return this.strategicPlan.implementation_framework;
  }

  /**
   * Get monitoring and evaluation information
   */
  getMonitoringEvaluation(): { description: string } {
    return this.strategicPlan.monitoring_evaluation;
  }

  /**
   * Search the strategic plan for a specific term
   */
  search(term: string): { section: string; content: string }[] {
    const results: { section: string; content: string }[] = [];
    const lowerTerm = term.toLowerCase();

    // Search in vision
    if (this.strategicPlan.vision.toLowerCase().includes(lowerTerm)) {
      results.push({ section: 'Vision', content: this.strategicPlan.vision });
    }

    // Search in mission
    if (this.strategicPlan.mission.toLowerCase().includes(lowerTerm)) {
      results.push({ section: 'Mission', content: this.strategicPlan.mission });
    }

    // Search in values
    this.strategicPlan.values.forEach(value => {
      if (value.toLowerCase().includes(lowerTerm)) {
        results.push({ section: 'Values', content: value });
      }
    });

    // Search in strategic objectives
    this.strategicPlan.strategic_objectives.forEach(objective => {
      if (objective.objective.toLowerCase().includes(lowerTerm)) {
        results.push({ section: 'Strategic Objectives', content: objective.objective });
      }
      
      objective.activities.forEach(activity => {
        if (activity.toLowerCase().includes(lowerTerm)) {
          results.push({ 
            section: `Strategic Objective: ${objective.objective}`, 
            content: activity 
          });
        }
      });
    });

    // Search in projects
    this.strategicPlan.projects.forEach(project => {
      if (project.name.toLowerCase().includes(lowerTerm) || 
          project.description.toLowerCase().includes(lowerTerm)) {
        results.push({ 
          section: 'Projects', 
          content: `${project.name}: ${project.description}` 
        });
      }
    });

    // Search in implementation framework
    if (this.strategicPlan.implementation_framework.description.toLowerCase().includes(lowerTerm)) {
      results.push({ 
        section: 'Implementation Framework', 
        content: this.strategicPlan.implementation_framework.description 
      });
    }

    // Search in monitoring and evaluation
    if (this.strategicPlan.monitoring_evaluation.description.toLowerCase().includes(lowerTerm)) {
      results.push({ 
        section: 'Monitoring and Evaluation', 
        content: this.strategicPlan.monitoring_evaluation.description 
      });
    }

    return results;
  }

  /**
   * Get AI-generated insights based on the strategic plan
   */
  getInsights(projectId?: number): string[] {
    // In a real implementation, this would use more sophisticated AI processing
    // For now, we'll return some static insights based on the strategic plan
    const insights = [
      "The strategic plan emphasizes spiritual care and wholistic wellness in the workplace.",
      "Projects should align with the mission of being a beacon of spiritual care.",
      "Regular monitoring and evaluation is key to successful implementation.",
      "Consider how each project contributes to the overall vision."
    ];

    // Add project-specific insights if a project ID is provided
    if (projectId) {
      switch (projectId) {
        case 1: // Arundel Sabbath
          insights.push("Arundel Sabbath aligns with the strategic objective of spiritual care in institutions.");
          insights.push("Consider measuring spiritual engagement metrics for this project.");
          break;
        case 4: // Trojan Mine Church
          insights.push("The church building project supports community spiritual infrastructure.");
          insights.push("Regular progress tracking against the implementation framework is recommended.");
          break;
        case 5: // ZPCS Radio Station
          insights.push("The radio station extends spiritual care reach beyond physical presence.");
          insights.push("Consider how this project can support multiple strategic objectives simultaneously.");
          break;
      }
    }

    return insights;
  }
}

// Export a singleton instance
export const strategicPlanService = new StrategicPlanService();
export default strategicPlanService;
