import React, { useState } from 'react';
import { PlusCircle, Search, MoreVertical, Edit, Trash2, Link2, Users } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import CampaignForm from './CampaignForm';
import { Campaign } from './types';
import { getCampaigns } from './getCampaigns';

const CampaignDashboard: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  React.useEffect(() => {
    const fetchCampaigns = async () => {
      const data = await getCampaigns();
      console.log('Fetched campaigns:', data);
      setCampaigns(data);
    };
    fetchCampaigns();
  }, []);

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCampaign = () => {
    setCurrentCampaign(null);
    setShowForm(true);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setCurrentCampaign(campaign);
    setShowForm(true);
  };

  const handleSaveCampaign = (campaign: Campaign) => {
    if (currentCampaign) {
      setCampaigns(campaigns.map(c => 
        c.id === campaign.id ? campaign : c
      ));
    } else {
      setCampaigns([...campaigns, { 
        ...campaign, 
        id: `campaign-${Date.now()}` 
      }]);
    }
    setShowForm(false);
  };

  const handleDeleteCampaign = (id: string) => {
    setCampaigns(campaigns.filter(c => c.id !== id));
    setShowDeleteConfirm(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'inactive':
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400';
      case 'deleted':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {!showForm ? (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Campaigns</h2>
            <Button 
              variant="primary" 
              icon={<PlusCircle size={16} />}
              onClick={handleAddCampaign}
            >
              New Campaign
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={16} />}
              fullWidth
              className="flex-1"
            />
          </div>
          
          {filteredCampaigns.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400">No campaigns found. Create your first campaign!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.map((campaign) => (
                <Card key={campaign.id} className="transform transition-all duration-200 hover:shadow-md">
                  <CardHeader className="flex justify-between items-start">
                    <div>
                      <CardTitle>{campaign.name}</CardTitle>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {campaign.description}
                      </p>
                    </div>
                    <div className="relative">
                      <button className="p-1 rounded-md text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                        <MoreVertical size={16} />
                      </button>
                      <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-800 rounded-md shadow-lg border border-slate-200 dark:border-slate-700 z-10 hidden">
                        <button 
                          className="flex items-center w-full px-4 py-2 text-sm text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                          onClick={() => handleEditCampaign(campaign)}
                        >
                          <Edit size={14} className="mr-2" />
                          Edit
                        </button>
                        <button 
                          className="flex items-center w-full px-4 py-2 text-sm text-left text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                          onClick={() => setShowDeleteConfirm(campaign.id)}
                        >
                          <Trash2 size={14} className="mr-2" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</span>
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${getStatusColor(campaign.status)}`}>
                          {campaign.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          <div className="flex items-center gap-2">
                            <Link2 size={16} />
                            Leads
                          </div>
                        </span>
                        <span className="text-sm text-slate-900 dark:text-slate-100">{campaign.leads.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          <div className="flex items-center gap-2">
                            <Users size={16} />
                            Accounts
                          </div>
                        </span>
                        <span className="text-sm text-slate-900 dark:text-slate-100">{campaign.accountIDs.length}</span>
                      </div>
                      
                      <div className="pt-4 flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditCampaign(campaign)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => setShowDeleteConfirm(campaign.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-md w-full p-6">
                <h3 className="text-lg font-medium text-slate-900 dark:text-white">Confirm Deletion</h3>
                <p className="mt-2 text-slate-500 dark:text-slate-400">
                  Are you sure you want to delete this campaign? This action cannot be undone.
                </p>
                <div className="mt-4 flex justify-end gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowDeleteConfirm(null)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="danger" 
                    onClick={() => handleDeleteCampaign(showDeleteConfirm)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <CampaignForm 
          campaign={currentCampaign}
          onSave={handleSaveCampaign}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default CampaignDashboard;