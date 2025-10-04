import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Building2, 
  Globe, 
  DollarSign, 
  Bell, 
  Shield, 
  Users, 
  Settings as SettingsIcon,
  Save,
  AlertCircle
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Settings = () => {
  const { user } = useAuth();
  const company = typeof user?.companyId === 'object' ? user.companyId : null;
  
  // Local state for form inputs
  const [companyName, setCompanyName] = useState(company?.name || 'ACME Pvt Ltd');
  const [currency, setCurrency] = useState(company?.currency || 'USD');
  const [timezone, setTimezone] = useState('America/New_York');
  
  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [approvalReminders, setApprovalReminders] = useState(true);
  
  // Approval settings
  const [autoApprovalLimit, setAutoApprovalLimit] = useState('100');
  const [requireManagerApproval, setRequireManagerApproval] = useState(true);
  const [requireReceiptForAll, setRequireReceiptForAll] = useState(false);

  if (user?.role !== 'Admin') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">Only administrators can access settings.</p>
        </div>
      </div>
    );
  }

  const handleSaveCompanySettings = () => {
    // TODO: Implement API call to update company settings
    console.log('Saving company settings:', { companyName, currency, timezone });
  };

  const handleSaveNotificationSettings = () => {
    // TODO: Implement API call to update notification preferences
    console.log('Saving notification settings:', { 
      emailNotifications, 
      pushNotifications, 
      approvalReminders 
    });
  };

  const handleSaveApprovalSettings = () => {
    // TODO: Implement API call to update approval settings
    console.log('Saving approval settings:', { 
      autoApprovalLimit, 
      requireManagerApproval, 
      requireReceiptForAll 
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage company settings and preferences</p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Changes to company settings will affect all users. Please review carefully before saving.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Information
            </CardTitle>
            <CardDescription>
              Basic company details and regional settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter company name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Base Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                    <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger id="timezone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                  <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                  <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                  <SelectItem value="Europe/Paris">Central European Time (CET)</SelectItem>
                  <SelectItem value="Asia/Tokyo">Japan Standard Time (JST)</SelectItem>
                  <SelectItem value="Asia/Kolkata">India Standard Time (IST)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSaveCompanySettings} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Company Settings
            </Button>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Configure how users receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send notifications via email
                </p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send browser push notifications
                </p>
              </div>
              <Switch
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Approval Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Remind managers about pending approvals
                </p>
              </div>
              <Switch
                checked={approvalReminders}
                onCheckedChange={setApprovalReminders}
              />
            </div>
            <Button onClick={handleSaveNotificationSettings} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Notification Settings
            </Button>
          </CardContent>
        </Card>

        {/* Approval Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Approval Rules
            </CardTitle>
            <CardDescription>
              Configure approval workflows and limits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="auto-approval">Auto-Approval Limit</Label>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="auto-approval"
                  type="number"
                  value={autoApprovalLimit}
                  onChange={(e) => setAutoApprovalLimit(e.target.value)}
                  placeholder="100"
                  className="max-w-32"
                />
                <span className="text-sm text-muted-foreground">
                  Expenses under this amount are auto-approved
                </span>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Manager Approval</Label>
                <p className="text-sm text-muted-foreground">
                  All expenses must be approved by a manager
                </p>
              </div>
              <Switch
                checked={requireManagerApproval}
                onCheckedChange={setRequireManagerApproval}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Receipt for All Expenses</Label>
                <p className="text-sm text-muted-foreground">
                  Make receipt upload mandatory for all submissions
                </p>
              </div>
              <Switch
                checked={requireReceiptForAll}
                onCheckedChange={setRequireReceiptForAll}
              />
            </div>
            <Button onClick={handleSaveApprovalSettings} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Approval Settings
            </Button>
          </CardContent>
        </Card>

        {/* Security & Access */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Security & Access
            </CardTitle>
            <CardDescription>
              Manage security settings and user access controls
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Manage User Roles
              </Button>
              <Button variant="outline" className="justify-start">
                <SettingsIcon className="h-4 w-4 mr-2" />
                Password Policy
              </Button>
              <Button variant="outline" className="justify-start">
                <Globe className="h-4 w-4 mr-2" />
                API Settings
              </Button>
              <Button variant="outline" className="justify-start">
                <Bell className="h-4 w-4 mr-2" />
                Audit Logs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;