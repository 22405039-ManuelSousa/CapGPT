import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ArrowLeft, Trash2, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Analysis {
  id: string;
  text_content: string;
  final_score: number;
  created_at: string;
  sentiment_analysis: any;
  linguistic_analysis: any;
  emotional_analysis: any;
}

const History = () => {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error loading history:", error);
        toast.error("Failed to load analysis history");
      } else {
        setAnalyses(data || []);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while loading history");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this analysis?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('analyses')
        .delete()
        .eq('id', id);

      if (error) {
        toast.error("Failed to delete analysis");
      } else {
        toast.success("Analysis deleted");
        setAnalyses(analyses.filter(a => a.id !== id));
      }
    } catch (error) {
      toast.error("An error occurred while deleting");
    }
  };

  const handleView = (analysis: Analysis) => {
    navigate("/result", {
      state: {
        analysis: {
          text_score: analysis.final_score,
          final_score: analysis.final_score,
          confidence: "medium",
          sentiment_analysis: analysis.sentiment_analysis,
          linguistic_analysis: analysis.linguistic_analysis,
          emotional_analysis: analysis.emotional_analysis,
          key_findings: [],
          interpretation: "Viewing historical analysis"
        }
      }
    });
  };

  const getScoreColor = (score: number) => {
    if (score < 30) return "text-success";
    if (score < 60) return "text-accent";
    return "text-destructive";
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/")}
            className="mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Analysis History</h1>
              <p className="text-xs text-muted-foreground">View your past analysis results</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : analyses.length === 0 ? (
            <Card className="border-border/50">
              <CardContent className="py-12 text-center">
                <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Analysis History</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't performed any analyses yet
                </p>
                <Button onClick={() => navigate("/analyze")}>
                  Start Your First Analysis
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                  {analyses.length} {analyses.length === 1 ? 'analysis' : 'analyses'} found
                </p>
              </div>

              {analyses.map((analysis) => (
                <Card key={analysis.id} className="border-border/50 hover:shadow-glow transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={getScoreColor(analysis.final_score)}>
                            Score: {analysis.final_score}/100
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(analysis.created_at), 'MMM dd, yyyy • h:mm a')}
                          </span>
                        </div>
                        <CardDescription className="line-clamp-2">
                          {analysis.text_content}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(analysis)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(analysis.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default History;