
import React from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download as DownloadIcon, Computer, Apple, Monitor } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Download = () => {
  const platforms = [
    {
      name: "Windows",
      icon: <Computer className="h-6 w-6" />,
      link: "https://github.com/your-org/regency-barwise/releases/download/v1.0.0/Regency-BarWise-Setup-1.0.0.exe",
      description: "For Windows 10 and above (.exe)"
    },
    {
      name: "macOS",
      icon: <Apple className="h-6 w-6" />,
      link: "https://github.com/your-org/regency-barwise/releases/download/v1.0.0/Regency-BarWise-1.0.0.dmg",
      description: "For macOS 10.15 and above (.dmg)"
    },
    {
      name: "Linux",
      icon: <Monitor className="h-6 w-6" />,
      link: "https://github.com/your-org/regency-barwise/releases/download/v1.0.0/Regency-BarWise-1.0.0.AppImage",
      description: "For Ubuntu, Debian, etc. (.AppImage)"
    }
  ];

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Download Regency BarWise</h1>
        <p className="text-muted-foreground mb-8">
          Download the desktop version of Regency BarWise to manage your bar operations offline on your laptop.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {platforms.map((platform) => (
            <Card key={platform.name} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {platform.icon}
                  {platform.name}
                </CardTitle>
                <CardDescription>{platform.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-end">
                <Button className="w-full flex items-center gap-2">
                  <a href={platform.link} download className="flex items-center gap-2 w-full justify-center">
                    <DownloadIcon className="h-4 w-4" />
                    Download for {platform.name}
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Build Instructions</h2>
          <p className="mb-4">You can build the app yourself from source with the following steps:</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Clone the repository: <code className="bg-background px-1 rounded">git clone https://github.com/your-org/regency-barwise.git</code></li>
            <li>Install dependencies: <code className="bg-background px-1 rounded">npm install</code></li>
            <li>Build the desktop app: <code className="bg-background px-1 rounded">npm run electron:build</code></li>
            <li>Find the installer in the <code className="bg-background px-1 rounded">release</code> folder</li>
          </ol>
        </div>

        <div className="mt-8">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Need help installing?</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Installation Guide</DialogTitle>
                <DialogDescription>
                  Follow these steps to install Regency BarWise on your computer.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <h4 className="font-medium mb-2">Windows</h4>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Download the .exe file</li>
                    <li>Double-click the downloaded file</li>
                    <li>Follow the installation wizard</li>
                    <li>Launch Regency BarWise from your desktop or Start menu</li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-medium mb-2">macOS</h4>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Download the .dmg file</li>
                    <li>Open the .dmg file</li>
                    <li>Drag Regency BarWise to your Applications folder</li>
                    <li>Launch from Applications</li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Linux</h4>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Download the .AppImage file</li>
                    <li>Make it executable: <code className="bg-background px-1 rounded">chmod +x Regency-BarWise-*.AppImage</code></li>
                    <li>Run the AppImage</li>
                  </ol>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
};

export default Download;
