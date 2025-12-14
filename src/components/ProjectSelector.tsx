import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
 
import { cn } from "@/lib/utils";
 
const Tabs = TabsPrimitive.Root;
 
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;
 
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
 
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;
 
export { Tabs, TabsList, TabsTrigger, TabsContent };
 
 
import { JiraProject } from "@/types/project";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FolderKanban } from "lucide-react";
 
interface ProjectSelectorProps {
  projects: JiraProject[];
  selectedProject: JiraProject | null;
  onSelectProject: (project: JiraProject) => void;
}
 
export function ProjectSelector({ projects, selectedProject, onSelectProject }: ProjectSelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <FolderKanban className="h-4 w-4" />
        <span className="text-sm font-medium">Project:</span>
      </div>
      <Select
        value={selectedProject?.id || ""}
        onValueChange={(value) => {
          const project = projects.find(p => p.id === value);
          if (project) onSelectProject(project);
        }}
      >
        <SelectTrigger className="w-64 bg-secondary border-border/50">
          <SelectValue placeholder="Select a project" />
        </SelectTrigger>
        <SelectContent>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-xs">{project.key}</Badge>
                <span>{project.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedProject && (
        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30">
          Demo Mode
        </Badge>
      )}
    </div>
  );
}
 
 