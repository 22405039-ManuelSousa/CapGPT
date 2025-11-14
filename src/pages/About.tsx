import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ArrowLeft, AlertTriangle, Brain, Eye, Lock, CheckCircle2, XCircle } from "lucide-react";

const About = () => {
  const navigate = useNavigate();

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
              <h1 className="text-xl font-bold">About & Ethics</h1>
              <p className="text-xs text-muted-foreground">Understanding the tool and responsible use</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Hero Section */}
          <Card className="border-primary/50 bg-gradient-primary shadow-glow">
            <CardContent className="pt-8 pb-8 text-center">
              <Brain className="w-16 h-16 text-primary-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-primary-foreground mb-2">
                Social Lie Detector
              </h2>
              <p className="text-primary-foreground/80 max-w-2xl mx-auto">
                An AI-powered tool that analyzes communication patterns for behavioral 
                inconsistencies and potential deception indicators
              </p>
            </CardContent>
          </Card>

          {/* What This Tool Does */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                What This Tool Does
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Our AI analyzes text communications for patterns that MAY indicate deception, including:
              </p>
              <ul className="space-y-2">
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    <strong>Sentiment Inconsistencies:</strong> Emotional shifts that don't match the context
                  </span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    <strong>Linguistic Anomalies:</strong> Unusual word choices, overuse of qualifiers, distancing language
                  </span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    <strong>Emotional Mismatch:</strong> Differences between stated and implied emotions
                  </span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    <strong>Hesitation Markers:</strong> Uncertainty language and hedging patterns
                  </span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    <strong>Contradiction Patterns:</strong> Logical inconsistencies in the text
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* What This Tool Does NOT Do */}
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <XCircle className="w-5 h-5" />
                What This Tool Does NOT Do
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                <li className="flex gap-3">
                  <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    <strong>Detect lies with certainty:</strong> The tool provides probability scores, not absolute truth detection
                  </span>
                </li>
                <li className="flex gap-3">
                  <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    <strong>Replace human judgment:</strong> Results should be considered alongside other factors
                  </span>
                </li>
                <li className="flex gap-3">
                  <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    <strong>Account for individual differences:</strong> Communication styles vary by culture, personality, and context
                  </span>
                </li>
                <li className="flex gap-3">
                  <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    <strong>Serve as legal evidence:</strong> This tool should not be used in legal proceedings or formal investigations
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Ethical Guidelines */}
          <Card className="border-accent/50 bg-accent/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-accent" />
                Ethical Guidelines & Responsible Use
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <Eye className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-accent mb-1">Obtain Consent</p>
                    <p className="text-sm text-muted-foreground">
                      Only analyze communications you have explicit permission to analyze. 
                      Analyzing someone's messages without their knowledge may violate privacy laws.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Lock className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-accent mb-1">Respect Privacy</p>
                    <p className="text-sm text-muted-foreground">
                      Do not use this tool to surveil, manipulate, or harm others. Respect 
                      people's right to privacy in their communications.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Brain className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-accent mb-1">Consider Context</p>
                    <p className="text-sm text-muted-foreground">
                      Remember that many factors affect communication style: stress, cultural 
                      background, neurodiversity, language proficiency, and individual personality.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Shield className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-accent mb-1">Use Responsibly</p>
                    <p className="text-sm text-muted-foreground">
                      Never make important decisions about someone based solely on this tool's 
                      analysis. Use it as one data point among many, not as definitive proof.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                The tool uses advanced AI language models to analyze text for behavioral patterns:
              </p>
              <ol className="space-y-3 list-decimal list-inside">
                <li className="text-muted-foreground">
                  <strong className="text-foreground">Text Analysis:</strong> The AI examines linguistic patterns, 
                  sentiment, and emotional consistency
                </li>
                <li className="text-muted-foreground">
                  <strong className="text-foreground">Pattern Detection:</strong> Identifies markers commonly 
                  associated with deception in research
                </li>
                <li className="text-muted-foreground">
                  <strong className="text-foreground">Probability Scoring:</strong> Generates a score from 0-100 
                  indicating likelihood of deception indicators
                </li>
                <li className="text-muted-foreground">
                  <strong className="text-foreground">Detailed Breakdown:</strong> Provides specific findings 
                  and interpretations to help you understand the analysis
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Privacy & Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-2">
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    All analyses are private to your account
                  </span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    Your data is encrypted and stored securely
                  </span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    We do not share your analyses with third parties
                  </span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    You can delete your analysis history at any time
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={() => navigate("/analyze")} size="lg" className="flex-1">
              Start Analysis
            </Button>
            <Button onClick={() => navigate("/")} variant="outline" size="lg" className="flex-1">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;