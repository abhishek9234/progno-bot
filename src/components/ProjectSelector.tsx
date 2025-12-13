import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FolderKanban, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JiraProject } from "@/types/project";

interface ProjectSelectorProps {
  projects: JiraProject[];
  selectedProject: JiraProject | null;
  onSelectProject: (project: JiraProject) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export function ProjectSelector({
  projects,
  selectedProject,
  onSelectProject,
  onRefresh,
  isLoading
}: ProjectSelectorProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
          <FolderKanban className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Project</p>
          <Select
            value={selectedProject?.key || ""}
            onValueChange={(key) => {
              const project = projects.find(p => p.key === key);
              if (project) onSelectProject(project);
            }}
          >
            <SelectTrigger className="w-[280px] bg-secondary border-border/50 text-foreground font-medium">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {projects.map((project) => (
                <SelectItem 
                  key={project.id} 
                  value={project.key}
                  className="focus:bg-secondary"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs font-mono">
                      {project.key}
                    </Badge>
                    <span>{project.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onRefresh}
        disabled={isLoading}
        className="border-border/50 hover:bg-secondary"
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  );
}
