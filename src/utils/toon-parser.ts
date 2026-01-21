/**
 * Parser for .toon project export files
 * Format: YAML frontmatter + Markdown tables with <!-- TOON:TableName --> markers
 */

export interface ToonProject {
  id: string;
  name: string;
  source: string;
  source_table: string;
  source_url?: string;
  repo_url?: string;
  description?: string;
  status?: string;
  category?: string;
  priority?: string;
  feasibility?: string;
  market_potential?: string;
  target_market?: string;
  estimated_cost?: string;
  development_time?: string;
  tags?: string[];
}

export interface ToonCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface ToonParseResult {
  metadata: {
    project_id: string;
    name: string;
    version: string;
    created: string;
    type: string;
  };
  summary: {
    totalProjects: number;
    productIdeas: number;
    projects: number;
    devProjects: number;
    catalog: number;
    categories: number;
  };
  categories: ToonCategory[];
  allProjects: ToonProject[];
}

/**
 * Parse a markdown table into an array of objects
 */
function parseMarkdownTable<T>(tableContent: string, headerRow: string): T[] {
  const lines = tableContent.trim().split('\n');
  if (lines.length < 2) return [];

  // Parse header
  const headers = headerRow
    .split('|')
    .map(h => h.trim())
    .filter(h => h.length > 0);

  // Skip separator line, parse data rows
  const results: T[] = [];
  for (const line of lines) {
    if (line.includes('------') || line.trim() === headerRow.trim()) continue;
    
    const values = line
      .split('|')
      .map(v => v.trim())
      .filter((_, i, arr) => i > 0 && i < arr.length - 1 || arr.length === headers.length + 2);

    // Handle the edge cases with pipe characters
    const cleanValues: string[] = [];
    let current = '';
    let inValue = false;
    
    for (const char of line) {
      if (char === '|') {
        if (inValue) {
          cleanValues.push(current.trim());
          current = '';
        }
        inValue = true;
      } else if (inValue) {
        current += char;
      }
    }
    if (current.trim()) {
      cleanValues.push(current.trim());
    }

    if (cleanValues.length >= headers.length) {
      const obj: Record<string, string | string[]> = {};
      headers.forEach((header, i) => {
        const value = cleanValues[i] || '';
        // Handle tags field specially
        if (header === 'tags' && value) {
          if (value.startsWith('[') && value.endsWith(']')) {
            obj[header] = value.slice(1, -1).split(',').map(t => t.trim()).filter(t => t);
          } else {
            obj[header] = value.split(',').map(t => t.trim()).filter(t => t);
          }
        } else {
          obj[header] = value;
        }
      });
      results.push(obj as T);
    }
  }

  return results;
}

/**
 * Extract a TOON section from content
 */
function extractToonSection(content: string, sectionName: string): string | null {
  const marker = `<!-- TOON:${sectionName} -->`;
  const startIndex = content.indexOf(marker);
  if (startIndex === -1) return null;

  const afterMarker = content.slice(startIndex + marker.length);
  
  // Find the next TOON marker or end of content
  const nextMarkerMatch = afterMarker.match(/<!-- TOON:\w+ -->/);
  const endIndex = nextMarkerMatch ? afterMarker.indexOf(nextMarkerMatch[0]) : afterMarker.length;
  
  return afterMarker.slice(0, endIndex).trim();
}

/**
 * Parse YAML frontmatter
 */
function parseFrontmatter(content: string): Record<string, string> {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return {};

  const lines = frontmatterMatch[1].split('\n');
  const result: Record<string, string> = {};
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      // Remove quotes
      if ((value.startsWith("'") && value.endsWith("'")) || 
          (value.startsWith('"') && value.endsWith('"'))) {
        value = value.slice(1, -1);
      }
      result[key] = value;
    }
  }
  
  return result;
}

/**
 * Parse summary section
 */
function parseSummary(content: string): ToonParseResult['summary'] {
  const summaryMatch = content.match(/## Summary\n([\s\S]*?)(?=\n##|\n<!--)/);
  const summary = {
    totalProjects: 0,
    productIdeas: 0,
    projects: 0,
    devProjects: 0,
    catalog: 0,
    categories: 0,
  };

  if (summaryMatch) {
    const lines = summaryMatch[1].split('\n');
    for (const line of lines) {
      const match = line.match(/- ([^:]+):\s*(\d+)/);
      if (match) {
        const key = match[1].toLowerCase().replace(/\s+/g, '');
        const value = parseInt(match[2], 10);
        if (key === 'totalprojects') summary.totalProjects = value;
        else if (key === 'productideas') summary.productIdeas = value;
        else if (key === 'projects') summary.projects = value;
        else if (key === 'devprojects') summary.devProjects = value;
        else if (key === 'catalog') summary.catalog = value;
        else if (key === 'categories') summary.categories = value;
      }
    }
  }

  return summary;
}

/**
 * Main parser function for .toon files
 */
export function parseToonFile(content: string): ToonParseResult {
  const frontmatter = parseFrontmatter(content);
  const summary = parseSummary(content);

  // Parse categories section
  const categoriesSection = extractToonSection(content, 'Categories');
  let categories: ToonCategory[] = [];
  if (categoriesSection) {
    const headerLine = '| id | name | description | icon | color |';
    categories = parseMarkdownTable<ToonCategory>(categoriesSection, headerLine);
  }

  // Parse all projects section
  const allProjectsSection = extractToonSection(content, 'AllProjects');
  let allProjects: ToonProject[] = [];
  if (allProjectsSection) {
    const headerLine = '| id | name | source | source_table | source_url | repo_url | description | status | category | priority | feasibility | market_potential | target_market | estimated_cost | development_time | tags |';
    allProjects = parseMarkdownTable<ToonProject>(allProjectsSection, headerLine);
  }

  return {
    metadata: {
      project_id: frontmatter.project_id || '',
      name: frontmatter.name || '',
      version: frontmatter.version || '',
      created: frontmatter.created || '',
      type: frontmatter.type || '',
    },
    summary,
    categories,
    allProjects,
  };
}

/**
 * Convert toon project status to database status
 */
export function normalizeStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'active': 'in_progress',
    'prototype': 'planning',
    'beta': 'in_progress',
    'releasable': 'completed',
    'stable': 'completed',
    'shelved': 'cancelled',
    'prohibited': 'cancelled',
    'new': 'planning',
    'idea': 'planning',
    'planning': 'planning',
    'in_progress': 'in_progress',
    'completed': 'completed',
    'cancelled': 'cancelled',
  };
  return statusMap[status?.toLowerCase()] || 'planning';
}
