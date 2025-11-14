import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, LogOut, Scan, History, Info } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setUserEmail(user.email);
      }
    });
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      toast.success("Signed out successfully");
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Social Lie Detector</h1>
              <p className="text-xs text-muted-foreground">{userEmail}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-2">
              Welcome to <span className="bg-gradient-primary bg-clip-text text-transparent">Behavioral Analysis</span>
            </h2>
            <p className="text-muted-foreground">
              Analyze text communications for potential deception indicators
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card 
              className="cursor-pointer hover:shadow-glow transition-all border-border/50 hover:border-primary/50"
              onClick={() => navigate("/analyze")}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Scan className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>New Analysis</CardTitle>
                <CardDescription>
                  Analyze a text message for deception indicators
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-glow transition-all border-border/50 hover:border-primary/50"
              onClick={() => navigate("/history")}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <History className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle>Analysis History</CardTitle>
                <CardDescription>
                  View your past analysis results
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-glow transition-all border-border/50 hover:border-primary/50"
              onClick={() => navigate("/about")}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Info className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>About & Ethics</CardTitle>
                <CardDescription>
                  Learn how this tool works and ethical considerations
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Disclaimer */}
          <Card className="border-accent/50 bg-accent/5">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Shield className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-accent mb-1">Important Disclaimer</p>
                  <p className="text-muted-foreground">
                    This tool provides probabilistic analysis based on communication patterns. 
                    It does NOT detect lies with certainty and should not be used as the sole 
                    basis for making important decisions about others. Always obtain proper 
                    consent before analyzing someone's communications.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;