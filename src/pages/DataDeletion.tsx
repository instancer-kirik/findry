import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Mail, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const DataDeletion = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">Data Deletion Request</h1>
        <p className="text-muted-foreground mb-8">
          We respect your privacy and your right to control your personal data. Here's how you can request deletion of your data.
        </p>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Option 1: Delete via Account Settings
              </CardTitle>
              <CardDescription>The quickest way to delete your data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal pl-6 space-y-2">
                <li>Log in to your account</li>
                <li>Go to your Profile Settings</li>
                <li>Scroll to "Linked Accounts" to unlink any connected social accounts</li>
                <li>Contact support to request full account deletion</li>
              </ol>
              <Button asChild>
                <Link to="/profile">Go to Profile Settings</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Option 2: Email Request
              </CardTitle>
              <CardDescription>For users who cannot access their account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Send an email to our support team with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Subject line: "Data Deletion Request"</li>
                <li>The email address associated with your account</li>
                <li>Any additional identifying information</li>
              </ul>
              <Button asChild variant="outline">
                <Link to="/contact">Contact Support</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                What Data Gets Deleted
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">When you request data deletion, we will remove:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your account profile and personal information</li>
                <li>Content you've created (projects, posts, comments)</li>
                <li>Connected social account tokens and data</li>
                <li>Usage history and preferences</li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                Note: Some data may be retained for legal compliance or legitimate business purposes as outlined in our Privacy Policy.
                Data deletion requests are typically processed within 30 days.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle>Facebook/Instagram Data</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                If you connected your Facebook or Instagram account, you can also manage app permissions directly from:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Facebook: Settings → Apps and Websites</li>
                <li>Instagram: Settings → Security → Apps and Websites</li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                Removing our app from your Facebook/Instagram settings will revoke our access to your social account data.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default DataDeletion;
