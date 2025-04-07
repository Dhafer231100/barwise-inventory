
import React from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Download = () => {
  const platforms = [
    {
      name: "Windows",
      icon: "windows",
      link: "#", // Replace with actual download link when available
      description: "For Windows 10 and above (.exe)"
    },
    {
      name: "macOS",
      icon: "apple",
      link: "#", // Replace with actual download link when available
      description: "For macOS 10.15 and above (.dmg)"
    },
    {
      name: "Linux",
      icon: "linux",
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
                <CardTitle>{platform.name}</CardTitle>
                <CardDescription>{platform.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-end">
                <Button className="w-full" asChild>
                  <a href={platform.link} download>
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
