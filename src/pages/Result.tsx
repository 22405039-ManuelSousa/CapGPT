import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ArrowLeft, AlertCircle, CheckCircle2, TrendingUp, Brain, MessageSquare } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface AnalysisResult {
  text_score: number;
  final_score: number;
  confidence: "low" | "medium" | "high";
  sentiment_analysis: {
    overall_sentiment: string;
    inconsistencies: string[];
    emotional_shifts: number;
  };
  linguistic_analysis: {
    distancing_language: number;
    qualifier_overuse: number;
    unusual_phrasing: string[];
    complexity_score: number;
  };
  emotional_analysis: {
    stated_emotion: string;
    implied_emotion: string;
    mismatch_level: string;
    stress_indicators: string[];
  };
  key_findings: string[];
  interpretation: string;
}

const Result = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const analysis = location.state?.analysis as AnalysisResult;

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Analysis Found</CardTitle>
            <CardDescription>Please perform an analysis first</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/analyze")}>Go to Analyze</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score < 30) return "text-success";
    if (score < 60) return "text-accent";
    return "text-destructive";
  };

  const getScoreGradient = (score: number) => {
    if (score < 30) return "bg-gradient-success";
    if (score < 60) return "bg-gradient-primary";
    return "bg-gradient-danger";
  };

  const getConfidenceBadge = (confidence: string) => {
    const colors = {
      low: "bg-muted text-muted-foreground",
      medium: "bg-primary/20 text-primary",
      high: "bg-accent/20 text-accent"
    };
    return colors[confidence as keyof typeof colors] || colors.low;
  };

  const honestyScore = 100 - analysis.final_score;

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
              <h1 className="text-xl font-bold">Analysis Results</h1>
              <p className="text-xs text-muted-foreground">Deception probability assessment</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Main Score Card */}
          <Card className={`border-2 ${getScoreGradient(analysis.final_score)} bg-gradient-to-br from-card to-card/50 shadow-glow`}>
            <CardContent className="pt-8 pb-8">
              <div className="text-center space-y-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Deception Probability Score
                </h2>
                <div className={`text-7xl font-bold ${getScoreColor(analysis.final_score)}`}>
                  {analysis.final_score}
                  <span className="text-3xl">/100</span>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Honesty Probability</p>
                    <p className="text-2xl font-semibold text-success">{honestyScore}%</p>
                  </div>
                  <div className="h-12 w-px bg-border" />
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Confidence Level</p>
                    <Badge className={getConfidenceBadge(analysis.confidence)}>
                      {analysis.confidence.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <Progress value={analysis.final_score} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Interpretation */}
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                <CardTitle>Interpretation</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{analysis.interpretation}</p>
            </CardContent>
          </Card>

          {/* Key Findings */}
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <CardTitle>Key Findings</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {analysis.key_findings.map((finding, index) => (
                  <li key={index} className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{finding}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Detailed Analysis Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sentiment Analysis */}
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-secondary" />
                  <CardTitle className="text-lg">Sentiment Analysis</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Overall Sentiment</p>
                  <Badge variant="secondary" className="capitalize">
                    {analysis.sentiment_analysis.overall_sentiment}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Emotional Shifts</p>
                  <p className="text-2xl font-semibold">{analysis.sentiment_analysis.emotional_shifts}</p>
                </div>
                {analysis.sentiment_analysis.inconsistencies.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Inconsistencies Found</p>
                    <ul className="text-sm space-y-1">
                      {analysis.sentiment_analysis.inconsistencies.map((item, i) => (
                        <li key={i} className="text-muted-foreground">• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Linguistic Analysis */}
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-accent" />
                  <CardTitle className="text-lg">Linguistic Analysis</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Distancing Language</p>
                    <p className="text-2xl font-semibold">{analysis.linguistic_analysis.distancing_language}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Qualifier Overuse</p>
                    <p className="text-2xl font-semibold">{analysis.linguistic_analysis.qualifier_overuse}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Complexity Score</p>
                  <Progress value={analysis.linguistic_analysis.complexity_score * 10} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {analysis.linguistic_analysis.complexity_score}/10
                  </p>
                </div>
                {analysis.linguistic_analysis.unusual_phrasing.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Unusual Phrasing</p>
                    <ul className="text-sm space-y-1">
                      {analysis.linguistic_analysis.unusual_phrasing.slice(0, 3).map((phrase, i) => (
                        <li key={i} className="text-muted-foreground">• {phrase}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Emotional Analysis */}
            <Card className="border-border/50 md:col-span-2">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Emotional Analysis</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Stated Emotion</p>
                    <Badge variant="outline" className="capitalize">{analysis.emotional_analysis.stated_emotion}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Implied Emotion</p>
                    <Badge variant="outline" className="capitalize">{analysis.emotional_analysis.implied_emotion}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Mismatch Level</p>
                    <Badge 
                      variant="outline" 
                      className={`capitalize ${
                        analysis.emotional_analysis.mismatch_level === 'high' ? 'border-destructive text-destructive' : 
                        analysis.emotional_analysis.mismatch_level === 'medium' ? 'border-accent text-accent' : ''
                      }`}
                    >
                      {analysis.emotional_analysis.mismatch_level}
                    </Badge>
                  </div>
                </div>
                {analysis.emotional_analysis.stress_indicators.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Stress Indicators</p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.emotional_analysis.stress_indicators.map((indicator, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {indicator}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Disclaimer */}
          <Card className="border-accent/50 bg-accent/5">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-accent mb-1">Remember</p>
                  <p className="text-muted-foreground">
                    This analysis is probabilistic and based on communication patterns. 
                    It should NOT be used as definitive proof of deception. Many factors can 
                    influence communication style, including stress, cultural differences, 
                    and individual personality traits.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={() => navigate("/analyze")} className="flex-1">
              Analyze Another Text
            </Button>
            <Button onClick={() => navigate("/history")} variant="outline" className="flex-1">
              View History
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Result;