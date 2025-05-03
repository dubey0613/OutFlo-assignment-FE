import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../../components/ui/Card";
import { Campaign } from "./types";

interface CampaignFormProps {
  campaign: Campaign | null;
  onSave: (campaign: Campaign) => void;
  onCancel: () => void;
}

const CampaignForm: React.FC<CampaignFormProps> = ({
  campaign,
  onSave,
  onCancel,
}) => {
  const [form, setForm] = useState<Campaign>({
    id: "",
    name: "",
    description: "",
    status: "active",
    leads: [],
    accountIDs: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newLead, setNewLead] = useState("");
  const [newAccountID, setNewAccountID] = useState("");

  useEffect(() => {
    if (campaign) {
      setForm(campaign);
    }
  }, [campaign]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const addLead = () => {
    if (newLead && newLead.startsWith("https://linkedin.com/in/")) {
      setForm((prev) => ({
        ...prev,
        leads: [...prev.leads, newLead],
      }));
      setNewLead("");
    }
  };

  const removeLead = (index: number) => {
    setForm((prev) => ({
      ...prev,
      leads: prev.leads.filter((_, i) => i !== index),
    }));
  };

  const addAccountID = () => {
    if (newAccountID) {
      setForm((prev) => ({
        ...prev,
        accountIDs: [...prev.accountIDs, newAccountID],
      }));
      setNewAccountID("");
    }
  };

  const removeAccountID = (index: number) => {
    setForm((prev) => ({
      ...prev,
      accountIDs: prev.accountIDs.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) {
      newErrors.name = "Campaign name is required";
    }

    if (!form.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (form.leads.length === 0) {
      newErrors.leads = "At least one lead is required";
    }

    if (form.accountIDs.length === 0) {
      newErrors.accountIDs = "At least one account ID is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_HOST}/campaigns/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          status: form.status,
          leads: form.leads,
          accountIDs: form.accountIDs,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create campaign");
      }

      const savedCampaign = await response.json();

      onSave({
        ...form,
        id: savedCampaign.id || `campaign-${Date.now()}`,
      });
    } catch (error) {
      console.error("Error submitting campaign:", error);
      alert("Failed to save the campaign. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          icon={<ArrowLeft size={16} />}
          onClick={onCancel}
          className="p-0 hover:bg-transparent"
        >
          Back
        </Button>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {campaign ? "Edit Campaign" : "Create Campaign"}
        </h2>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Input
              label="Campaign Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Enter campaign name"
              fullWidth
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter campaign description"
                rows={3}
                className={`
                  w-full px-4 py-2 bg-white dark:bg-slate-800 border rounded-md
                  text-sm transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500
                  ${
                    errors.description
                      ? "border-red-500 focus:ring-red-500"
                      : "border-slate-300 dark:border-slate-600"
                  }
                `}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-sm"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="deleted">Deleted</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                LinkedIn Leads
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newLead}
                  onChange={(e) => setNewLead(e.target.value)}
                  placeholder="https://linkedin.com/in/profile"
                  fullWidth
                />
                <Button
                  type="button"
                  variant="outline"
                  icon={<Plus size={16} />}
                  onClick={addLead}
                >
                  Add
                </Button>
              </div>
              {errors.leads && (
                <p className="mt-1 text-sm text-red-500">{errors.leads}</p>
              )}
              <div className="space-y-2">
                {form.leads.map((lead, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-2 rounded-md"
                  >
                    <span className="text-sm truncate">{lead}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      icon={<X size={16} />}
                      onClick={() => removeLead(index)}
                    >
                      &nbsp;
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Account IDs
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newAccountID}
                  onChange={(e) => setNewAccountID(e.target.value)}
                  placeholder="Enter account ID"
                  fullWidth
                />
                <Button
                  type="button"
                  variant="outline"
                  icon={<Plus size={16} />}
                  onClick={addAccountID}
                >
                  Add
                </Button>
              </div>
              {errors.accountIDs && (
                <p className="mt-1 text-sm text-red-500">{errors.accountIDs}</p>
              )}
              <div className="space-y-2">
                {form.accountIDs.map((accountID, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-2 rounded-md"
                  >
                    <span className="text-sm">{accountID}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      icon={<X size={16} />}
                      onClick={() => removeAccountID(index)}
                    >
                      &nbsp;
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={<Save size={16} />}
              isLoading={isSubmitting}
            >
              {campaign ? "Update Campaign" : "Create Campaign"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CampaignForm;
