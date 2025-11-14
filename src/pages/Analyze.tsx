import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Shield, ArrowLeft, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const textSchema = z.string()
  .trim()
  .min(10, "Text must be at least 10 characters")
  .max(5000, "Text must be less than 5000 characters");

const Analyze = () => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [hasConsent, setHasConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasConsent) {
      toast.error("You must confirm that you have consent to analyze this content");
      return;
    }

    try {
      // Validate text
      textSchema.parse(text);

      setLoading(true);

      // Call the edge function
      const { data, error } = await supabase.functions.invoke('analyze-text', {
        body: { text }
      });

      if (error) {
        console.error("Analysis error:", error);
        if (error.message.includes("429")) {
          toast.error("Rate limit exceeded. Please try again in a moment.");
        } else if (error.message.includes("402")) {
          toast.error("AI service credits exhausted. Please contact support.");
        } else {
          toast.error("Failed to analyze text. Please try again.");
        }
        return;
      }

      if (!data) {
        toast.error("No response from analysis service");
        return;
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be signed in to save analysis");
        return;
      }

      // Save to database
      const { error: saveError } = await supabase
        .from('analyses')
        .insert({
          user_id: user.id,
          text_content: text,
          text_score: data.text_score,
          final_score: data.final_score,
          sentiment_analysis: data.sentiment_analysis,
          linguistic_analysis: data.linguistic_analysis,
          emotional_analysis: data.emotional_analysis,
          has_consent: hasConsent
        });

      if (saveError) {
        console.error("Save error:", saveError);
        toast.error("Analysis completed but failed to save");
      } else {
        toast.success("Analysis completed and saved!");
      }

      // Navigate to results with the data
      navigate("/result", { state: { analysis: data } });

    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        console.error("Error during analysis:", error);
        toast.error("An error occurred during analysis");
      }
    } finally {
      setLoading(false);
    }
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
              <h1 className="text-xl font-bold">Text Analysis</h1>
              <p className="text-xs text-muted-foreground">Analyze communication for deception indicators</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card className="border-border/50 shadow-glow">
            <CardHeader>
              <CardTitle>Enter Text to Analyze</CardTitle>
              <CardDescription>
                Paste or type the text message you want to analyze for potential deception indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAnalyze} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="text-input">Text Content</Label>
                  <Textarea
                    id="text-input"
                    placeholder="Enter the text message here... (minimum 10 characters)"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={10}
                    className="resize-none"
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">
                    {text.length} / 5000 characters
                  </p>
                </div>

                <div className="space-y-4 p-4 rounded-lg bg-accent/5 border border-accent/30">
                  <div className="flex gap-2">
                    <AlertTriangle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <div className="space-y-2 flex-1">
                      <p className="text-sm font-semibold text-accent">Consent Required</p>
                      <p className="text-sm text-muted-foreground">
                        By analyzing this content, you confirm that you have proper authorization 
                        to analyze this communication and understand that this tool provides 
                        probabilistic analysis, not absolute truth detection.
                      </p>
                      <div className="flex items-start gap-2 pt-2">
                        <Checkbox
                          id="consent"
                          checked={hasConsent}
                          onCheckedChange={(checked) => setHasConsent(checked as boolean)}
                          disabled={loading}
                        />
                        <Label 
                          htmlFor="consent" 
                          className="text-sm cursor-pointer font-normal"
                        >
                          I have permission to analyze this content and understand this is 
                          probabilistic analysis only
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || !text.trim() || !hasConsent}
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Text"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Card className="border-border/50 bg-card/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-sm mb-2">What we analyze:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Sentiment inconsistencies</li>
                  <li>• Linguistic anomalies</li>
                  <li>• Emotional mismatches</li>
                  <li>• Hesitation markers</li>
                  <li>• Contradiction patterns</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-sm mb-2">Privacy & Security:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Your data is encrypted</li>
                  <li>• Analyses are private to you</li>
                  <li>• Results saved to your account</li>
                  <li>• No data shared with third parties</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analyze;