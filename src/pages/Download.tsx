
import React from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download as DownloadIcon, Computer, Apple, Monitor } from "lucide-react";

const Download = () => {
  const platforms = [
    {
      name: "Windows",
      icon: <Computer className="h-6 w-6" />,
      link: "#", // Replace with actual download link when available
      description: "For Windows 10 and above (.exe)"
    },
    {
      name: "macOS",
      icon: <Apple className="h-6 w-6" />,
      link: "#", // Replace with actual download link when available
      description: "For macOS 10.15 and above (.dmg)"
    },
    {
      name: "Linux",
      icon: <Monitor className="h-6 w-6" />,
      link: "#", // Replace with actual download link when available
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
                <Button className="w-full flex items-center gap-2" asChild>
                  <a href={platform.link} download>
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
          <ol className="list-decimal pl-5 space-y-2">
            <li>Clone the repository to your local machine</li>
            <li>Run <code className="bg-background px-1 rounded">npm install</code> to install dependencies</li>
            <li>Run <code className="bg-background px-1 rounded">npm run electron:build</code> to build the desktop app</li>
            <li>Find the installer in the <code className="bg-background px-1 rounded">release</code> folder</li>
          </ol>
        </div>
      </div>
    </Layout>
  );
};

export default Download;
