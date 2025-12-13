import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, User, Loader2, Sparkles } from "lucide-react";
import { AIMessage, ProjectHealth, JiraProject } from "@/types/project";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface AIAssistantProps {
  project: JiraProject | null;
  projectHealth: ProjectHealth | null;
}

export function AIAssistant({ project, projectHealth }: AIAssistantProps) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (project) {
      setMessages([{
        role: 'assistant',
        content: `Hello! I'm your AI Project Assistant for **${project.name}**. I can help you with:\n\n• Understanding project health and metrics\n• Analyzing schedule, cost, and risk factors\n• Identifying items needing follow-up or escalation\n• Providing recommendations for project improvement\n\nHow can I assist you today?`,
        timestamp: new Date()
      }]);
    }
  }, [project?.key]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !project) return;

    const userMessage: AIMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const contextData = {
        project: {
          key: project.key,
          name: project.name
        },
        health: projectHealth
      };

      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: {
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          context: contextData
        }
      });

      if (error) throw error;

      const assistantMessage: AIMessage = {
        role: 'assistant',
        content: data.response || "I apologize, but I couldn't generate a response. Please try again.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI Assistant error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I encountered an error processing your request. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="glass-card h-full flex flex-col border-l-4 border-l-primary">
      <CardHeader className="pb-3 border-b border-border/50">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="p-2 rounded-lg bg-primary/10 animate-pulse-glow">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <span className="gradient-text">AI Assistant</span>
            <p className="text-xs text-muted-foreground font-normal mt-0.5">
              Powered by Azure OpenAI
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex gap-3 animate-fade-in",
                  message.role === 'user' ? 'flex-row-reverse' : ''
                )}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className={cn(
                  "p-2 rounded-lg shrink-0",
                  message.role === 'user' 
                    ? 'bg-primary/10' 
                    : 'bg-accent/10'
                )}>
                  {message.role === 'user' ? (
                    <User className="h-4 w-4 text-primary" />
                  ) : (
                    <Sparkles className="h-4 w-4 text-accent" />
                  )}
                </div>
                <div className={cn(
                  "p-3 rounded-lg max-w-[85%] text-sm",
                  message.role === 'user'
                    ? 'bg-primary/10 text-foreground'
                    : 'bg-secondary/50 text-foreground'
                )}>
                  <div className="prose prose-sm prose-invert max-w-none">
                    {message.content.split('\n').map((line, i) => (
                      <p key={i} className="mb-1 last:mb-0">
                        {line.startsWith('•') ? (
                          <span className="flex gap-2">
                            <span className="text-primary">•</span>
                            {line.substring(1)}
                          </span>
                        ) : line.startsWith('**') ? (
                          <strong>{line.replace(/\*\*/g, '')}</strong>
                        ) : (
                          line
                        )}
                      </p>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 animate-fade-in">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Sparkles className="h-4 w-4 text-accent animate-spin" />
                </div>
                <div className="p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border/50">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={project ? "Ask about your project..." : "Select a project first"}
              disabled={!project || isLoading}
              className="bg-secondary border-border/50 focus:border-primary"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading || !project}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
