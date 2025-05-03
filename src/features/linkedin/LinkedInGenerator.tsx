import React, { useState } from "react";
import { Send, Copy, CheckCircle } from "lucide-react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../../components/ui/Card";

interface LinkedInProfile {
  name: string;
  job_title: string;
  company: string;
  location: string;
  summary: string;
}

const LinkedInGenerator: React.FC = () => {
  const [profile, setProfile] = useState<LinkedInProfile>({
    name: "",
    job_title: "",
    company: "",
    location: "",
    summary: "",
  });

  const [generatedMessage, setGeneratedMessage] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is updated
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!profile.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!profile.job_title.trim()) {
      newErrors.job_title = "Job title is required";
    }

    if (!profile.company.trim()) {
      newErrors.company = "Company is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = async () => {
    if (validateForm()) {
      setIsGenerating(true);
      setGeneratedMessage("");

      try {
        const response = await fetch(
          "${import.meta.env.VITE_API_HOST}/personalized-message",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(profile),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to generate message");
        }

        const data = await response.json();
        const rawMessage = data.message;

        const formattedMessage = rawMessage
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // bold
          .replace(/\*(.*?)\*/g, "<em>$1</em>") // italic
          .replace(/\n{2,}/g, "</p><p>") // double newlines = new paragraph
          .replace(/\n/g, "<br />"); // single newline = line break

        setGeneratedMessage(`<p>${formattedMessage}</p>`);
      } catch (error) {
        console.error("Error generating message:", error);
        setGeneratedMessage("Failed to generate message. Please try again.");
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedMessage);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          LinkedIn Message Generator
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Generate personalized LinkedIn messages based on profile information.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="John Doe"
              fullWidth
            />

            <Input
              label="Job Title"
              name="job_title"
              value={profile.job_title}
              onChange={handleChange}
              error={errors.job_title}
              placeholder="Software Engineer"
              fullWidth
            />

            <Input
              label="Company"
              name="company"
              value={profile.company}
              onChange={handleChange}
              error={errors.company}
              placeholder="TechCorp"
              fullWidth
            />

            <Input
              label="Location"
              name="location"
              value={profile.location}
              onChange={handleChange}
              placeholder="San Francisco, CA"
              fullWidth
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Summary / Experience
              </label>
              <textarea
                name="summary"
                value={profile.summary}
                onChange={handleChange}
                placeholder="Experienced in AI & ML..."
                rows={5}
                className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="primary"
              icon={<Send size={16} />}
              onClick={handleGenerate}
              isLoading={isGenerating}
              fullWidth
            >
              Generate Message
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated Message</CardTitle>
          </CardHeader>
          <CardContent>
            {isGenerating ? (
              <div className="p-4 flex items-center justify-center h-64">
                <div className="flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  <p className="mt-4 text-slate-600 dark:text-slate-400">
                    Generating personalized message...
                  </p>
                </div>
              </div>
            ) : generatedMessage ? (
              <div className="prose dark:prose-invert max-w-none">
                <div className="border border-slate-200 dark:border-slate-700 rounded-md p-4 bg-slate-50 dark:bg-slate-800/50 min-h-64 relative">
                  <div
                    className="generated-message"
                    dangerouslySetInnerHTML={{ __html: generatedMessage }}
                  />
                </div>
              </div>
            ) : (
              <div className="p-4 flex items-center justify-center h-64 border border-dashed border-slate-300 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800/50">
                <p className="text-slate-500 dark:text-slate-400 text-center">
                  Fill out the profile information and click "Generate Message"
                  to create a personalized LinkedIn message.
                </p>
              </div>
            )}
          </CardContent>
          {generatedMessage && (
            <CardFooter>
              <Button
                variant={copied ? "success" : "outline"}
                icon={copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                onClick={handleCopy}
                fullWidth
              >
                {copied ? "Copied to Clipboard" : "Copy Message"}
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default LinkedInGenerator;
